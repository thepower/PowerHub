import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Maybe } from '../../typings/common';

type InitialState = {
  sentData: Maybe<{
    from: string;
    to: string;
    amount: number;
    comment: Maybe<string>;
    txId: string;
  }>;
};

const initialState: InitialState = {
  sentData: null,
};

const sendSlice = createSlice({
  name: 'send',
  initialState,
  reducers: {
    setSentData: (state, { payload }: PayloadAction<NonNullable<InitialState['sentData']>>) => {
      state.sentData = payload;
    },
    clearSentData: (state) => {
      state.sentData = null;
    },
  },
});

export const sendTrxTrigger = createAction<{
  wif: string;
  from: string
  to: string;
  amount: number;
  comment: Maybe<string>;
}>('send/sendTrxTrigger');

export const sendTokenTrxTrigger = createAction<{
  wif: string;
  from: string
  to: string;
  address: string,
  decimals: number,
  amount: number;
}>('send/sendTokenTrxTrigger');

export const signAndSendTrxTrigger = createAction<{
  wif: string;
  t: number;
}>('send/signAndSendTrxTrigger');

export const { actions: { setSentData, clearSentData }, reducer: sendReducer } = sendSlice;
