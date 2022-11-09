import { takeLatest } from 'typed-redux-saga';
import { manageSagaState } from 'common';
import {
  importAccountFromFile,
  loginToWallet,
  resetAccount,
  exportAccount,
} from '../slice/accountSlice';
import {
  importAccountFromFileSaga,
  loginToWalletSaga,
  resetAccountSaga,
  exportAccountSaga,
} from './accountSaga';

export default function* () {
  yield* takeLatest(importAccountFromFile, manageSagaState(importAccountFromFileSaga));
  yield* takeLatest(loginToWallet, manageSagaState(loginToWalletSaga));
  yield* takeLatest(resetAccount, manageSagaState(resetAccountSaga));
  yield* takeLatest(exportAccount, manageSagaState(exportAccountSaga));
}
