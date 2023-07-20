import {
  createAction,
  createSlice,
  Draft,
  PayloadAction,
} from '@reduxjs/toolkit';
import { NetworkApi, WalletApi } from '@thepowereco/tssdk';
import { Maybe } from '../../typings/common';

interface ApplicationDataState {
  testnetAvailable: boolean;
  showUnderConstruction: boolean;
  networkApi: Maybe<Draft<NetworkApi>>;
  walletApi: Maybe<Draft<WalletApi>>;
  networkChains: number[];
  backUrl: Maybe<string>;
}

const SLICE_NAME = 'applicationData';

const initialState: ApplicationDataState = {
  testnetAvailable: false,
  showUnderConstruction: false,
  networkApi: null,
  walletApi: null,
  networkChains: [],
  backUrl: null,
};

const applicationDataSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setDynamicApis: (
      state: ApplicationDataState,
      { payload }: PayloadAction<{ networkApi: NetworkApi, walletApi: WalletApi }>,
    ) => {
      state.networkApi = payload.networkApi;
      state.walletApi = payload.walletApi;
    },
    setTestnetAvailable: (state: ApplicationDataState, { payload }: PayloadAction<boolean>) => {
      state.testnetAvailable = payload;
    },
    setShowUnderConstruction: (state: ApplicationDataState, action: PayloadAction<boolean>) => {
      state.showUnderConstruction = action.payload;
    },
    setNetworkChains: (state: ApplicationDataState, action: PayloadAction<number[]>) => {
      state.networkChains = action.payload;
    },
    setBackUrl: (state: ApplicationDataState, action: PayloadAction<Maybe<string>>) => {
      state.backUrl = action.payload;
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
    setNetworkChains,
    setBackUrl,
  },
} = applicationDataSlice;
