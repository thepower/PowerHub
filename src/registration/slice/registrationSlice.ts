import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AddActionType, Maybe } from '../../typings/common';
import {
  CreateAccountStepsEnum,
  LoginRegisterAccountTabs,
  LoginToWalletInputType,
  SetSeedPhraseInput,
} from '../typings/registrationTypes';

const SLICE_NAME = 'registration';

const generateSeedPhrase = createAction(`${SLICE_NAME}/generateSeedPhrase`);
const createWallet = createAction<AddActionType<{ password: string; randomChain: boolean }>>(`${SLICE_NAME}/createWallet`);
const loginToWalletFromRegistration = createAction<LoginToWalletInputType>(`${SLICE_NAME}/loginToWallet`);
const proceedToHub = createAction(`${SLICE_NAME}/proceedToHub`);

export type RegistrationState = {
  tab: LoginRegisterAccountTabs;
  currentShard: Maybe<number>;
  seedPhrase: Maybe<string>;
  creatingStep: CreateAccountStepsEnum;
  address: Maybe<string>;
  seed: Maybe<string>;
  password: Maybe<string>;
  confirmedPassword: Maybe<string>;
  passwordsNotEqual: boolean;
  randomChain: boolean;
};

const initialState: RegistrationState = {
  tab: LoginRegisterAccountTabs.create,
  currentShard: null,
  seedPhrase: null,
  creatingStep: CreateAccountStepsEnum.selectSubChain,
  address: null,
  seed: null,
  password: null,
  confirmedPassword: null,
  passwordsNotEqual: false,
  randomChain: true,
};

const registrationSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setCurrentRegisterCreateAccountTab: (state: RegistrationState, action: PayloadAction<LoginRegisterAccountTabs>) => {
      state.tab = action.payload;
    },
    setCreatingCurrentShard: (state: RegistrationState, action: PayloadAction<Maybe<number>>) => {
      state.currentShard = action.payload;
    },
    setSeedPhrase: (state: RegistrationState, action: PayloadAction<SetSeedPhraseInput>) => {
      state.seedPhrase = action.payload.seedPhrase;
      state.creatingStep = action.payload.nextStep;
    },
    setCreatingStep: (state: RegistrationState, action: PayloadAction<CreateAccountStepsEnum>) => {
      state.creatingStep = action.payload;
    },
    seLoginAddress: (state: RegistrationState, action: PayloadAction<string>) => {
      state.address = action.payload;
    },
    setLoginSeed: (state: RegistrationState, action: PayloadAction<string>) => {
      state.seed = action.payload;
    },
    setLoginPassword: (state: RegistrationState, action: PayloadAction<string>) => {
      state.password = action.payload;
      state.passwordsNotEqual = false;
    },
    setLoginConfirmedPassword: (state: RegistrationState, action: PayloadAction<string>) => {
      state.confirmedPassword = action.payload;
      state.passwordsNotEqual = false;
    },
    setPasswordNotEqual: (state: RegistrationState, action: PayloadAction<boolean>) => {
      state.passwordsNotEqual = action.payload;
    },
    toggleRandomChain: (state: RegistrationState) => {
      state.randomChain = !state.randomChain;
    },
  },
});

const {
  reducer: registrationReducer,
  actions: {
    setCurrentRegisterCreateAccountTab,
    setCreatingCurrentShard,
    setSeedPhrase,
    setCreatingStep,
    seLoginAddress,
    setLoginSeed,
    setLoginPassword,
    setLoginConfirmedPassword,
    setPasswordNotEqual,
    toggleRandomChain,
  },
} = registrationSlice;

export {
  createWallet, generateSeedPhrase, loginToWalletFromRegistration,
  proceedToHub, registrationReducer,
  seLoginAddress, setCreatingCurrentShard, setCreatingStep,
  setCurrentRegisterCreateAccountTab, setLoginConfirmedPassword,
  setLoginPassword, setLoginSeed, setPasswordNotEqual, setSeedPhrase,
  toggleRandomChain,
};
