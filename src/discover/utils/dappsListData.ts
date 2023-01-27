import dummyDappsImg from 'discover/utils/dapps/startWarDapps.png';
import dappsCardSmallCover from 'discover/utils/dapps/dappsCardSmallCover.png';
import dappsCardCover from 'discover/utils/dapps/dappsCardCover.png';
import dappsNFT1 from 'discover/utils/dapps/dappsNFT1.png';
import dappsNFT2 from 'discover/utils/dapps/dappsNFT2.png';
import dappsNFT3 from 'discover/utils/dapps/dappsNFT3.png';
import dappsNFT4 from 'discover/utils/dapps/dappsNFT4.png';
import dappsNFT5 from 'discover/utils/dapps/dappsNFT5.png';
import nftItem1 from 'discover/utils/nft/nftItem1.png';
import nftItem2 from 'discover/utils/nft/nftItem2.png';
import nftItem3 from 'discover/utils/nft/nftItem3.png';
import nftItem4 from 'discover/utils/nft/nftItem4.png';
import nftItemAuthor from './nft/nftItemAuthor.png';
import nftCardCover from './nft/nftCardCover.png';
import nftCardImg from './nft/nftCardImg.png';
import nftCardItem1 from './nft/nftCardItem1.png';
import nftCardItem2 from './nft/nftCardItem2.png';
import nftCardItem3 from './nft/nftCardItem3.png';
import nftCardItem4 from './nft/nftCardItem4.png';
import { DappsItemType, NftItemType } from '../typings/discoverTypings';

export const dappsListData: DappsItemType[] = [
  {
    id: '1', // tmp
    imgSrc: dummyDappsImg,
    genre: 'RPG',
    fav: false,
    name: 'Star war',
    card: {
      cover: dappsCardCover,
      genre: ['Action', 'Shooter', 'Strategy', 'RPG'],
      smallCover: dappsCardSmallCover,
      title: 'Star war in the sky',
      fullDescription: 'Five thousand exciting hours of crazy shooter with a mixture of RPG and strategy. ' +
        'You can choose both the dark side and the light side. Moreover, you can change sides as the  ' +
        'game progresses. As in life, this will require certain actions, depending on them, ' +
        'your character will be on the light or dark side. \n Build spaceships or towers, trade or plunder, ' +
        'collect rare resources, upgrade your character. See you in the game, good skills to you young padawan',
      nfts: [
        {
          number: '#768959',
          cover: dappsNFT1,
          count: '12.456',
          estValue: 'SK 202.09',
          priceChange: {
            change: 2.4,
            positive: true,
          },
        },
        {
          number: '#769494',
          cover: dappsNFT2,
          count: '798.05',
          estValue: 'SK 2200.78',
          priceChange: {
            change: 7,
            positive: false,
          },
        },
        {
          number: '#928473',
          cover: dappsNFT3,
          count: '374.00',
          estValue: 'SK 112.12',
          priceChange: {
            change: 20,
            positive: true,
          },
        },
        {
          number: '#594093',
          cover: dappsNFT4,
          count: '12.00',
          estValue: 'SK 52.74',
          priceChange: {
            change: 12,
            positive: true,
          },
        },
        {
          number: '#7563290',
          cover: dappsNFT5,
          count: '11.01',
          estValue: 'SK 0.009',
          priceChange: {
            change: 24,
            positive: false,
          },
        },
      ],
    },
  },
];

