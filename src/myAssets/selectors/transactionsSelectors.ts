import { createSelector } from '@reduxjs/toolkit';
import { groupBy } from 'lodash';
import { format } from 'date-fns';
import { RootState } from '../../application/store';
import { transactionsAdapter } from '../slices/transactionsSlice';

const {
  selectAll,
} = transactionsAdapter.getSelectors((state: RootState) => state.transactions);

export const getGroupedWalletTransactions = createSelector(
  selectAll,
  (transactions) => groupBy(transactions, (trx) => format(trx.timestamp, 'dd MMM yyyy')),
);
