import { createSlice, createAction, PayloadAction } from '@reduxjs/toolkit';
import { AddActionOnDecryptErrorType, AddActionOnSuccessAndErrorType } from '../../typings/common';
import { ExportAccountInputType, ImportAccountInputType, LoginToWalletSagaInput } from '../typings/accountTypings';

export type WalletData = {
  address: string;
  wif: string;
};

export interface AccountState {
  walletData: WalletData;
  logged: boolean;
  openedMenu: boolean;
}

const SLICE_NAME = 'account';
const loginToWallet = createAction<LoginToWalletSagaInput>(`${SLICE_NAME}/loginToWallet`);
const resetAccount = createAction<AddActionOnDecryptErrorType<{ password: string }>>(`${SLICE_NAME}/resetAccount`);
const exportAccount = createAction<AddActionOnSuccessAndErrorType<AddActionOnDecryptErrorType<ExportAccountInputType>>>(`${SLICE_NAME}/exportAccount`);
const importAccountFromFile = createAction<AddActionOnDecryptErrorType<ImportAccountInputType>>(`${SLICE_NAME}/importAccount`);

const initialState: AccountState = {
  walletData: {
    address: '',
    wif: '',
  },
  logged: false,
  openedMenu: false,
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
    toggleOpenedAccountMenu: (state: AccountState) => {
      state.openedMenu = !state.openedMenu;
    },
    closeAccountMenu: (state: AccountState) => {
      state.openedMenu = false;
    },
  },
});

const {
  reducer: accountReducer,
  actions: {
    setWalletData,
    setLoggedToAccount,
    clearAccountData,
    toggleOpenedAccountMenu,
    closeAccountMenu,
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
  toggleOpenedAccountMenu,
  closeAccountMenu,
};
