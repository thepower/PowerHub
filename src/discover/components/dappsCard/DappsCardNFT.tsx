import React from 'react';
import { DappsItemCardNftType } from 'discover/typings/discoverTypings';
import { IconButton, PaginationList } from 'common';
import classnames from 'classnames';
import { FavIcon } from 'common/icons';
import styles from './DappsCard.module.scss';

interface DappsCardNFTProps {
  nfts?: DappsItemCardNftType[];
}

interface DappsCardNFTState {
  currentPage: number;
}

export class DappsCardNFT extends React.PureComponent<DappsCardNFTProps, DappsCardNFTState> {
  constructor(props: DappsCardNFTProps) {
    super(props);

    this.state = {
      currentPage: 1,
    };
  }

  setCurrentNFT = (currentPage: number) => {
    this.setState({ currentPage });
  };

  handleAddToFavNFT = () => {};

  renderNFT = (nftData: DappsItemCardNftType, index: number) => {
    const {
      number,
      estValue,
      count,
      cover,
      priceChange,
      positive,
    } = nftData;
    return <div key={index} className={styles.dappsNft}>
      <div className={styles.dappsNftImgHolder}>
        <div style={{ backgroundImage: `url(${cover})` }} className={styles.dappsNftImg} />
        <IconButton onClick={this.handleAddToFavNFT} className={styles.dappsNftFav}>
          <FavIcon />
        </IconButton>
      </div>
      <div className={styles.dappsNftInfo}>
        <div className={styles.dappsNftInfoFirstLine}>
          <div className={styles.dappsCardNftNumber}>{number}</div>
          <div className={styles.dappsNftCount}>
            <span className={styles.dappsCardNftCountLabel}>{'Last'}</span>
            <span>{count}</span>
          </div>
        </div>
        <div className={styles.dappsNftInfoSecondLine}>
          <div className={styles.dappsNftPriceHolder}>
            <div className={styles.dappsNftPriceLabel}>{'Est.Value'}</div>
            <div className={styles.dappsNftPrice}>{estValue}</div>
          </div>
          <div className={classnames(
            styles.dappsNftPriceChangeHolder,
            !positive && styles.dappsNftPriceChangeHolder_negative,
          )}
          >
            <span>{positive ? '+' : '-'}</span>
            <div className={styles.dappsNftPriceChange}>{priceChange}</div>
            {'%'}
          </div>
        </div>
      </div>
    </div>;
  };

  render() {
    const { currentPage } = this.state;
    const { nfts } = this.props;

    return <div className={styles.nftHolder}>
      <div className={styles.nftHolderTitle}>
        {'NFT in the game'}
      </div>
      <div className={styles.nftDivider} />
      <PaginationList
        min={1}
        max={3}
        current={currentPage}
        onNext={this.setCurrentNFT}
        onPrev={this.setCurrentNFT}
        topPaginationClassName={styles.dappsNftPagination}
        bottomPaginationClassName={styles.dappsNftPagination}
      >
        <div className={styles.dappsNftListWrapper}>
          {nfts?.concat(nfts.slice().sort(() => Math.random() - 0.5)).map(this.renderNFT)}
        </div>
      </PaginationList>
    </div>;
  }
}
