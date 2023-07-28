import { HubRoutesEnum } from 'application/typings/routes';
import classnames from 'classnames';
import { IconButton, PaginationList } from 'common';
import { FavIcon } from 'common/icons';
import { CardNftType } from 'discover/typings/discoverTypings';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import styles from './DappsCard.module.scss';

interface DappsCardNFTProps extends WithTranslation {
  nfts?: CardNftType[];
  routeTo: (url: string) => void;
  setBackUrl: (url: string) => void;
}

interface DappsCardNFTState {
  currentPage: number;
}

class DappsCardNftsComponent extends React.PureComponent<DappsCardNFTProps, DappsCardNFTState> {
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

  handleRouteToNftCard = (id: string) => () => {
    const { routeTo, setBackUrl } = this.props;
    setBackUrl(window.location.pathname);
    routeTo(`${HubRoutesEnum.discover}/nft/${id}`);
  };

  renderNFT = (nftData: CardNftType, index: number) => {
    const {
      id,
      number,
      estValue,
      count,
      cover,
      priceChange,
    } = nftData;
    return <div
      key={index}
      className={styles.dappsNft}
      onClick={this.handleRouteToNftCard(id!)}
    >
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
            <span className={styles.dappsCardNftCountLabel}>{this.props.t('last')}</span>
            <span>{count}</span>
          </div>
        </div>
        <div className={styles.dappsNftInfoSecondLine}>
          <div className={styles.dappsNftPriceHolder}>
            <div className={styles.dappsNftPriceLabel}>{this.props.t('estValue')}</div>
            <div className={styles.dappsNftPrice}>{estValue}</div>
          </div>
          {
            priceChange &&
            <div className={classnames(
              styles.dappsNftPriceChangeHolder,
              !priceChange.positive && styles.dappsNftPriceChangeHolder_negative,
            )}
            >
              <span>{priceChange.positive ? '+' : '-'}</span>
              <div className={styles.dappsNftPriceChange}>{priceChange.change}</div>
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

    return <div className={styles.nftHolder}>
      <div className={styles.nftHolderTitle}>
        {this.props.t('nftInGame')}
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

export const DappsCardNfts = withTranslation()(DappsCardNftsComponent);
