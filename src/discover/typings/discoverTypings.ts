export enum DiscoverTabs {
  Dapps = 'Dapps',
  NFT = 'NFT',
}

type DappsNftPriceChangeType = {
  change: number;
  positive?: boolean;
};

export type DappsItemCardNftType = {
  cover: string;
  number: string;
  count: string;
  estValue: string;
  priceChange: DappsNftPriceChangeType;
};

export type DappsItemCardType = {
  cover: string;
  genre: string[];
  title: string;
  smallCover: string;
  fullDescription: string;
  nfts?: DappsItemCardNftType[];
};

export type DappsItemType = {
  id: string;
  imgSrc: string;
  fav: boolean;
  name: string;
  genre: string;
  card: DappsItemCardType;
};

export type NftItemType = {
  id: string;
  imgSrc: string;
  fav: boolean;
  authorImgSrc: string;
  name: string;
  priceChange: DappsNftPriceChangeType;
  totalVolume: string;
  floorPrice: string;
};
