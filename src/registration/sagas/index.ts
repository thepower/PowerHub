import { takeLatest } from 'typed-redux-saga';
import { manageSagaState } from 'common';
import {
  generateSeedPhrase,
  loginToWalletFromRegistration,
  createWallet,
  proceedToHub,
} from '../slice/registrationSlice';
import {
  generateSeedPhraseSaga,
  loginToWalletSaga,
  createWalletSaga,
  proceedToHubSaga,
} from './registrationSaga';

export default function* () {
  yield* takeLatest(generateSeedPhrase, manageSagaState(generateSeedPhraseSaga));
  yield* takeLatest(loginToWalletFromRegistration, manageSagaState(loginToWalletSaga));
  yield* takeLatest(createWallet, manageSagaState(createWalletSaga));
  yield* takeLatest(proceedToHub, manageSagaState(proceedToHubSaga));
}
