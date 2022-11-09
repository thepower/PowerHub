import {
  createAction,
  createSlice,
  Draft,
  PayloadAction,
} from '@reduxjs/toolkit';
import { NetworkApi, WalletApi } from '@thepowereco/tssdk';

interface ApplicationDataState {
  testnetAvailable: boolean;
  showUnderConstruction: boolean;
  networkApi: Draft<NetworkApi> | null;
  walletApi: Draft<WalletApi> | null;
}

const SLICE_NAME = 'applicationData';

const initialState: ApplicationDataState = {
  testnetAvailable: false,
  showUnderConstruction: false,
  networkApi: null,
  walletApi: null,
};

const applicationDataSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setDynamicApis: (state: ApplicationDataState, { payload }: PayloadAction<{ networkApi: NetworkApi, walletApi: WalletApi }>) => {
      state.networkApi = payload.networkApi;
      state.walletApi = payload.walletApi;
    },
    setTestnetAvailable: (state: ApplicationDataState, { payload }: PayloadAction<boolean>) => {
      state.testnetAvailable = payload;
    },
    setShowUnderConstruction: (state: ApplicationDataState, action: PayloadAction<boolean>) => {
      state.showUnderConstruction = action.payload;
    },
  },
});

export const initApplication = createAction(`${SLICE_NAME}/initApplication`);

export const {
  reducer: applicationDataReducer,
  actions: {
    setDynamicApis,
    setTestnetAvailable,
    setShowUnderConstruction,
  },
} = applicationDataSlice;
