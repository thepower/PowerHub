import { BigNumber } from '@ethersproject/bignumber';
import {
  AddressApi,
  Evm20Contract, EvmContract, EvmCore, NetworkApi, TransactionsApi,
} from '@thepowereco/tssdk';
import { correctAmount } from '@thepowereco/tssdk/dist/utils/numbers';
import { getWalletAddress } from 'account/selectors/accountSelectors';
import { getNetworkApi, getWalletApi } from 'application/selectors';
import { t } from 'i18next';
import { cloneDeep } from 'lodash';
import { defaultABI, updateTokenAmountSaga } from 'myAssets/sagas/tokens';
import { loadBalanceSaga } from 'myAssets/sagas/wallet';
import { toast } from 'react-toastify';
import { TxBody, TxPurpose } from 'sign-and-send/typing';
import { put, select } from 'typed-redux-saga';
import {
  sendTokenTrxTrigger, sendTrxTrigger, setSentData, signAndSendTrxTrigger,
} from '../slices/sendSlice';

const { autoAddGas, autoAddFee, packAndSignTX } = TransactionsApi;

export function* sendTrxSaga({
  payload: {
    wif, from, to, comment, amount,
  },
}: ReturnType<typeof sendTrxTrigger>) {
  try {
    const WalletAPI = (yield* select(getWalletApi))!;

    const { txId }: { txId: string; status: string } =
      yield WalletAPI.makeNewTx(wif, from, to, 'SK', amount, comment ?? '', +new Date());

    yield* put(setSentData({
      txId, comment, amount, from, to,
    }));

    yield loadBalanceSaga();
  } catch (error: any) {
    toast.error(`${t('anErrorOccurredAsset')} ${error?.code}`);
  }
}

export function* sendTokenTrxSaga({
  payload: {
    wif, from, to, amount, decimals, address,
  },
}: ReturnType<typeof sendTokenTrxTrigger>) {
  try {
    const networkAPI = (yield* select(getNetworkApi))!;

    const EVM: EvmCore = yield EvmCore.build(networkAPI as NetworkApi);

    const storageSc: EvmContract = yield EvmContract.build(EVM, address, defaultABI);

    const contract = new Evm20Contract(storageSc);

    const calculatedAmount = BigNumber.from(amount).mul(BigNumber.from(10).mul(decimals)).toBigInt();

    const { txId } = yield contract.transfer(to, calculatedAmount, { wif, address: from });
    yield* put(setSentData({
      txId, comment: '', amount, from, to,
    }));

    yield updateTokenAmountSaga({ address });
  } catch (error: any) {
    toast.error(`${t('anErrorOccurredAsset')} ${error?.code}`);
  }
}

export function* singAndSendTrxSaga({
  payload: {
    wif, decodedTxBody,
  },
}: ReturnType<typeof signAndSendTrxTrigger>) {
  try {
    const networkAPI = (yield* select(getNetworkApi))!;

    const walletAddress = yield* select(getWalletAddress);
    let body = cloneDeep<TxBody>(decodedTxBody);

    const transfer = body?.p?.find((purpose) => purpose?.[0] === TxPurpose.TRANSFER);
    const transferAmount = transfer?.[2];
    const transferToken = transfer?.[1];

    const amount = transferAmount && transferToken && correctAmount(transferAmount, transferToken);

    const to = body?.to && AddressApi.hexToTextAddress(Buffer.from(body.to).toString('hex'));

    const srcFee = body?.p?.find((purpose) => purpose?.[0] === TxPurpose.SRCFEE);
    const gas = body?.p?.find((purpose) => purpose?.[0] === TxPurpose.GAS);
    const comment = body?.e?.msg;

    if (!gas) {
      body = autoAddGas(body, networkAPI.gasSettings);
    }

    if (!srcFee) {
      body = autoAddFee(body, networkAPI.feeSettings);
    }

    if (!body?.e) {
      body.e = {};
    }

    body.f = Buffer.from(AddressApi.parseTextAddress(walletAddress));
    body.s = Date.now();
    body.t = Date.now();

    const txResponse: { txId: string } = yield networkAPI.sendTxAndWaitForResponse(packAndSignTX(body, wif));

    yield* put(setSentData({
      txId: txResponse.txId, comment: comment || '', amount: amount && transferToken ? `${amount} ${transferToken}` : '-' || 0, from: walletAddress, to,
    }));
  } catch (error: any) {
    console.error(error);
    toast.error(`${t('somethingWentWrongTransaction')} ${error?.code}`);
  }
}
