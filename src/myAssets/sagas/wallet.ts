import { put, select } from 'typed-redux-saga';
import { loadTransactionsTrigger } from 'myAssets/slices/transactionsSlice';
import { getWalletApi } from '../../application/selectors';
import { getWalletAddress } from '../../account/selectors/accountSelectors';
import { LoadBalancePayloadType, TransactionPayloadType } from '../types';
import { setLastBlock, setWalletBalanceData } from '../slices/walletSlice';
import { setTransactions } from '../slices/transactionsSlice';
import { getWalletLastBlock } from '../selectors/walletSelectors';

export function* loadBalanceSaga() {
  const WalletAPI = (yield* select(getWalletApi))!;

  const walletAddress = yield* select(getWalletAddress);

  const balance: LoadBalancePayloadType = yield WalletAPI.loadBalance(walletAddress!);

  yield* put(setWalletBalanceData(balance));
}

export function* loadTransactionsSaga({ payload }: ReturnType<typeof loadTransactionsTrigger>) {
  const tokenAddress = payload?.tokenAddress;
  const WalletAPI = (yield* select(getWalletApi))!;

  const walletAddress = yield* select(getWalletAddress);
  const walletLastBlock = yield* select(getWalletLastBlock);

  if (walletLastBlock) {
    const transactions: Map<string, TransactionPayloadType | string> = yield WalletAPI.getRawTransactionsHistory(
      walletLastBlock,
      walletAddress,
      undefined,
      (_txID, tx: TransactionPayloadType) => !tokenAddress || (tx.from === tokenAddress || tx.to === tokenAddress),
    );

    const lastblk = (transactions.get('needMore') as string) || null;
    transactions.delete('needMore');

    yield* put(setLastBlock(lastblk));
    yield* put(setTransactions(transactions as Map<string, TransactionPayloadType>));
  }
}
