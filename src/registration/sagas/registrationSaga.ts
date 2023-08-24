import {
  AddressApi,
  CryptoApi,
  RegisteredAccount,
  WalletApi,
} from '@thepowereco/tssdk';
import { push } from 'connected-react-router';
import { toast } from 'react-toastify';
import { put, select } from 'typed-redux-saga';
import i18n from 'locales/initTranslation';
import {
  ECPairInterface,
} from 'ecpair';
import bs58 from 'bs58';
import { getWalletData } from '../../account/selectors/accountSelectors';
import { loginToWallet, setWalletData } from '../../account/slice/accountSlice';
import { WalletRoutesEnum } from '../../application/typings/routes';
import { CURRENT_NETWORK } from '../../application/utils/applicationUtils';
import { getCurrentShardSelector, getGeneratedSeedPhrase } from '../selectors/registrationSelectors';
import { createWallet, setSeedPhrase } from '../slice/registrationSlice';
import { CreateAccountStepsEnum, LoginToWalletInputType } from '../typings/registrationTypes';

export function* generateSeedPhraseSaga() {
  const phrase: string = yield CryptoApi.generateSeedPhrase();

  yield* put(setSeedPhrase({
    seedPhrase: phrase,
    nextStep: CreateAccountStepsEnum.setSeedPhrase,
  }));
}

export function* createWalletSaga({ payload }: ReturnType<typeof createWallet>) {
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

    const encryptedWif = CryptoApi.encryptWif(account.wif, password);

    yield put(setWalletData({
      address: account.address,
      wif: encryptedWif,
    }));

    additionalAction?.();
  } catch (e) {
    toast.error(i18n.t('createAccountError'));
  }
}

export function* loginToWalletSaga({ payload }: { payload: LoginToWalletInputType }) {
  const {
    address, seedOrPrivateKey, password,
  } = payload;

  try {
    yield AddressApi.parseTextAddress(address);
  } catch (e: any) {
    toast.error(i18n.t('addressIsNotValid'));
    return;
  }

  let isValidSeed = false;
  try {
    isValidSeed = yield CryptoApi.validateMnemonic(seedOrPrivateKey);
  } catch (e: any) {
  }

  let isValidPrivateKey = null;
  if (!isValidSeed) {
    try {
      isValidPrivateKey = bs58.decode(seedOrPrivateKey);
    } catch (e: any) {
      toast.error(i18n.t('addressIsNotValid'));
      return;
    }
  }

  try {
    let wif = null;
    if (isValidSeed) {
      const keyPair: ECPairInterface =
        yield CryptoApi.generateKeyPairFromSeedPhraseAndAddress(seedOrPrivateKey, address);
      wif = keyPair && CryptoApi.encryptWif(keyPair.toWIF(), password);
    } else if (!isValidSeed && isValidPrivateKey) {
      wif = CryptoApi.encryptWif(seedOrPrivateKey, password);
    }
    if (wif) {
      yield* put(loginToWallet({ address, wif }));
      yield* put(push(WalletRoutesEnum.root));
    } else {
      toast.error(i18n.t('loginError'));
    }
  } catch (e) {
    toast.error(i18n.t('loginError'));
  }
}

export function* proceedToHubSaga() {
  const { wif, address } = yield* select(getWalletData);
  yield* put(loginToWallet({ address, wif }));
  yield* put(push(WalletRoutesEnum.root));
}
