import React from 'react';
import { CardNftType } from 'discover/typings/discoverTypings';
import { IconButton, PaginationList } from 'common';
import classnames from 'classnames';
import { FavIcon } from 'common/icons';
import styles from './NftCollectionCard.module.scss';

interface NftCollectionsNftsProps {
  nfts?: CardNftType[];
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

  renderNFT = (nftData: CardNftType, index: number) => {
    const {
      number,
      estValue,
      count,
      cover,
      priceChange,
    } = nftData;
    return <div key={index} className={styles.nftCollectionNft}>
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
              <span className={styles.nftCollectionNftCountLabel}>{'Last'}</span>
              <span>{count}</span>
            </div>
          }
        </div>
        <div className={styles.nftCollectionNftInfoSecondLine}>
          <div className={styles.nftCollectionNftPriceHolder}>
            <div className={styles.nftCollectionNftPriceLabel}>{'Est.Value'}</div>
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
        {'NFT in the collection'}
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
