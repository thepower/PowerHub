import { RootState } from '../../application/store';

export const getWalletLastBlock = (state: RootState) => state.wallet.lastblk;
export const getWalletNativeTokensAmounts = (state: RootState) => state.wallet.amounts;
export const getWalletPubKey = (state: RootState) => state.wallet.pubkey;
export const getPrevBlock = (state: RootState) => state.wallet.preblk;
