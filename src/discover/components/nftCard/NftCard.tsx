import React from 'react';
import { RouteComponentProps } from 'react-router';
import { RootState } from 'application/store';
import { push, goBack } from 'connected-react-router';
import { connect, ConnectedProps } from 'react-redux';
import { nftCardData } from 'discover/utils/dappsData';
import {
  HeartIcon,
  ShareIcon,
  RefreshIcon,
  CloseIcon,
} from 'common/icons';
import { IconButton } from 'common';
import { NftCardInfoRecordType } from 'discover/typings/discoverTypings';
import styles from './NftCard.module.scss';

type OwnProps = RouteComponentProps<{ id: string }>;

const mapStateToProps = (_state: RootState, _props: OwnProps) => ({
  nftData: nftCardData,
});

const mapDispatchToProps = {
  routeTo: push,
  goBack,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type NftCardProps = ConnectedProps<typeof connector> & OwnProps;

class NftCardComponent extends React.PureComponent<NftCardProps, never> {
  handleSetFav = () => {};

  handleShareNft = () => {};

  handleClose = () => {
    this.props.goBack();
  };

  handleRefreshNftData = () => {
    window.location.reload();
  };

  renderOwnersPart = () => {
    const {
      collection,
      collectionImg,
      creatorAddress,
      creatorImg,
      ownerAddress,
      ownerImg,
    } = this.props.nftData;

    return <div className={styles.nftOwnersInfo}>
      <div className={styles.nftOwnersInfoPart}>
        <div className={styles.nftOwnerPartImg} style={{ backgroundImage: `url(${collectionImg})` }} />
        <div className={styles.nftOwnersInfoTextPart}>
          <div>{'Collection'}</div>
          <div>{collection}</div>
        </div>
      </div>
      <div className={styles.nftOwnersInfoPart}>
        <div className={styles.nftOwnerPartImg} style={{ backgroundImage: `url(${creatorImg})` }} />
        <div className={styles.nftOwnersInfoTextPart}>
          <div>{'Creator'}</div>
          <div>{creatorAddress}</div>
        </div>
      </div>
      <div className={styles.nftOwnersInfoPart}>
        <div className={styles.nftOwnerPartImg} style={{ backgroundImage: `url(${ownerImg})` }} />
        <div className={styles.nftOwnersInfoTextPart}>
          <div>{'Owner'}</div>
          <div>{ownerAddress}</div>
        </div>
      </div>
      {this.renderNftInfoPart()}
    </div>;
  };

  renderNftInfoRecord = (key: NftCardInfoRecordType) => (
    <div className={styles.nftInfoPartRecord}>
      <div className={styles.nftInfoPartKey}>{key.label}</div>
      <div className={styles.nftInfoPartValue}>{key.value}</div>
    </div>
  );

  renderNftInfoPart = () => {
    const { nftCardInfo } = this.props.nftData;

    return <div className={styles.nftInfoPart}>
      {Object.values(nftCardInfo).map(this.renderNftInfoRecord)}
    </div>;
  };

  renderNftButtons = () => (
    <div className={styles.nftButtonsHolder}>
      <IconButton onClick={this.handleRefreshNftData} className={styles.nftRefreshButton}>
        <RefreshIcon />
      </IconButton>
      <IconButton onClick={this.handleShareNft}>
        <ShareIcon />
      </IconButton>
      <IconButton onClick={this.handleClose}>
        <CloseIcon />
      </IconButton>
    </div>
  );

  render() {
    const { img } = this.props.nftData;

    return <div className={styles.nftCard}>
      <div className={styles.nftMainPart}>
        <div className={styles.nftImg} style={{ backgroundImage: `url(${img})` }}>
          <IconButton onClick={this.handleSetFav} className={styles.nftFav}>
            <HeartIcon />
          </IconButton>
        </div>
        {this.renderOwnersPart()}
        {this.renderNftButtons()}
      </div>
    </div>;
  }
}

export const NftCard = connector(NftCardComponent);