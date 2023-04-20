import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../application/store';
import { tokensAdapter } from '../slices/tokensSlice';

const {
  selectAll,
} = tokensAdapter.getSelectors((state: RootState) => state.tokens);

export const getTokens = createSelector(
  selectAll,
  (tokens) => tokens,
);
