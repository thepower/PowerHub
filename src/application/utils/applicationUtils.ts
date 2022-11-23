import { NetworkEnum } from '@thepowereco/tssdk';

export const CURRENT_NETWORK = NetworkEnum.testnet;

export const getIsProductionOnlyDomains = () => (
  [
    'wallet.ts.thepower.io',
    'rc.dev.thepower.io',
    '127.0.0.1:9005',
  ].includes(window.location.host)
);

export const parseHash = () => (
  window.location.hash?.substr(1)
    .split('&')
    .map((item) => item.split('='))
);
