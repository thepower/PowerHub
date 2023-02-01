import { Maybe } from 'typings/common';

export enum DiscoverTabs {
  Dapps = 'Dapps',
  NFT = 'NFT',
}

type DappsNftPriceChangeType = {
  change: number;
  positive?: boolean;
};

export type CardNftType = {
  id?: string;
  cover: string;
  number: string;
  count: Maybe<string>;
  estValue: string;
  priceChange: Maybe<DappsNftPriceChangeType>;
};

export type DappsItemCardType = {
  cover: string;
  genre: string[];
  title: string;
  smallCover: string;
  fullDescription: string;
  nfts?: CardNftType[];
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
  card: NftItemCardType;
};

export type NftItemCardType = {
  id: string;
  cover: string;
  smallCover: string;
  holders: string;
  followers: string;
  floor: string;
  lastDayVolume: string;
  lastDayChange: string;
  title: string;
  fullDescription: string;
  nfts: CardNftType[];
};
