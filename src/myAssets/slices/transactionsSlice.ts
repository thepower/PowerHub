import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { TransactionPayloadType } from '../types';

export type TransactionType = TransactionPayloadType & { id: string };

export const transactionsAdapter = createEntityAdapter<TransactionType>({
  sortComparer: (a, b) => b.timestamp - a.timestamp,
});

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: transactionsAdapter.getInitialState(),
  reducers: {
    setTransactions: {
      reducer: transactionsAdapter.setMany,
      prepare: (values: Map<string, TransactionPayloadType>) => ({
        payload: Array.from(values)
          .map(([key, value]) => ({
            id: key,
            ...value,
          })),
      }),
    },
  },
});

export const {
  actions: {
    setTransactions,
  },
  reducer: transactionsReducer,
} = transactionsSlice;
