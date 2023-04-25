import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../application/store';
import { tokensAdapter } from '../slices/tokensSlice';

const {
  selectAll,
  selectById,
} = tokensAdapter.getSelectors((state: RootState) => state.tokens);

export const getTokens = createSelector(
  selectAll,
  (tokens) => tokens,
);

export const getTokenByID = createSelector(
  selectById,
  (token) => token,
);
