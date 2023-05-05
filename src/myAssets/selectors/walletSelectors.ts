import { RootState } from '../../application/store';

export const getWalletInitialLastBlock = (state: RootState) => state.wallet.initialLastBlock;
export const getWalletLastBlock = (state: RootState) => state.wallet.lastblk;
export const getWalletNativeTokensAmounts = (state: RootState) => state.wallet.amounts;
export const getWalletNativeTokensAmountByID =
  (state: RootState, symbol: string) => state.wallet.amounts?.[symbol];
export const getWalletPubKey = (state: RootState) => state.wallet.pubkey;
export const getPrevBlock = (state: RootState) => state.wallet.preblk;
