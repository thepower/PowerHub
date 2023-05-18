export enum WalletRoutesEnum {
  signAndSend = '/sign-and-send',
  send = '/send',
  myAssets = '/my-assets',
  assetSelection = '/selection',
  transactions = '/transactions',
  add = '/add',
  signup = '/signup',
  root = '/',
  login = '/login',
}

export enum HubRoutesEnum {
  myAssets = '/my-assets',
  discover = '/discover',
  myPlace = '/my-place',
  build = '/build',
  contribute = '/contribute',
  root = '/:address?/',
}
