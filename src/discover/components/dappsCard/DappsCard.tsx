import { Collapse } from '@mui/material';
import { setBackUrl } from 'application/slice/applicationSlice';
import { RootState } from 'application/store';
import { HubRoutesEnum } from 'application/typings/routes';
import { Button, IconButton } from 'common';
import {
  ChevronDown,
  ChevronLeftIcon,
  ChevronUp,
  CloseIcon,
  HeartIcon,
  ShareIcon,
} from 'common/icons';
import { push } from 'connected-react-router';
import { DappsCardNfts } from 'discover/components/dappsCard/DappsCardNfts';
import { getDappsCardData } from 'discover/selectors/discoverSelectors';
import { setCurrentDiscoverTab } from 'discover/slice/discoverSlice';
import { DiscoverTabs } from 'discover/typings/discoverTypings';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { ConnectedProps, connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
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
type DappsCardProps = ConnectedProps<typeof connector> & OwnProps & WithTranslation;

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
        {showMoreInfo ? this.props.t('showLess') : this.props.t('showMore')}
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
          {this.props.t('joinTheCommunity')}
        </Button>
        <Button
          className={styles.dappsButton}
          size="medium"
          variant="filled"
          type="button"
          onClick={this.handlePlayToGame}
        >
          {this.props.t('playToGame')}
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

export const DappsCard = withTranslation()(connector(DappsCardComponent));
