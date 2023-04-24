import { put, select } from 'typed-redux-saga';
import { loadTransactionsTrigger } from 'myAssets/slices/transactionsSlice';
import { getWalletApi } from '../../application/selectors';
import { sendTrxTrigger, setSentData } from '../slices/sendSlice';
import { loadBalanceSaga, loadTransactionsSaga } from '../../myAssets/sagas/wallet';

export function* sendTrxSaga({
  payload: {
    wif, from, to, comment, amount,
  },
}: ReturnType<typeof sendTrxTrigger>) {
  const WalletAPI = (yield* select(getWalletApi))!;

  const { txId }: { txId: string; status: string } =
    yield WalletAPI.makeNewTx(wif, from, to, 'SK', amount, comment ?? '', +new Date());

  yield* put(setSentData({
    txId, comment, amount, from, to,
  }));

  yield loadBalanceSaga();
  yield loadTransactionsSaga({ payload: undefined, type: loadTransactionsTrigger.type });
}
