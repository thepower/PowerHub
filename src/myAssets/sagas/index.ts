import { takeLatest } from 'typed-redux-saga';
import { manageSagaState } from 'common';
import { loadBalanceTrigger, loadTransactionsTrigger } from '../slices/walletSlice';
import { loadBalanceSaga, loadTransactionsSaga } from './wallet';

export default function* assetsSaga() {
  yield* takeLatest(loadBalanceTrigger, manageSagaState(loadBalanceSaga));
  yield* takeLatest(loadTransactionsTrigger, manageSagaState(loadTransactionsSaga));
}
