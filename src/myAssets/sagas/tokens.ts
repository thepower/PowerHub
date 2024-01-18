import {
  AddressApi,
  NetworkApi,
} from '@thepowereco/tssdk';
import abis from 'abis';
import { getWalletAddress } from 'account/selectors/accountSelectors';

import { getNetworkApi } from 'application/selectors';
import { WalletRoutesEnum } from 'application/typings/routes';
import { push } from 'connected-react-router';
import i18n from 'locales/initTranslation';
import { getTokens } from 'myAssets/selectors/tokensSelectors';
import {
  addToken, addTokenTrigger, updateTokenAmount,
} from 'myAssets/slices/tokensSlice';
import { toast } from 'react-toastify';
import {
  all, put, select,
} from 'typed-redux-saga';

export function* addTokenSaga({ payload: address }: ReturnType<typeof addTokenTrigger>) {
  try {
    const networkAPI = (yield* select(getNetworkApi))!;
    let contractNetworkApi = networkAPI;
    const { chain }: { chain?: number } = yield networkAPI.getAddressChain(address);

    if (!chain) {
      toast.error(i18n.t('addressNotFound'));
    }

    if (chain !== networkAPI.getChain()) {
      contractNetworkApi = new NetworkApi(chain!);
      yield contractNetworkApi.bootstrap(true);
    }
    const isErc721: boolean = yield contractNetworkApi.executeCall(
      AddressApi.textAddressToHex(address),
      'supportsInterface',
      ['0x80ac58cd'],
      abis.erc721.abi,
    );

    if (isErc721) {
      const walletAddress: string = yield* select(getWalletAddress);

      const name: string = yield contractNetworkApi.executeCall(
        AddressApi.textAddressToHex(address),
        'name',
        [],
        abis.erc721.abi,
      );
      const symbol: string = yield contractNetworkApi.executeCall(
        AddressApi.textAddressToHex(address),
        'symbol',
        [],
        abis.erc721.abi,
      );
      const balanceBigint: bigint = yield contractNetworkApi.executeCall(
        AddressApi.textAddressToHex(address),
        'balanceOf',
        [AddressApi.textAddressToEvmAddress(walletAddress)],
        abis.erc721.abi,
      );
      const balance = balanceBigint.toString();

      yield put(addToken({
        name,
        symbol,
        address,
        decimals: 1,
        type: 'erc721',
        amount: balance,
        isShow: true,
      }));
      yield* put(push(WalletRoutesEnum.myAssets));
    } else {
      const walletAddress: string = yield* select(getWalletAddress);

      const name: string = yield contractNetworkApi.executeCall(
        AddressApi.textAddressToHex(address),
        'name',
        [],
        abis.erc20.abi,
      );
      const symbol: string = yield contractNetworkApi.executeCall(
        AddressApi.textAddressToHex(address),
        'symbol',
        [],
        abis.erc20.abi,
      );
      const balanceBigint: bigint = yield contractNetworkApi.executeCall(
        AddressApi.textAddressToHex(address),
        'balanceOf',
        [AddressApi.textAddressToEvmAddress(walletAddress)],
        abis.erc20.abi,
      );
      const balance = balanceBigint.toString();
      const decimals: number = yield contractNetworkApi.executeCall(
        AddressApi.textAddressToHex(address),
        'decimals',
        [AddressApi.textAddressToEvmAddress(walletAddress)],
        abis.erc20.abi,
      );
      yield put(addToken({
        name,
        symbol,
        address,
        decimals,
        type: 'erc20',
        amount: balance,
        isShow: true,
      }));
      yield* put(push(WalletRoutesEnum.myAssets));
    }
  } catch (error: any) {
    console.error(error);
    toast.error(`${i18n.t('somethingWentWrongCode')} ${error?.code}`);
  }
}

export function* updateTokenAmountSaga({ address }: { address: string }) {
  const networkAPI = (yield* select(getNetworkApi))!;
  let contractNetworkApi = networkAPI;
  const { chain }: { chain?: number } = yield networkAPI.getAddressChain(address);

  if (!chain) {
    toast.error(i18n.t('addressNotFound'));
  }

  if (chain !== networkAPI.getChain()) {
    contractNetworkApi = new NetworkApi(chain!);
    yield contractNetworkApi.bootstrap(true);
  }

  const isErc721: boolean = yield contractNetworkApi.executeCall(
    AddressApi.textAddressToHex(address),
    'supportsInterface',
    ['0x80ac58cd'],
    abis.erc721.abi,
  );

  if (isErc721) {
    const walletAddress: string = yield* select(getWalletAddress);
    const balanceBigint: bigint = yield contractNetworkApi.executeCall(
      AddressApi.textAddressToHex(address),
      'balanceOf',
      [AddressApi.textAddressToEvmAddress(walletAddress)],
      abis.erc721.abi,
    );
    const balance = balanceBigint.toString();

    yield put(updateTokenAmount({ address, amount: balance }));
  } else {
    const walletAddress: string = yield* select(getWalletAddress);

    const balanceBigint: bigint = yield contractNetworkApi.executeCall(
      AddressApi.textAddressToHex(address),
      'balanceOf',
      [AddressApi.textAddressToEvmAddress(walletAddress)],
      abis.erc20.abi,
    );
    const balance = balanceBigint.toString();
    yield put(updateTokenAmount({ address, amount: balance }));
  }
}

export function* updateTokensAmountsSaga() {
  const tokens = yield* select(getTokens);

  yield all(tokens.map(({ address }) => ({ address })).map(updateTokenAmountSaga));
}
