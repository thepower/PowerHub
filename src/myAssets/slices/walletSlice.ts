import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoadBalancePayloadType } from '../types';
import { Maybe } from '../../typings/common';

type InitialState = {
  amount: Maybe<string>;
  lastblk: Maybe<string>;
  pubkey: Maybe<string>;
  preblk: Maybe<string>;
};

const initialState: InitialState = {
  amount: null,
  lastblk: null,
  pubkey: null,
  preblk: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWalletData: {
      reducer: (state, { payload }: PayloadAction<InitialState>) => payload,
      prepare: ({ amount, ...otherData }: LoadBalancePayloadType) => ({
        payload: {
          ...otherData,
          amount: Object.values(amount)[0]?.toFixed(2) || '0',
        },
      }),
    },
    setLastBlock: (state, { payload }: PayloadAction<string | null>) => {
      state.lastblk = payload;
    },
  },
});

export const loadBalanceTrigger = createAction('loadBalance');
export const loadTransactionsTrigger = createAction('loadTransactions');

export const { actions: { setWalletData, setLastBlock }, reducer: walletReducer } = walletSlice;
