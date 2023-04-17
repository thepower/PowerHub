import { put, select } from 'typed-redux-saga';
import { getWalletApi } from '../../application/selectors';
import { getWalletAddress } from '../../account/selectors/accountSelectors';
import { LoadBalancePayloadType, TransactionPayloadType } from '../types';
import { setLastBlock, setWalletData } from '../slices/walletSlice';
import { setTransactions } from '../slices/transactionsSlice';
import { getWalletLastBlock } from '../selectors/walletSelectors';

export function* loadBalanceSaga() {
  const WalletAPI = (yield* select(getWalletApi))!;

  const walletAddress = yield* select(getWalletAddress);

  const balance: LoadBalancePayloadType = yield WalletAPI.loadBalance(walletAddress!);

  yield* put(setWalletData(balance));
}

export function* loadTransactionsSaga() {
  const WalletAPI = (yield* select(getWalletApi))!;

  const walletAddress = yield* select(getWalletAddress);
  const walletLastBlock = yield* select(getWalletLastBlock);

  if (walletLastBlock) {
    const transactions: Map<string, TransactionPayloadType | string> = yield WalletAPI.getRawTransactionsHistory(
      walletLastBlock,
      walletAddress,
    );

    const lastblk = (transactions.get('needMore') as string) || null;
    transactions.delete('needMore');

    yield* put(setLastBlock(lastblk));
    yield* put(setTransactions(transactions as Map<string, TransactionPayloadType>));
  }
}
