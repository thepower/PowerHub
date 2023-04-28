import { takeLatest } from 'typed-redux-saga';
import { manageSagaState } from 'common';
import { sendTrxTrigger, sendTokenTrxTrigger } from '../slices/sendSlice';
import { sendTrxSaga, sendTokenTrxSaga } from './sendSagas';

export default function* sendSagas() {
  yield* takeLatest(sendTrxTrigger, manageSagaState(sendTrxSaga));
  yield* takeLatest(sendTokenTrxTrigger, manageSagaState(sendTokenTrxSaga));
}
