import { put } from 'typed-redux-saga';
import { push } from 'connected-react-router';
import { NetworkApi, WalletApi, NetworkEnum } from '@thepowereco/tssdk';
import { setDynamicApis, setTestnetAvailable } from '../slice/applicationSlice';
import { getIsProductionOnlyDomains } from '../utils/applicationUtils';
import { getKeyFromApplicationStorage } from '../utils/localStorageUtils';
import { loginToWalletSaga } from '../../account/sagas/accountSaga';
import { setWalletData } from '../../account/slice/accountSlice';
import { RoutesEnum } from '../typings/routes';

const defaultChain = 1; // TODO: move to config

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

  // let hashParams = null;

  if (process.env.NODE_ENV !== 'test' && getIsProductionOnlyDomains()) {
    yield* put(setTestnetAvailable(false));
  }

  // hashParams = parseHash();
  const network = NetworkEnum.testnet; // TODO: config
  const shards = NetworkApi.getNetworkChains(network); // TODO: use it
  console.log(shards);

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
  } else {
    yield* put(push(RoutesEnum.signup));
  }
}
