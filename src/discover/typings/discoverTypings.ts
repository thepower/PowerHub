export enum DiscoverTabs {
  Dapps = 'Dapps',
  NFT = 'NFT',
}

export type DappsItemCardNftType = {
  cover: string;
  number: string;
  count: number;
  estValue: string;
  priceChange: string;
};

export type DappsItemCardType = {
  cover: string;
  genre: string[];
  title: string;
  smallCover: string;
  description: string;
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