export const nftListData: NftItemType[] = [{
  id: '1',
  imgSrc: nftItem1,
  fav: false,
  name: 'Art sculpture',
  priceChange: {
    change: 38.23,
    positive: true,
  },
  authorImgSrc: nftItemAuthor,
  floorPrice: 'SK 0.231',
  totalVolume: 'SK 234.903',
  card: {
    id: '1',
    cover: nftCardCover,
    smallCover: nftCardImg,
    holders: '32 094',
    followers: '32 094',
    floor: '0.2356',
    lastDayVolume: '23 993',
    lastDayChange: '23 993',
    title: 'Art sculpture',
    fullDescription: 'Art Sculpture is a collection ' +
      'of 10,000 unique NFT ART - unique digital collectibles ' +
      'that live on the blockchain Power. Your Art Sculpture serves as your ' +
      'museum membership card and grants access to member-only benefits, ' +
      'the first of which is access to the bakery. Future areas and perks ' +
      'can be unlocked by the community through roadmap activation',
    nfts: [
      {
        number: '#768959',
        cover: nftCardItem1,
        count: '12.456',
        estValue: 'SK 32340.09',
        priceChange: {
          change: 2.4,
          positive: true,
        },
      },
      {
        number: '#767162',
        cover: nftCardItem2,
        count: '0.73',
        estValue: 'SK 23.394',
        priceChange: {
          change: 2,
          positive: false,
        },
      },
      {
        number: '#9038267',
        cover: nftCardItem3,
        count: '12',
        estValue: 'SK 212.00',
        priceChange: null,
      },
      {
        number: '#27404',
        cover: nftCardItem4,
        count: null,
        estValue: 'SK 0.00009',
        priceChange: null,
      },
      {
        number: '#768959',
        cover: nftCardItem1,
        count: '12.456',
        estValue: 'SK 32340.09',
        priceChange: {
          change: 2.4,
          positive: true,
        },
      },
      {
        number: '#767162',
        cover: nftCardItem2,
        count: '0.73',
        estValue: 'SK 23.394',
        priceChange: {
          change: 2,
          positive: false,
        },
      },
      {
        number: '#9038267',
        cover: nftCardItem3,
        count: '12',
        estValue: 'SK 212.00',
        priceChange: null,
      },
      {
        number: '#27404',
        cover: nftCardItem4,
        count: null,
        estValue: 'SK 0.00009',
        priceChange: null,
      },
      {
        number: '#9038267',
        cover: nftCardItem3,
        count: '12',
        estValue: 'SK 212.00',
        priceChange: null,
      },
      {
        number: '#27404',
        cover: nftCardItem4,
        count: null,
        estValue: 'SK 0.00009',
        priceChange: null,
      },
    ],
  },
},
{
  id: '2',
  imgSrc: nftItem2,
  fav: false,
  name: 'Crampled paper',
  priceChange: {
    change: 11.23,
    positive: false,
  },
  authorImgSrc: nftItemAuthor,
  floorPrice: 'SK 122.90',
  totalVolume: 'SK 0.191',
  card: {
    id: '2',
    cover: nftCardCover,
    smallCover: nftCardImg,
    holders: '32 094',
    followers: '32 094',
    floor: '0.2356',
    lastDayVolume: '23 993',
    lastDayChange: '23 993',
    title: 'Art sculpture',
    fullDescription: 'Art Sculpture is a collection ' +
      'of 10,000 unique NFT ART - unique digital collectibles ' +
      'that live on the blockchain Power. Your Art Sculpture serves as your ' +
      'museum membership card and grants access to member-only benefits, ' +
      'the first of which is access to the bakery. Future areas and perks ' +
      'can be unlocked by the community through roadmap activation',
    nfts: [
      {
        number: '#768959',
        cover: nftCardItem1,
        count: '12.456',
        estValue: 'SK 32340.09',
        priceChange: {
          change: 2.4,
          positive: true,
        },
      },
      {
        number: '#767162',
        cover: nftCardItem2,
        count: '0.73',
        estValue: 'SK 23.394',
        priceChange: {
          change: 2,
          positive: false,
        },
      },
      {
        number: '#9038267',
        cover: nftCardItem3,
        count: '12',
        estValue: 'SK 212.00',
        priceChange: null,
      },
      {
        number: '#27404',
        cover: nftCardItem4,
        count: null,
        estValue: 'SK 0.00009',
        priceChange: null,
      },
      {
        number: '#768959',
        cover: nftCardItem1,
        count: '12.456',
        estValue: 'SK 32340.09',
        priceChange: {
          change: 2.4,
          positive: true,
        },
      },
      {
        number: '#767162',
        cover: nftCardItem2,
        count: '0.73',
        estValue: 'SK 23.394',
        priceChange: {
          change: 2,
          positive: false,
        },
      },
      {
        number: '#9038267',
        cover: nftCardItem3,
        count: '12',
        estValue: 'SK 212.00',
        priceChange: null,
      },
      {
        number: '#27404',
        cover: nftCardItem4,
        count: null,
        estValue: 'SK 0.00009',
        priceChange: null,
      },
      {
        number: '#9038267',
        cover: nftCardItem3,
        count: '12',
        estValue: 'SK 212.00',
        priceChange: null,
      },
      {
        number: '#27404',
        cover: nftCardItem4,
        count: null,
        estValue: 'SK 0.00009',
        priceChange: null,
      },
    ],
  },
},
{
  id: '3',
  imgSrc: nftItem3,
  fav: false,
  name: 'Crunch gallery',
  priceChange: {
    change: 8.00,
    positive: true,
  },
  authorImgSrc: nftItemAuthor,
  floorPrice: 'SK 0.21',
  totalVolume: 'SK 80.07',
  card: {
    id: '3',
    cover: nftCardCover,
    smallCover: nftCardImg,
    holders: '32 094',
    followers: '32 094',
    floor: '0.2356',
    lastDayVolume: '23 993',
    lastDayChange: '23 993',
    title: 'Art sculpture',
    fullDescription: 'Art Sculpture is a collection ' +
      'of 10,000 unique NFT ART - unique digital collectibles ' +
      'that live on the blockchain Power. Your Art Sculpture serves as your ' +
      'museum membership card and grants access to member-only benefits, ' +
      'the first of which is access to the bakery. Future areas and perks ' +
      'can be unlocked by the community through roadmap activation',
    nfts: [
      {
        number: '#768959',
        cover: nftCardItem1,
        count: '12.456',
        estValue: 'SK 32340.09',
        priceChange: {
          change: 2.4,
          positive: true,
        },
      },
      {
        number: '#767162',
        cover: nftCardItem2,
        count: '0.73',
        estValue: 'SK 23.394',
        priceChange: {
          change: 2,
          positive: false,
        },
      },
      {
        number: '#9038267',
        cover: nftCardItem3,
        count: '12',
        estValue: 'SK 212.00',
        priceChange: null,
      },
      {
        number: '#27404',
        cover: nftCardItem4,
        count: null,
        estValue: 'SK 0.00009',
        priceChange: null,
      },
      {
        number: '#768959',
        cover: nftCardItem1,
        count: '12.456',
        estValue: 'SK 32340.09',
        priceChange: {
          change: 2.4,
          positive: true,
        },
      },
      {
        number: '#767162',
        cover: nftCardItem2,
        count: '0.73',
        estValue: 'SK 23.394',
        priceChange: {
          change: 2,
          positive: false,
        },
      },
      {
        number: '#9038267',
        cover: nftCardItem3,
        count: '12',
        estValue: 'SK 212.00',
        priceChange: null,
      },
      {
        number: '#27404',
        cover: nftCardItem4,
        count: null,
        estValue: 'SK 0.00009',
        priceChange: null,
      },
      {
        number: '#9038267',
        cover: nftCardItem3,
        count: '12',
        estValue: 'SK 212.00',
        priceChange: null,
      },
      {
        number: '#27404',
        cover: nftCardItem4,
        count: null,
        estValue: 'SK 0.00009',
        priceChange: null,
      },
    ],
  },
},
{
  id: '4',
  imgSrc: nftItem4,
  fav: false,
  name: 'Just a monkey',
  priceChange: {
    change: 10.11,
    positive: false,
  },
  authorImgSrc: nftItemAuthor,
  floorPrice: 'SK 0.188',
  totalVolume: 'SK 121.003',
  card: {
    id: '4',
    cover: nftCardCover,
    smallCover: nftCardImg,
    holders: '32 094',
    followers: '32 094',
    floor: '0.2356',
    lastDayVolume: '23 993',
    lastDayChange: '23 993',
    title: 'Art sculpture',
    fullDescription: 'Art Sculpture is a collection ' +
      'of 10,000 unique NFT ART - unique digital collectibles ' +
      'that live on the blockchain Power. Your Art Sculpture serves as your ' +
      'museum membership card and grants access to member-only benefits, ' +
      'the first of which is access to the bakery. Future areas and perks ' +
      'can be unlocked by the community through roadmap activation',
    nfts: [
      {
        number: '#768959',
        cover: nftCardItem1,
        count: '12.456',
        estValue: 'SK 32340.09',
        priceChange: {
          change: 2.4,
          positive: true,
        },
      },
      {
        number: '#767162',
        cover: nftCardItem2,
        count: '0.73',
        estValue: 'SK 23.394',
        priceChange: {
          change: 2,
          positive: false,
        },
      },
      {
        number: '#9038267',
        cover: nftCardItem3,
        count: '12',
        estValue: 'SK 212.00',
        priceChange: null,
      },
      {
        number: '#27404',
        cover: nftCardItem4,
        count: null,
        estValue: 'SK 0.00009',
        priceChange: null,
      },
      {
        number: '#768959',
        cover: nftCardItem1,
        count: '12.456',
        estValue: 'SK 32340.09',
        priceChange: {
          change: 2.4,
          positive: true,
        },
      },
      {
        number: '#767162',
        cover: nftCardItem2,
        count: '0.73',
        estValue: 'SK 23.394',
        priceChange: {
          change: 2,
          positive: false,
        },
      },
      {
        number: '#9038267',
        cover: nftCardItem3,
        count: '12',
        estValue: 'SK 212.00',
        priceChange: null,
      },
      {
        number: '#27404',
        cover: nftCardItem4,
        count: null,
        estValue: 'SK 0.00009',
        priceChange: null,
      },
      {
        number: '#9038267',
        cover: nftCardItem3,
        count: '12',
        estValue: 'SK 212.00',
        priceChange: null,
      },
      {
        number: '#27404',
        cover: nftCardItem4,
        count: null,
        estValue: 'SK 0.00009',
        priceChange: null,
      },
    ],
  },
},
];
