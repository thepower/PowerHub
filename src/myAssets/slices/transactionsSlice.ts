import {
  PayloadAction, createAction, createEntityAdapter, createSlice,
} from '@reduxjs/toolkit';
import { TransactionPayloadType } from '../types';

export type TransactionType = TransactionPayloadType & { id: string };

export const transactionsAdapter = createEntityAdapter<TransactionType>({
  sortComparer: (a, b) => b.timestamp - a.timestamp,
});

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: transactionsAdapter.getInitialState(),
  reducers: {
    setTransactions: (
      state: ReturnType<typeof transactionsAdapter.getInitialState>,
      { payload }: PayloadAction<Map<string, TransactionPayloadType>>,
    ) => {
      transactionsAdapter.setMany(
        state,
        Array.from(payload)
          .map(([key, value]) => ({
            id: key,
            ...value,
          })),
      );
    },
    resetTransactionsState: () => transactionsAdapter.getInitialState(),
  },
});

export const loadTransactionsTrigger =
  createAction<{ tokenAddress?:string, isResetState?: boolean } | undefined>('loadTransactions');

export const {
  actions: {
    setTransactions,
    resetTransactionsState,
  },
  reducer: transactionsReducer,
} = transactionsSlice;
