import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoadBalancePayloadType } from '../types';
import { Maybe } from '../../typings/common';

type InitialState = {
  amounts: { [key: string]: string };
  initialLastBlock: Maybe<string>;
  lastblk: Maybe<string>;
  pubkey: Maybe<string>;
  preblk: Maybe<string>;
};

const initialState: InitialState = {
  amounts: {},
  initialLastBlock: null,
  lastblk: null,
  pubkey: null,
  preblk: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWalletBalanceData: {
      reducer: (_state, { payload }: PayloadAction<InitialState>) => payload,
      prepare: ({ amount, ...otherData }: LoadBalancePayloadType) => ({
        payload: {
          ...otherData,
          initialLastBlock: otherData.lastblk,
          amounts: Object.entries(amount).reduce(
            (acc, [key, value]) => Object.assign(acc, { [key]: value?.toFixed(2) || '0' }),
            {},
          ),
        },
      }),
    },
    setLastBlock: (state, { payload }: PayloadAction<string | null>) => {
      state.lastblk = payload;
    },
    setLastBlockToInitialLastBlock: (state) => {
      state.lastblk = state.initialLastBlock;
    },
  },
});

export const loadBalanceTrigger = createAction('loadBalance');

export const {
  actions: { setWalletBalanceData, setLastBlockToInitialLastBlock, setLastBlock },
  reducer: walletReducer,
} = walletSlice;
