import { createSlice, createAction, PayloadAction } from '@reduxjs/toolkit';
import { Maybe } from '../../typings/common';
import { ExportAccountInputType, ImportAccountInputType, LoginToWalletSagaInput } from '../typings/accountTypings';

export type WalletData = {
  address: string;
  wif: string;
};

export interface AccountState {
  walletData: WalletData;
  subChain: Maybe<number>;
  logged: boolean;
}

const SLICE_NAME = 'account';

const loginToWallet = createAction<LoginToWalletSagaInput>(`${SLICE_NAME}/loginToWallet`);
const resetAccount = createAction<string>(`${SLICE_NAME}/resetAccount`);
const exportAccount = createAction<ExportAccountInputType>(`${SLICE_NAME}/exportAccount`);
const importAccountFromFile = createAction<ImportAccountInputType>(`${SLICE_NAME}/importAccount`);

const initialState: AccountState = {
  walletData: {
    address: '',
    wif: '',
  },
  subChain: null,
  logged: false,
};

const accountSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setWalletData: (state: AccountState, action: PayloadAction<WalletData & { logged?: boolean; }>) => {
      state.walletData = {
        ...state.walletData,
        ...action.payload,
      };
    },
    setLoggedToAccount: (state: AccountState, action: PayloadAction<boolean>) => {
      state.logged = action.payload;
    },
    clearAccountData: () => initialState,
  },
});

const {
  reducer: accountReducer,
  actions: {
    setWalletData,
    setLoggedToAccount,
    clearAccountData,
  },
} = accountSlice;

export {
  accountReducer,
  importAccountFromFile,
  setWalletData,
  loginToWallet,
  setLoggedToAccount,
  resetAccount,
  clearAccountData,
  exportAccount,
};
