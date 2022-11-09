import { spawn, all, call } from 'typed-redux-saga';
import accountSaga from '../../account/sagas';
import applicationSaga from './index';
import registrationSaga from '../../registration/sagas';
import assetsSaga from '../../myAssets/sagas';
import sendSagas from '../../send/sagas';

export default function* rootSaga() {
  const sagas = [
    applicationSaga,
    accountSaga,
    registrationSaga,
    assetsSaga,
    sendSagas,
  ];

  yield* all(sagas.map((saga) => spawn(function* () {
    while (true) {
      try {
        yield* call(saga);
        break;
      } catch (err) {
        console.error(err);
      }
    }
  })));
}
