import { takeLatest } from 'typed-redux-saga';
import { manageSagaState } from 'common';
import { sendTrxTrigger } from '../slices/sendSlice';
import { sendTrxSaga } from './sendSagas';

export default function* sendSagas() {
  yield* takeLatest(sendTrxTrigger, manageSagaState(sendTrxSaga));
}
