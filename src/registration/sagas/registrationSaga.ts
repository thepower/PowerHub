import { put, select } from 'typed-redux-saga';
import {
  CryptoApi,
  AddressApi,
  WalletApi,
  RegisteredAccount,
} from '@thepowereco/tssdk';
import { push } from 'connected-react-router';
import { toast } from 'react-toastify';
import { setSeedPhrase } from '../slice/registrationSlice';
import { CreateAccountStepsEnum, LoginToWalletInputType } from '../typings/registrationTypes';
import { loginToWallet, setWalletData } from '../../account/slice/accountSlice';
import { getCurrentShardSelector, getGeneratedSeedPhrase } from '../selectors/registrationSelectors';
import { AddActionType } from '../../typings/common';
import { getWalletData } from '../../account/selectors/accountSelectors';
import { RoutesEnum } from '../../application/typings/routes';
import { CURRENT_NETWORK } from '../../application/utils/applicationUtils';

export function* generateSeedPhraseSaga() {
  const phrase: string = yield CryptoApi.generateSeedPhrase();

  yield* put(setSeedPhrase({
    seedPhrase: phrase,
    nextStep: CreateAccountStepsEnum.setSeedPhrase,
  }));
}

export function* createWalletSaga({ payload }: { payload: AddActionType<{ password: string; randomChain: boolean }> }) {
  const { password, additionalAction, randomChain } = payload;
  const seedPhrase = yield* select(getGeneratedSeedPhrase);
  const shard = yield* select(getCurrentShardSelector);
  let account: RegisteredAccount;

  try {
    if (randomChain) {
      account = yield WalletApi.registerRandomChain(CURRENT_NETWORK!, seedPhrase!);
    } else {
      account = yield WalletApi.registerCertainChain(shard!, seedPhrase!);
    }

    const privateKey = CryptoApi.encryptWif(account.wif, password);

    yield put(setWalletData({
      address: account.address,
      wif: privateKey,
    }));

    additionalAction?.();
  } catch (e) {
    toast.error('Create account error');
  }
}

export function* loginToWalletSaga({ payload }: { payload: LoginToWalletInputType }) {
  const { address, seed } = payload;

  try {
    yield AddressApi.parseTextAddress(address);
    const isValidSeed: boolean = yield CryptoApi.validateMnemonic(seed);
    if (!isValidSeed) {
      toast.error('Seed phrase is not valid');
      return;
    }
  } catch (e: any) {
    toast.error(e.message);
    return;
  }

  try {
    // @ts-ignore
    const keyPair = yield CryptoApi.generateKeyPairFromSeedPhraseAndAddress(seed, address);
    const wif: string = yield CryptoApi.encryptWif(keyPair.toWIF(), payload.password);

    yield* put(loginToWallet({ address, wif }));
    yield* put(push(RoutesEnum.root));
  } catch (e) {
    toast.error('Login error');
  }
}

export function* proceedToHubSaga() {
  const { wif, address } = yield* select(getWalletData);

  yield* put(loginToWallet({ address, wif }));
  yield* put(push(RoutesEnum.root));
}
