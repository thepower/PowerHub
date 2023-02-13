import React from 'react';
import { RouteComponentProps } from 'react-router';
import { RootState } from 'application/store';
import { push } from 'connected-react-router';
import { connect, ConnectedProps } from 'react-redux';
import { nftCardData } from 'discover/utils/dappsData';
import { HeartIcon } from 'common/icons';
import { IconButton } from 'common';
import styles from './NftCard.module.scss';

type OwnProps = RouteComponentProps<{ id: string }>;

const mapStateToProps = (_state: RootState, _props: OwnProps) => ({
  nftData: nftCardData,
});

const mapDispatchToProps = {
  routeTo: push,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type NftCardProps = ConnectedProps<typeof connector> & OwnProps;

class NftCardComponent extends React.PureComponent<NftCardProps, never> {
  handleSetFav = () => {};

  // handleShareNft = () => {};

  render() {
    const {
      // id,
      img,
    } = this.props.nftData;

    return <div className={styles.nftCard}>
      <div className={styles.nftMainPart}>
        <div className={styles.nftImg} style={{ backgroundImage: `url(${img})` }}>
          <IconButton onClick={this.handleSetFav} className={styles.nftFav}>
            <HeartIcon />
          </IconButton>
        </div>
      </div>
    </div>;
  }
}

export const NftCard = connector(NftCardComponent);
