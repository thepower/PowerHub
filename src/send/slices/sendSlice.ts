import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TxBody } from 'sign-and-send/typing';
import { Maybe } from '../../typings/common';

export type SentData = {
  from: string;
  to: string;
  amount: number | string;
  comment: Maybe<string>;
  txId: string;
};

type InitialState = {
  sentData: Maybe<SentData>;
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
  decodedTxBody: TxBody;
}>('send/signAndSendTrxTrigger');

export const { actions: { setSentData, clearSentData }, reducer: sendReducer } = sendSlice;
