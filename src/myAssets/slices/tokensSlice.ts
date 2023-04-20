import { PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { TokenPayloadType } from 'myAssets/types';

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
  },
});

export const {
  actions: {
    addToken,
    addTokens,
  },
  reducer: tokensReducer,
} = tokensSlice;
