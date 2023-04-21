import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoadBalancePayloadType } from '../types';
import { Maybe } from '../../typings/common';

type InitialState = {
  amounts: { [key: string]: string };
  lastblk: Maybe<string>;
  pubkey: Maybe<string>;
  preblk: Maybe<string>;
};

const initialState: InitialState = {
  amounts: {},
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
  },
});

export const loadBalanceTrigger = createAction('loadBalance');
export const loadTransactionsTrigger = createAction<{ tokenAddress:string } | undefined>('loadTransactions');

export const {
  actions: { setWalletBalanceData, setLastBlock },
  reducer: walletReducer,
} = walletSlice;
