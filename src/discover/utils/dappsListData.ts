import { DappsItemType } from '../typings/discoverTypings';
import dummyDappsImg from './startWarDapps.png';
import dappsCardSmallCover from './dappsCardSmallCover.png';
import dappsCardCover from './dappsCardCover.png';

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
    },
  },
];
