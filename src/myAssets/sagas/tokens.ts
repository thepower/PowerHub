import {
  Evm20Contract, EvmContract, EvmCore, NetworkApi,

} from '@thepowereco/tssdk';
import { getWalletAddress } from 'account/selectors/accountSelectors';

import { getNetworkApi } from 'application/selectors';
import { WalletRoutesEnum } from 'application/typings/routes';
import { push } from 'connected-react-router';
import {
  addToken, addTokenTrigger, updateTokenAmount,
} from 'myAssets/slices/tokensSlice';
import { all, put, select } from 'typed-redux-saga';
import { BigNumber } from '@ethersproject/bignumber';
import { getTokens } from 'myAssets/selectors/tokensSelectors';
import { toast } from 'react-toastify';
import { t } from 'i18next';

export const defaultABI = JSON.parse(
  // eslint-disable-next-line max-len
  '[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]',
);

export function* addTokenSaga({ payload: address }: ReturnType<typeof addTokenTrigger>) {
  try {
    const networkAPI = (yield* select(getNetworkApi))!;
    let contractNetworkApi = networkAPI;
    const { chain }: { chain?: number } = yield networkAPI.getAddressChain(address);

    if (!chain) {
      toast.error(t('addressNotFound'));
    }

    if (chain !== networkAPI.getChain()) {
      contractNetworkApi = new NetworkApi(chain!);
      yield contractNetworkApi.bootstrap(true);
    }

    const EVM: EvmCore = yield EvmCore.build(contractNetworkApi as NetworkApi);

    const storageSc: EvmContract = yield EvmContract.build(EVM, address, defaultABI);

    const contract = new Evm20Contract(storageSc);
    const walletAddress: string = yield* select(getWalletAddress);

    const name: string = yield contract.getName();
    const symbol: string = yield contract.getSymbol();
    const decimals: number = yield contract.getDecimals();
    const balance: BigNumber = yield contract.getBalance(walletAddress);

    yield put(addToken({
      name, symbol, address, decimals, type: 'erc20', amount: balance, isShow: true,
    }));
    yield* put(push(WalletRoutesEnum.myAssets));
  } catch (error: any) {
    toast.error(`${t('somethingWentWrongCode')} ${error?.code}`);
  }
}

export function* updateTokenAmountSaga({ address }: { address: string }) {
  const networkAPI = (yield* select(getNetworkApi))!;
  let contractNetworkApi = networkAPI;
  const { chain }: { chain?: number } = yield networkAPI.getAddressChain(address);

  if (!chain) {
    toast.error(t('addressNotFound'));
  }

  if (chain !== networkAPI.getChain()) {
    contractNetworkApi = new NetworkApi(chain!);
    yield contractNetworkApi.bootstrap(true);
  }

  const EVM: EvmCore = yield EvmCore.build(contractNetworkApi as NetworkApi);

  const storageSc: EvmContract = yield EvmContract.build(EVM, address, defaultABI);

  const contract = new Evm20Contract(storageSc);
  const walletAddress: string = yield* select(getWalletAddress);

  const amount: BigNumber = yield contract.getBalance(walletAddress);
  yield put(updateTokenAmount({ address, amount }));
}

export function* updateTokensAmountsSaga() {
  const tokens = yield* select(getTokens);

  yield all(tokens.map(({ address }) => ({ address })).map(updateTokenAmountSaga));
}
