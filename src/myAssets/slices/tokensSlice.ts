import {
  PayloadAction, createAction, createEntityAdapter, createSlice,
} from '@reduxjs/toolkit';
import { TokenPayloadType } from 'myAssets/types';
import { BigNumber } from '@ethersproject/bignumber';

export type TokenType = TokenPayloadType;

export const tokensAdapter = createEntityAdapter<TokenType>({ selectId: (model) => model.address });

const tokensSlice = createSlice({
  name: 'tokens',
  initialState: tokensAdapter.getInitialState(),
  reducers: {
    addToken: (state, { payload }: PayloadAction<TokenPayloadType>) => {
      tokensAdapter.setOne(state, payload);
    },
    addTokens: (state, { payload }: PayloadAction<TokenPayloadType[]>) => {
      tokensAdapter.setAll(state, payload);
    },
    toggleTokenShow: (state, { payload }: PayloadAction<{ address: string, isShow: boolean }>) => {
      tokensAdapter.updateOne(state, { id: payload.address, changes: { isShow: payload.isShow } });
    },
    updateTokenAmount: (state, { payload }: PayloadAction<{ address: string, amount: BigNumber }>) => {
      tokensAdapter.updateOne(state, { id: payload.address, changes: { amount: payload.amount } });
    },
  },
});

export const addTokenTrigger = createAction<string>('addToken');
export const updateTokensAmountsTrigger = createAction('updateTokensAmounts');
export const toggleTokenShowTrigger = createAction<{ address: string, isShow: boolean }>('toggleTokenShow');

export const {
  actions: {
    addToken,
    addTokens,
    toggleTokenShow,
    updateTokenAmount,
  },
  reducer: tokensReducer,
} = tokensSlice;
