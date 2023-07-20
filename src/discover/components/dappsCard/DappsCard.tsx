import React from 'react';
import { push } from 'connected-react-router';
import {
  CloseIcon,
  ChevronLeftIcon,
  ChevronDown,
  ChevronUp,
  HeartIcon,
  ShareIcon,
} from 'common/icons';
import { Button, IconButton } from 'common';
import { DiscoverTabs } from 'discover/typings/discoverTypings';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { setCurrentDiscoverTab } from 'discover/slice/discoverSlice';
import { RootState } from 'application/store';
import { Collapse } from '@mui/material';
import { getDappsCardData } from 'discover/selectors/discoverSelectors';
import { HubRoutesEnum } from 'application/typings/routes';
import { DappsCardNfts } from 'discover/components/dappsCard/DappsCardNfts';
import { setBackUrl } from 'application/slice/applicationSlice';
import styles from './DappsCard.module.scss';

type OwnProps = RouteComponentProps<{ id: string }>;

const mapStateToProps = (_state: RootState, props: OwnProps) => ({
  currentDappsData: getDappsCardData(props?.match?.params?.id),
});

const mapDispatchToProps = {
  routeTo: push,
  setCurrentDiscoverTab,
  setBackUrl,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type DappsCardProps = ConnectedProps<typeof connector> & OwnProps;

type DappsCardState = {
  showMoreInfo: boolean;
};

class DappsCardComponent extends React.PureComponent<DappsCardProps, DappsCardState> {
  constructor(props: DappsCardProps) {
    super(props);

    this.state = {
      showMoreInfo: false,
    };
  }

  toggleShowMore = () => {
    this.setState((state) => ({ showMoreInfo: !state.showMoreInfo }));
  };

  handleRouteToDiscover = () => {
    const { routeTo } = this.props;

    setCurrentDiscoverTab(DiscoverTabs.Dapps);
    routeTo(HubRoutesEnum.discover);
  };

  renderGenre = (genre: string) => (
    <div
      key={genre}
      className={styles.dappsCardGenre}
    >
      {genre}
    </div>
  );

  renderShowMoreButton = () => {
    const { showMoreInfo } = this.state;
    return <div className={styles.dappsCardShowMoreButton} onClick={this.toggleShowMore}>
      <span className={styles.dappsCardShowMoreButtonLabel}>
        {showMoreInfo ? 'Show less' : 'Show more'}
      </span>
      {showMoreInfo ? <ChevronUp /> : <ChevronDown />}
    </div>;
  };

  handleSetFav = () => {};

  handleShareDapps = () => {};

  handleJoinToCommunity = () => {};

  handlePlayToGame = () => {};

  render() {
    const { currentDappsData, routeTo, setBackUrl } = this.props;
    const { showMoreInfo } = this.state;

    return <div className={styles.dappsCard}>
      <div className={styles.dappsCardControls}>
        <IconButton onClick={this.handleRouteToDiscover} className={styles.dappsCardBackButton}>
          <ChevronLeftIcon />
        </IconButton>
        <IconButton onClick={this.handleRouteToDiscover}>
          <CloseIcon />
        </IconButton>
      </div>
      <div
        className={styles.dappsCoverHolder}
        style={{ backgroundImage: `url(${currentDappsData?.card?.cover})` }}
      >
        <div className={styles.dappsCardGenreHolder}>
          {currentDappsData?.card.genre.map(this.renderGenre)}
        </div>
        <div className={styles.dappsCardSmallCover}>
          <img src={currentDappsData?.card?.smallCover} alt={'dappsSmallCover'} />
        </div>
      </div>
      <div className={styles.dappsCardInfoHolder}>
        <div className={styles.dappsCardInfo}>
          <div className={styles.dappsCardTitle}>
            {currentDappsData?.card.title}
          </div>
          <Collapse in={showMoreInfo} collapsedSize={32}>
            <div className={styles.dappsCardDesc}>
              {currentDappsData?.card.fullDescription}
            </div>
          </Collapse>
          {this.renderShowMoreButton()}
        </div>
        <div className={styles.dappsCardIconsHolder}>
          <IconButton onClick={this.handleSetFav}>
            <HeartIcon />
          </IconButton>
          <IconButton onClick={this.handleShareDapps}>
            <ShareIcon />
          </IconButton>
        </div>
      </div>
      <div className={styles.dappsButtonHolder}>
        <Button
          className={styles.dappsButton}
          size="medium"
          variant="outlined"
          type="button"
          onClick={this.handleJoinToCommunity}
        >
          {'JOIN THE COMMUNITY'}
        </Button>
        <Button
          className={styles.dappsButton}
          size="medium"
          variant="filled"
          type="button"
          onClick={this.handlePlayToGame}
        >
          {'PLAY TO GAME'}
        </Button>
      </div>
      <DappsCardNfts
        nfts={currentDappsData?.card.nfts}
        routeTo={routeTo}
        setBackUrl={setBackUrl}
      />
    </div>;
  }
}

export const DappsCard = connector(DappsCardComponent);
