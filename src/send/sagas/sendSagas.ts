import { BigNumber, parseFixed } from '@ethersproject/bignumber';
import {
  AddressApi, Evm20Contract, EvmContract, EvmCore, NetworkApi, TransactionsApi,
} from '@thepowereco/tssdk';
import { correctAmount } from '@thepowereco/tssdk/dist/utils/numbers';
import { getWalletAddress } from 'account/selectors/accountSelectors';
import { getNetworkApi, getWalletApi } from 'application/selectors';
import { defaultABI, updateTokenAmountSaga } from 'myAssets/sagas/tokens';
import { loadBalanceSaga } from 'myAssets/sagas/wallet';
import { toast } from 'react-toastify';
import { TxPurpose } from 'sign-and-send/typing';
import { put, select } from 'typed-redux-saga';
import i18n from 'locales/initTranslation';

import { LoadBalancePayloadType } from 'myAssets/types';
import {
  sendTokenTrxTrigger, sendTrxTrigger, setSentData, signAndSendTrxTrigger,
} from '../slices/sendSlice';

const { packAndSignTX } = TransactionsApi;

export function* sendTrxSaga({
  payload: {
    wif, from, to, comment, amount,
  },
}: ReturnType<typeof sendTrxTrigger>) {
  try {
    const WalletAPI = (yield* select(getWalletApi))!;

    const { txId }: { txId: string; status: string } = yield WalletAPI.makeNewTx(
      wif,
      from,
      to,
      'SK',
      amount,
      comment ?? '',
      +new Date(),
    );

    yield* put(
      setSentData({
        txId,
        comment,
        amount,
        from,
        to,
      }),
    );

    yield loadBalanceSaga();
  } catch (error: any) {
    toast.error(`${i18n.t('anErrorOccurredAsset')} ${error}`);
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

    const calculatedAmount = parseFixed(BigNumber.from(amount).toString(), decimals).toBigInt();

    const { txId } = yield contract.transfer(to, calculatedAmount, { wif, address: from });
    yield* put(
      setSentData({
        txId,
        comment: '',
        amount,
        from,
        to,
      }),
    );

    yield updateTokenAmountSaga({ address });
  } catch (error: any) {
    console.error(error);
    toast.error(`${i18n.t('anErrorOccurredAsset')} ${error}`);
  }
}

export function* singAndSendTrxSaga({
  payload: {
    wif, decodedTxBody, returnURL, additionalActionOnSuccess, additionalActionOnError,
  },
}: ReturnType<typeof signAndSendTrxTrigger>) {
  try {
    const networkAPI = (yield* select(getNetworkApi))!;

    const walletAddress = yield* select(getWalletAddress);

    const WalletAPI = (yield* select(getWalletApi))!;

    const balance: LoadBalancePayloadType = yield WalletAPI.loadBalance(walletAddress!);

    const fee = decodedTxBody?.p?.find((purpose) => purpose?.[0] === TxPurpose.SRCFEE);
    const feeAmount = fee?.[2] || 0;

    const gas = decodedTxBody?.p?.find((purpose) => purpose?.[0] === TxPurpose.GAS);
    const gasAmount = gas?.[2] || 0;

    const transfer = decodedTxBody?.p?.find((purpose) => purpose?.[0] === TxPurpose.TRANSFER);
    const transferAmount = transfer?.[2] || 0;
    const transferToken = transfer?.[1];

    const totalAmount = feeAmount + gasAmount + transferAmount;
    const correctedTotalCommissionAmount = totalAmount && correctAmount(totalAmount, 'SK');

    if (balance?.amount?.SK < correctedTotalCommissionAmount) {
      toast.error(i18n.t('insufficientFunds'));
      return;
    }

    const amount = transferAmount && transferToken && correctAmount(transferAmount, transferToken);

    const to = decodedTxBody?.to && AddressApi.hexToTextAddress(Buffer.from(decodedTxBody.to).toString('hex'));

    const comment = decodedTxBody?.e?.msg;
    const txResponse: { txId: string } = yield networkAPI.sendTxAndWaitForResponse(packAndSignTX(decodedTxBody, wif));
    if (txResponse.txId) {
      yield* put(
        setSentData({
          txId: txResponse.txId,
          comment: comment || '',
          amount: amount && transferToken ? `${amount} ${transferToken}` : '-' || 0,
          from: walletAddress,
          to,
          returnURL,
        }),
      );
      additionalActionOnSuccess?.(txResponse);
    } else {
      additionalActionOnError?.(txResponse);
      console.error('singAndSendTrxSagaNoTxId');
    }
  } catch (error: any) {
    additionalActionOnError?.(error?.message);
    console.error('singAndSendTrxSaga', error);
    toast.error(`${i18n.t('somethingWentWrongTransaction')} ${error}`);
  }
}
