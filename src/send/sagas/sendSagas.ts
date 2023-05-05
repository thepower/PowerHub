import { put, select } from 'typed-redux-saga';
import {
  Evm20Contract, EvmContract, EvmCore, NetworkApi,
} from '@thepowereco/tssdk';
import { getNetworkApi, getWalletApi } from 'application/selectors';
import { loadBalanceSaga } from 'myAssets/sagas/wallet';
import { defaultABI, updateTokenAmountSaga } from 'myAssets/sagas/tokens';
import { BigNumber } from '@ethersproject/bignumber';
import { toast } from 'react-toastify';
import {
  sendTokenTrxTrigger, sendTrxTrigger, setSentData, signAndSendTrxTrigger,
} from '../slices/sendSlice';

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
    toast.error(`An error occurred while sending the asset. Code: ${error?.code}`);
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
    toast.error(`An error occurred while sending the asset. Code: ${error?.code}`);
  }
}

export function* singAndSendTrxSaga({
  payload: {
    wif,
  },
}: ReturnType<typeof signAndSendTrxTrigger>) {
  // const WalletAPI = (yield* select(getWalletApi))!;

  // const { txId }: { txId: string; status: string } = yield WalletAPI.makeNewTx(wif, from, to, 'SK', amount, comment ?? '', +new Date());

  // yield* put(setSentData({
  //   txId, comment, amount, from, to,
  // }));

  // yield loadBalanceSaga();
  // yield loadTransactionsSaga();
}
