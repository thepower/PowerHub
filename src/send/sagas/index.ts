import { takeLatest } from 'typed-redux-saga';
import { manageSagaState } from 'common';
import { sendTrxTrigger, sendTokenTrxTrigger, signAndSendTrxTrigger } from '../slices/sendSlice';
import { sendTrxSaga, sendTokenTrxSaga, singAndSendTrxSaga } from './sendSagas';

export default function* sendSagas() {
  yield* takeLatest(sendTrxTrigger, manageSagaState(sendTrxSaga));
  yield* takeLatest(sendTokenTrxTrigger, manageSagaState(sendTokenTrxSaga));
  yield* takeLatest(signAndSendTrxTrigger, manageSagaState(singAndSendTrxSaga));
}
