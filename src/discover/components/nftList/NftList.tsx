import React from 'react';
import { push } from 'connected-react-router';
import { connect, ConnectedProps } from 'react-redux';
import { HubRoutesEnum } from 'application/typings/routes';
import classnames from 'classnames';
import { nftListData } from 'discover/utils/dappsData';
import styles from './Nft.module.scss';
import { NftItemType } from '../../typings/discoverTypings';
import { IconButton } from '../../../common';
import { FavIcon } from '../../../common/icons';

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  routeTo: push,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type NftListProps = ConnectedProps<typeof connector>;

type NftListState = {
  isMobile: boolean;
};

class NftListComponent extends React.PureComponent<NftListProps, NftListState> {
  handleAddToFavDapps = () => {};

  handleShowNftCard = (nftId: string) => () => {
    const { routeTo } = this.props;

    routeTo(`${HubRoutesEnum.discover}/nftCollection/${nftId}`);
  };

  renderNftListItem = (item: NftItemType) => {
    const {
      imgSrc,
      name,
      id,
      priceChange: { change, positive },
      totalVolume,
      floorPrice,
      authorImgSrc,
    } = item;

    return <div
      key={id}
      className={styles.nftItem}
      onClick={this.handleShowNftCard(id)}
    >
      <IconButton onClick={this.handleAddToFavDapps} className={styles.nftFav}>
        <FavIcon />
      </IconButton>
      <div className={styles.nftImgHolder}>
        <img className={styles.nftImg} src={imgSrc} alt={'nftImg'} />
        <img className={styles.nftAuthorImg} src={authorImgSrc} alt={'nftAuthor'} />
      </div>
      <div className={styles.nftInfoHolder}>
        <div className={styles.nftInfoHolderFirstLine}>
          <div className={styles.nftName}>{name}</div>
          <div className={classnames(
            styles.nftPriceChangeHolder,
            !positive && styles.nftPriceChangeHolder_negative,
          )}
          >
            <span>{positive ? '+' : '-'}</span>
            <div className={styles.dappsNftPriceChange}>{change}</div>
            {'%'}
          </div>
        </div>
        <div className={styles.nftInfoHolderSecondLine}>
          <div className={styles.nftTotalVolume}>
            <div>{'Total volume:'}</div>
            <div>{totalVolume}</div>
          </div>
          <div className={styles.nftFloorPrice}>
            <div>{'Floor price:'}</div>
            <div>{floorPrice}</div>
          </div>
        </div>
      </div>
    </div>;
  };

  render() {
    return <div className={styles.nftListWrapper}>
      {nftListData.concat(nftListData).map(this.renderNftListItem)}
    </div>;
  }
}

export const NftList = connector(NftListComponent);
