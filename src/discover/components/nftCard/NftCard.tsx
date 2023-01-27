import React from 'react';
import { RouteComponentProps } from 'react-router';
import { RootState } from 'application/store';
import { getNftCardData } from 'discover/selectors/discoverSelectors';
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
import { RoutesEnum } from 'application/typings/routes';
import { Collapse } from '@mui/material';
import styles from './NftCard.module.scss';

type OwnProps = RouteComponentProps<{ id: string }>;

const mapStateToProps = (_state: RootState, props: OwnProps) => ({
  currentNftData: getNftCardData(props?.match?.params?.id),
});

const mapDispatchToProps = {
  routeTo: push,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type NftCardProps = ConnectedProps<typeof connector> & OwnProps;

type NftCardState = {
  showMoreInfo: boolean;
};

class NftCardComponent extends React.PureComponent<NftCardProps, NftCardState> {
  constructor(props: NftCardProps) {
    super(props);

    this.state = {
      showMoreInfo: false,
    };
  }

  handleRouteToDiscover = () => {
    const { routeTo } = this.props;

    routeTo(RoutesEnum.discover);
  };

  handleSetFav = () => {};

  handleShareNft = () => {};

  toggleShowMore = () => {
    this.setState((state) => ({ showMoreInfo: !state.showMoreInfo }));
  };

  renderShowMoreButton = () => {
    const { showMoreInfo } = this.state;

    return <div className={styles.nftCardShowMoreButton} onClick={this.toggleShowMore}>
      <span className={styles.nftCardShowMoreButtonLabel}>
        {showMoreInfo ? 'Show less' : 'Show more'}
      </span>
      {showMoreInfo ? <ChevronUp /> : <ChevronDown />}
    </div>;
  };

  renderNftCardMetrics = () => {
    const { card } = this.props.currentNftData!;

    return <div className={styles.nftCardMetricsHolder}>
      <div className={styles.nftCardMetrics}>
        <div className={styles.nftCardMetricsDesc}>{'Holders'}</div>
        <div>{card.holders}</div>
      </div>
      <div className={styles.nftCardMetrics}>
        <div className={styles.nftCardMetricsDesc}>{'Followers'}</div>
        <div>{card.followers}</div>
      </div>
      <div className={styles.nftCardMetrics}>
        <div className={styles.nftCardMetricsDesc}>{'Floor'}</div>
        <div>{card.floor}</div>
      </div>
      <div className={styles.nftCardMetrics}>
        <div className={styles.nftCardMetricsDesc}>{'24h Volume'}</div>
        <div>{card.lastDayVolume}</div>
      </div>
      <div className={styles.nftCardMetrics}>
        <div className={styles.nftCardMetricsDesc}>{'24h Change'}</div>
        <div>{card.lastDayChange}</div>
      </div>
    </div>;
  };

  render() {
    const { card } = this.props.currentNftData!;
    const { showMoreInfo } = this.state;

    return <div className={styles.nftCard}>
      <div className={styles.nftCardControls}>
        <IconButton onClick={this.handleRouteToDiscover}>
          <CloseIcon />
        </IconButton>
      </div>
      <div
        className={styles.nftCoverHolder}
        style={{ backgroundImage: `url(${card.cover})` }}
      >
        {this.renderNftCardMetrics()}
        <div className={styles.nftSmallCover}>
          <img src={card?.smallCover} alt={'nftSmallCover'} />
        </div>
        <div className={styles.nftCardInfoHolder}>
          <div className={styles.dappsCardInfo}>
            <div className={styles.nftCardTitle}>
              {card.title}
            </div>
            <Collapse in={showMoreInfo} collapsedSize={16}>
              <div className={styles.nftCardDesc}>
                {card.fullDescription}
              </div>
            </Collapse>
            {this.renderShowMoreButton()}
          </div>
          <div className={styles.nftCardIconsHolder}>
            <IconButton onClick={this.handleSetFav}>
              <HeartIcon />
            </IconButton>
            <IconButton onClick={this.handleShareNft}>
              <ShareIcon />
            </IconButton>
          </div>
        </div>
      </div>
    </div>;
  }
}

export const NftCard = connector(NftCardComponent);
