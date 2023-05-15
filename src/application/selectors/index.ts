import { RootState } from '../store';

export const getNetworkApi = (state: RootState) => state.applicationData.networkApi;
export const getNetworkFeeSettings = (state: RootState) => state.applicationData.networkApi?.feeSettings;
export const getNetworkGasSettings = (state: RootState) => state.applicationData.networkApi?.gasSettings;
export const getNetworkChainID = (state: RootState) => state.applicationData.networkApi?.getChain();
export const getWalletApi = (state: RootState) => state.applicationData.walletApi;
export const getCurrentNetworkChains = (state: RootState) => (
  state.applicationData.networkChains
);
