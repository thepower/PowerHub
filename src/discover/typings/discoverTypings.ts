export enum DiscoverTabs {
  Dapps = 'Dapps',
  NFT = 'NFT',
}

export type DappsItemCardNftType = {
  cover: string;
  number: string;
  count: string;
  estValue: string;
  priceChange: number;
  positive?: boolean;
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
