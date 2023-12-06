import i18n from 'locales/initTranslation';

export type LoadBalancePayloadType = {
  amount: {
    [key: string]: number;
  };
  lastblk: string;
  preblk: string;
  pubkey: string;
};

export type TransactionPayloadType = {
  body: string;
  extdata: {
    origin: string;
  };
  from: string;
  kind: string;
  payload: { amout: number; cur: string; purpose: string }[];
  seq: number;
  sig: {
    [key: string]: string;
  };
  sigverify: {
    invalid: number;
    pubkeys: string[];
    valid: number;
  };
  t: number;
  to: string;
  txext: { msg: string } | never[];
  ver: number;
  timestamp: number;
  cur: string;
  amount: number;
  inBlock: string;
  blockNumber: number;
};

export enum MyAssetsTabs {
  PowerNativeTokens = 'PowerNativeTokens',
  Erc20 = 'Erc20',
  // NFT = 'NFT',
}

export const getMyAssetsTabsLabels = () => ({
  PowerNativeTokens: i18n.t('powerNativeTokens'),
  Erc20: 'Erc_20',
  // NFT : 'NFT',
} as const);

export enum AddAssetsTabs {
  Erc20 = 'Erc20',
  // NFT = 'NFT',
  AddAssets = 'AddAssets',
}

export const getAddAssetsTabsLabels = () => ({
  Erc20: 'Erc_20',
  // NFT :'NFT',
  AddAssets: i18n.t('addOtherAssets'),
} as const);

export type TokenKind = 'nft' | 'erc20' | 'native';

export type TokenPayloadType = {
  type: TokenKind;
  name: string;
  address: string;
  symbol: string;
  decimals: number;
  amount?: bigint | string
  isShow?: boolean;
};

export const nativeTokensNameMap = { SK: 'Smart key' };
