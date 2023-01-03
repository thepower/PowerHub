import { DappsItemType } from '../typings/discoverTypings';
import dummyDappsImg from './startWarDapps.png';
import dappsCardSmallCover from './dappsCardSmallCover.png';
import dappsCardCover from './dappsCardCover.png';
import dappsNFT1 from './dappsNFT1.png';
import dappsNFT2 from './dappsNFT2.png';
import dappsNFT3 from './dappsNFT3.png';
import dappsNFT4 from './dappsNFT4.png';
import dappsNFT5 from './dappsNFT5.png';

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
          priceChange: 2.4,
          positive: true,
        },
        {
          number: '#769494',
          cover: dappsNFT2,
          count: '798.05',
          estValue: 'SK 2200.78',
          priceChange: 7,
          positive: false,
        },
        {
          number: '#928473',
          cover: dappsNFT3,
          count: '374.00',
          estValue: 'SK 112.12',
          priceChange: 20,
          positive: true,
        },
        {
          number: '#594093',
          cover: dappsNFT4,
          count: '12.00',
          estValue: 'SK 52.74',
          priceChange: 12,
          positive: true,
        },
        {
          number: '#7563290',
          cover: dappsNFT5,
          count: '11.01',
          estValue: 'SK 0.009',
          priceChange: 24,
          positive: false,
        },
      ],
    },
  },
];
