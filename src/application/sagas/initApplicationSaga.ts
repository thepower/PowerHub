import { put } from 'typed-redux-saga';
import { push } from 'connected-react-router';
import { NetworkApi, WalletApi } from '@thepowereco/tssdk';
import { setDynamicApis, setTestnetAvailable, setNetworkChains } from '../slice/applicationSlice';
import { CURRENT_NETWORK, getIsProductionOnlyDomains } from '../utils/applicationUtils';
import { getKeyFromApplicationStorage } from '../utils/localStorageUtils';
import { loginToWalletSaga } from '../../account/sagas/accountSaga';
import { setWalletData } from '../../account/slice/accountSlice';
import { RoutesEnum } from '../typings/routes';

const defaultChain = 1025; // TODO: move to config

export function* reInitApis({ payload }: { payload: number }) {
  const networkApi = new NetworkApi(payload || defaultChain);
  yield networkApi.bootstrap();

  const walletApi = new WalletApi(networkApi);

  yield* put(setDynamicApis({ networkApi, walletApi }));

  return { walletApi, networkApi };
}

export function* initApplicationSaga() {
  yield* reInitApis({ payload: defaultChain });
  // let subChain = -1;
  let address = '';
  let wif = '';

  if (process.env.NODE_ENV !== 'test' && getIsProductionOnlyDomains()) {
    yield* put(setTestnetAvailable(false));
  }

  const chains: number[] = yield NetworkApi.getNetworkChains(CURRENT_NETWORK);
  yield put(setNetworkChains(chains.sort()));

  address = yield getKeyFromApplicationStorage('address');
  wif = yield getKeyFromApplicationStorage('wif');
  const sCAPPs: string = yield getKeyFromApplicationStorage('scapps');

  if (sCAPPs) {
    // setSCAPPs
  }

  if (address && wif) {
    yield loginToWalletSaga({
      payload: {
        address,
        wif,
      },
    });

    yield* put(setWalletData({
      address,
      wif,
      logged: true,
    }));
    yield* put(push(RoutesEnum.root));
  } else {
    yield* put(push(RoutesEnum.signup));
  }
}
