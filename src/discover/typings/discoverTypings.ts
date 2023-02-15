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

export type NtfOwnershipType = {
  id: string;
  ownerImg: string;
  ownerName: string;
  ownerAddress: string;
  type: string; // todo specify
  time: string;
  date: string;
};

export type NftCardInfoRecordType = {
  label: string;
  value: string;
};

export type NftCardInfo = {
  tokenId: NftCardInfoRecordType;
  address: NftCardInfoRecordType;
  standart: NftCardInfoRecordType; // todo: specify
  fileType: NftCardInfoRecordType; // todo: specify
  royalties: NftCardInfoRecordType;
  estValue: NftCardInfoRecordType;
  rarity: NftCardInfoRecordType;
  quantity: NftCardInfoRecordType;
};

export type NtfCardType = {
  id: string;
  img: string;
  fav: boolean;
  collection: string;
  collectionImg: string; // todo: link to collection
  creatorImg: string;
  creatorAddress: string; // todo: link to creator
  ownerImg: string;
  ownerAddress: string;
  nftCardInfo: NftCardInfo;
  ownershipHistory: NtfOwnershipType[];
};
