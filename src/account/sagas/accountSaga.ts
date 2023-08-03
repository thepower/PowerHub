import { call, put, select } from 'typed-redux-saga';
import { CryptoApi } from '@thepowereco/tssdk';
import fileSaver from 'file-saver';
import { FileReaderType, getFileData } from 'common';
import { push } from 'connected-react-router';
import { toast } from 'react-toastify';
import { isWallet } from 'application/components/AppRoutes';
import i18n from 'locales/initTranslation';
import {
  clearAccountData,
  exportAccount,
  importAccountFromFile,
  resetAccount,
  setWalletData,
} from '../slice/accountSlice';
import { getWalletData } from '../selectors/accountSelectors';
import {
  GetChainResultType,
  LoginToWalletSagaInput,
} from '../typings/accountTypings';
import { clearApplicationStorage, setKeyToApplicationStorage } from '../../application/utils/localStorageUtils';
import { getNetworkApi, getWalletApi } from '../../application/selectors';
import { WalletRoutesEnum } from '../../application/typings/routes';
import { reInitApis } from '../../application/sagas/initApplicationSaga';
import { loadBalanceTrigger } from '../../myAssets/slices/walletSlice';

export function* loginToWalletSaga({ payload }: { payload?: LoginToWalletSagaInput } = {}) {
  const { address, wif } = payload!;
  let NetworkAPI = (yield* select(getNetworkApi))!;

  try {
    let subChain: GetChainResultType;

    do {
      subChain = yield NetworkAPI.getAddressChain(address!);

      // Switch bootstrap when transitioning from testnet to 101-th chain
      if (subChain.chain === 101) {
        subChain = yield NetworkAPI.getAddressChain(address!);
      }

      if (subChain.result === 'other_chain') {
        if (subChain.chain === null) {
          toast.error(i18n.t('portationInProgress'));
          return;
        }

        const { networkApi } = yield* reInitApis({ payload: subChain.chain });
        NetworkAPI = networkApi;
      }
    } while (subChain.result !== 'found');

    yield setKeyToApplicationStorage('address', address);
    if (isWallet) {
      yield setKeyToApplicationStorage('wif', wif);
    }
    yield* put(setWalletData({
      address: payload?.address!,
      wif: payload?.wif!,
      logged: true,
    }));

    yield* put(loadBalanceTrigger());
  } catch (e) {
    toast.error(i18n.t('loginError'));
  }
}

export function* importAccountFromFileSaga({ payload }: ReturnType<typeof importAccountFromFile>) {
  const { accountFile, password, additionalActionOnDecryptError } = payload;
  const WalletAPI = (yield* select(getWalletApi))!;

  try {
    const data = yield* call(getFileData, accountFile, FileReaderType.binary);
    const walletData: LoginToWalletSagaInput = yield WalletAPI.parseExportData(data!, password);
    const wif = yield* call(CryptoApi.encryptWif, walletData.wif!, password);

    yield* loginToWalletSaga({ payload: { address: walletData.address, wif } });
    yield* put(push(WalletRoutesEnum.root));
  } catch (e: any) {
    if (additionalActionOnDecryptError && e.message === 'unable to decrypt data') {
      additionalActionOnDecryptError?.();
    } else {
      toast.error(i18n.t('importAccountError'));
    }
  }
}

export function* exportAccountSaga({ payload }: ReturnType<typeof exportAccount>) {
  const { wif, address } = yield* select(getWalletData);
  const {
    password, hint, isWithoutGoHome, additionalActionOnDecryptError,
  } = payload;
  const WalletAPI = (yield* select(getWalletApi))!;

  try {
    const decryptedWif: string = yield CryptoApi.decryptWif(wif, password);
    const exportedData: string = yield WalletAPI.getExportData(decryptedWif, address, password, hint);

    const blob: Blob = yield new Blob([exportedData], { type: 'octet-stream' });
    yield fileSaver.saveAs(blob, 'power_wallet.pem', true);

    yield* loginToWalletSaga({ payload: { address, wif } });

    if (!isWithoutGoHome) {
      yield put(push(WalletRoutesEnum.root));
    }
  } catch (e: any) {
    if (additionalActionOnDecryptError && e.message === 'unable to decrypt data') {
      additionalActionOnDecryptError?.();
    } else {
      toast.error(i18n.t('exportAccountError'));
    }
  }
}

export function* resetAccountSaga({ payload: { password, additionalActionOnDecryptError } }: ReturnType<typeof resetAccount>) {
  const { wif } = yield select(getWalletData);
  try {
    yield CryptoApi.decryptWif(wif, password);
    yield clearApplicationStorage();
    yield put(clearAccountData());
    yield put(push(WalletRoutesEnum.signup));
  } catch (e: any) {
    if (additionalActionOnDecryptError && e.message === 'unable to decrypt data') {
      additionalActionOnDecryptError?.();
    } else {
      toast.error(i18n.t('resetAccountError'));
    }
  }
}
