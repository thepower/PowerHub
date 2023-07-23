import React from 'react';
import { CardNftType } from 'discover/typings/discoverTypings';
import { IconButton, PaginationList } from 'common';
import classnames from 'classnames';
import { FavIcon } from 'common/icons';
import { HubRoutesEnum } from 'application/typings/routes';
import { t } from 'i18next';
import styles from './NftCollectionCard.module.scss';

interface NftCollectionsNftsProps {
  nfts?: CardNftType[];
  routeTo: (url: string) => void;
  setBackUrl: (url: string) => void;
}

interface NftCollectionsNftsState {
  currentPage: number;
}

export class NftCollectionsNfts extends React.PureComponent<NftCollectionsNftsProps, NftCollectionsNftsState> {
  constructor(props: NftCollectionsNftsProps) {
    super(props);

    this.state = {
      currentPage: 1,
    };
  }

  setCurrentNFT = (currentPage: number) => {
    this.setState({ currentPage });
  };

  handleAddToFavNFT = () => {};

  handleRouteToNftCard = (id: string) => () => {
    const { setBackUrl, routeTo } = this.props;

    setBackUrl(window.location.pathname);
    routeTo(`${HubRoutesEnum.discover}/nft/${id}`);
  };

  renderNFT = (nftData: CardNftType, index: number) => {
    const {
      number,
      estValue,
      count,
      cover,
      priceChange,
      id,
    } = nftData;
    return <div
      key={index}
      className={styles.nftCollectionNft}
      onClick={this.handleRouteToNftCard(id!)}
    >
      <div className={styles.nftCollectionNftImgHolder}>
        <div style={{ backgroundImage: `url(${cover})` }} className={styles.nftCollectionNftImg} />
        <IconButton onClick={this.handleAddToFavNFT} className={styles.nftCollectionNftFav}>
          <FavIcon />
        </IconButton>
      </div>
      <div className={styles.nftCollectionNftInfo}>
        <div className={styles.nftCollectionNftInfoFirstLine}>
          <div className={styles.nftCollectionNftNumber}>{number}</div>
          {
            count &&
            <div className={styles.nftCollectionNftCount}>
              <span className={styles.nftCollectionNftCountLabel}>{t('last')}</span>
              <span>{count}</span>
            </div>
          }
        </div>
        <div className={styles.nftCollectionNftInfoSecondLine}>
          <div className={styles.nftCollectionNftPriceHolder}>
            <div className={styles.nftCollectionNftPriceLabel}>{t('estValue')}</div>
            <div className={styles.nftCollectionNftPrice}>{estValue}</div>
          </div>
          {
            priceChange &&
            <div className={classnames(
              styles.nftCollectionNftPriceChangeHolder,
              !priceChange.positive && styles.nftCollectionNftPriceChangeHolder_negative,
            )}
            >
              <span>{priceChange.positive ? '+' : '-'}</span>
              <div className={styles.nftCollectionNftPriceChange}>{priceChange.change}</div>
              {'%'}
            </div>
          }
        </div>
      </div>
    </div>;
  };

  render() {
    const { currentPage } = this.state;
    const { nfts } = this.props;

    return <div className={styles.nftCollectionNftHolder}>
      <div className={styles.nftCollectionNftHolderTitle}>
        {t('nftInCollection')}
      </div>
      <div className={styles.nftCollectionNftDivider} />
      <PaginationList
        min={1}
        max={3}
        current={currentPage}
        onNext={this.setCurrentNFT}
        onPrev={this.setCurrentNFT}
        topPaginationClassName={styles.nftCollectionNftPagination}
        bottomPaginationClassName={styles.nftCollectionNftPagination}
      >
        <div className={styles.nftCollectionNftListWrapper}>
          {nfts?.slice().sort(() => Math.random() - 0.5).map(this.renderNFT)}
        </div>
      </PaginationList>
    </div>;
  }
}
