import { manageSagaState } from 'common';
import { takeLatest } from 'typed-redux-saga';
import {
  createWallet,
  generateSeedPhrase,
  loginToWalletFromRegistration,
  proceedToHub,
} from '../slice/registrationSlice';
import {
  createWalletSaga,
  generateSeedPhraseSaga,
  loginToWalletSaga,
  proceedToHubSaga,
} from './registrationSaga';

export default function* () {
  yield* takeLatest(generateSeedPhrase, manageSagaState(generateSeedPhraseSaga));
  yield* takeLatest(loginToWalletFromRegistration, manageSagaState(loginToWalletSaga));
  yield* takeLatest(createWallet, manageSagaState(createWalletSaga));
  yield* takeLatest(proceedToHub, manageSagaState(proceedToHubSaga));
}
