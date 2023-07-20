import React from 'react';
import { RouteComponentProps } from 'react-router';
import { RootState } from 'application/store';
import { getNftCollectionCardData } from 'discover/selectors/discoverSelectors';
import { push } from 'connected-react-router';
import { connect, ConnectedProps } from 'react-redux';
import { IconButton } from 'common';
import {
  ChevronDown,
  ChevronUp,
  CloseIcon,
  HeartIcon,
  ShareIcon,
} from 'common/icons';
import { HubRoutesEnum } from 'application/typings/routes';
import { Collapse } from '@mui/material';
import { DiscoverTabs } from 'discover/typings/discoverTypings';
import { setBackUrl } from 'application/slice/applicationSlice';
import styles from './NftCollectionCard.module.scss';
import { NftCollectionsNfts } from './NftCollectionNfts';
import { setCurrentDiscoverTab } from '../../slice/discoverSlice';

type OwnProps = RouteComponentProps<{ id: string }>;

const mapStateToProps = (_state: RootState, props: OwnProps) => ({
  currentNftData: getNftCollectionCardData(props?.match?.params?.id),
});

const mapDispatchToProps = {
  routeTo: push,
  setCurrentDiscoverTab,
  setBackUrl,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type NftCollectionCardProps = ConnectedProps<typeof connector> & OwnProps;

type NftCollectionCardState = {
  showMoreInfo: boolean;
};

class NftCollectionCardComponent extends React.PureComponent<NftCollectionCardProps, NftCollectionCardState> {
  constructor(props: NftCollectionCardProps) {
    super(props);

    this.state = {
      showMoreInfo: false,
    };
  }

  handleRouteToDiscover = () => {
    const { routeTo, setCurrentDiscoverTab } = this.props;

    setCurrentDiscoverTab(DiscoverTabs.NFT);

    routeTo(HubRoutesEnum.discover);
  };

  handleSetFav = () => {};

  handleShareNft = () => {};

  toggleShowMore = () => {
    this.setState((state) => ({ showMoreInfo: !state.showMoreInfo }));
  };

  renderShowMoreButton = () => {
    const { showMoreInfo } = this.state;

    return <div className={styles.nftCollectionCardShowMoreButton} onClick={this.toggleShowMore}>
      <span className={styles.nftCollectionCardShowMoreButtonLabel}>
        {showMoreInfo ? 'Show less' : 'Show more'}
      </span>
      {showMoreInfo ? <ChevronUp /> : <ChevronDown />}
    </div>;
  };

  renderNftCollectionCardMetrics = () => {
    const { card } = this.props.currentNftData!;

    return <div className={styles.nftCollectionCardMetricsHolder}>
      <div className={styles.nftCollectionCardMetrics}>
        <div className={styles.nftCollectionCardMetricsDesc}>{'Holders'}</div>
        <div>{card.holders}</div>
      </div>
      <div className={styles.nftCollectionCardMetrics}>
        <div className={styles.nftCollectionCardMetricsDesc}>{'Followers'}</div>
        <div>{card.followers}</div>
      </div>
      <div className={styles.nftCollectionCardMetrics}>
        <div className={styles.nftCollectionCardMetricsDesc}>{'Floor'}</div>
        <div>{card.floor}</div>
      </div>
      <div className={styles.nftCollectionCardMetrics}>
        <div className={styles.nftCollectionCardMetricsDesc}>{'24h Volume'}</div>
        <div>{card.lastDayVolume}</div>
      </div>
      <div className={styles.nftCollectionCardMetrics}>
        <div className={styles.nftCollectionCardMetricsDesc}>{'24h Change'}</div>
        <div>{card.lastDayChange}</div>
      </div>
    </div>;
  };

  render() {
    const { card } = this.props.currentNftData!;
    const { showMoreInfo } = this.state;

    return <div className={styles.nftCollectionCard}>
      <div className={styles.nftCollectionCardControls}>
        <IconButton onClick={this.handleRouteToDiscover}>
          <CloseIcon />
        </IconButton>
      </div>
      <div
        className={styles.nftCoverHolder}
        style={{ backgroundImage: `url(${card.cover})` }}
      >
        {this.renderNftCollectionCardMetrics()}
        <div className={styles.nftSmallCover}>
          <img src={card?.smallCover} alt={'nftSmallCover'} />
        </div>
      </div>
      <div className={styles.nftCollectionCardInfoHolder}>
        <div className={styles.dappsCardInfo}>
          <div className={styles.nftCollectionCardTitle}>
            {card.title}
          </div>
          <Collapse in={showMoreInfo} collapsedSize={16}>
            <div className={styles.nftCollectionCardDesc}>
              {card.fullDescription}
            </div>
          </Collapse>
          {this.renderShowMoreButton()}
        </div>
        <div className={styles.nftCollectionCardIconsHolder}>
          <IconButton onClick={this.handleSetFav}>
            <HeartIcon />
          </IconButton>
          <IconButton onClick={this.handleShareNft}>
            <ShareIcon />
          </IconButton>
        </div>
      </div>
      <NftCollectionsNfts
        nfts={card.nfts}
        routeTo={this.props.routeTo}
        setBackUrl={this.props.setBackUrl}
      />
    </div>;
  }
}

export const NftCollectionCard = connector(NftCollectionCardComponent);
