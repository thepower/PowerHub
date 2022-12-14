import { call, put, select } from 'typed-redux-saga';
import { CryptoApi } from '@thepowereco/tssdk';
import fileSaver from 'file-saver';
import { FileReaderType, getFileData } from 'common';
import { push } from 'connected-react-router';
import { toast } from 'react-toastify';
import {
  clearAccountData,
  setWalletData,
} from '../slice/accountSlice';
import { getWalletData } from '../selectors/accountSelectors';
import {
  ExportAccountInputType,
  GetChainResultType,
  LoginToWalletSagaInput,
  ImportAccountInputType,
} from '../typings/accountTypings';
import { clearApplicationStorage, setKeyToApplicationStorage } from '../../application/utils/localStorageUtils';
import { getNetworkApi, getWalletApi } from '../../application/selectors';
import { RoutesEnum } from '../../application/typings/routes';
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
          toast.error('Portation in progress. Try again in a few minutes.');
          return;
        }

        const { networkApi } = yield* reInitApis({ payload: subChain.chain });
        NetworkAPI = networkApi;
      }
    } while (subChain.result !== 'found');

    yield setKeyToApplicationStorage('address', address);
    yield setKeyToApplicationStorage('wif', wif);
    yield* put(setWalletData({
      address: payload?.address!,
      wif: payload?.wif!,
      logged: true,
    }));

    yield* put(loadBalanceTrigger());
  } catch (e) {
    toast.error('Login error');
  }
}

export function* importAccountFromFileSaga({ payload }: { payload:ImportAccountInputType }) {
  const { accountFile, password } = payload;
  const WalletAPI = (yield* select(getWalletApi))!;

  try {
    const data = yield* call(getFileData, accountFile, FileReaderType.binary);
    const walletData: LoginToWalletSagaInput = yield WalletAPI.parseExportData(data!, password);
    const wif = yield* call(CryptoApi.encryptWif, walletData.wif!, password);

    yield* loginToWalletSaga({ payload: { address: walletData.address, wif } });
    yield* put(push(RoutesEnum.root));
  } catch (e) {
    toast.error('Import account error. Try again in a few minutes.');
  }
}

export function* exportAccountSaga({ payload }: { payload: ExportAccountInputType }) {
  const { wif, address } = yield* select(getWalletData);
  const { password, hint } = payload;
  const WalletAPI = (yield* select(getWalletApi))!;

  try {
    const decryptedWif: string = yield CryptoApi.decryptWif(wif, password);
    const exportedData: string = yield WalletAPI.getExportData(decryptedWif, address, password, hint);

    const blob: Blob = yield new Blob([exportedData], { type: 'octet-stream' });
    yield fileSaver.saveAs(blob, 'power_wallet.pem', true);

    yield* loginToWalletSaga({ payload: { address, wif } });
    yield put(push(RoutesEnum.root));
  } catch (e) {
    toast.error('Export account error. Try again in a few minutes.');
  }
}

export function* resetAccountSaga({ payload }: { payload: string }) {
  const { wif } = yield select(getWalletData);
  try {
    yield CryptoApi.decryptWif(wif, payload);
    yield clearApplicationStorage();
    yield put(clearAccountData());
    yield put(push(RoutesEnum.signup));
  } catch (e) {
    toast.error('Reset account error. Try again in a few minutes.');
  }
}
