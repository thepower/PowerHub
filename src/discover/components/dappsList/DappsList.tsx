import React from 'react';
import styles from './DappsList.module.scss';
import { DappsItemType } from '../../typings/discoverTypings';
import { dappsListData } from '../../utils/dappsListData';
import { IconButton } from '../../../common';
import { FavIcon } from '../../../common/icons';

export class DappsList extends React.PureComponent<{}, {}> {
  handleAddToFavDapps = () => {};

  renderDappsListItem = (item: DappsItemType) => {
    const {
      imgSrc,
      name,
      genre,
    } = item;

    return <div className={styles.dappsItem}>
      <IconButton onClick={this.handleAddToFavDapps} className={styles.dappsFav}>
        <FavIcon />
      </IconButton>
      <div className={styles.dappsImgHolder}>
        <img className={styles.dappsImg} src={imgSrc} alt={'dappImg'} />
      </div>
      <div className={styles.dappsName}>{name}</div>
      <div className={styles.dappsGenre}>{genre}</div>
    </div>;
  };

  render() {
    return <div className={styles.dappsListWrapper}>
      {Array(12).fill(dappsListData[0]).map(this.renderDappsListItem)}
    </div>;
  }
}
