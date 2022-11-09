import { takeLatest } from 'typed-redux-saga';
import { manageSagaState } from 'common';
import { initApplication } from '../slice/applicationSlice';
import { initApplicationSaga } from './initApplicationSaga';

export default function* applicationSaga() {
  yield* takeLatest(initApplication, manageSagaState(initApplicationSaga));
}
