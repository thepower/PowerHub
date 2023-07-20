import React from 'react';
import { push } from 'connected-react-router';
import { connect, ConnectedProps } from 'react-redux';
import { HubRoutesEnum } from 'application/typings/routes';
import { dappsData } from 'discover/utils/dappsData';
import styles from './DappsList.module.scss';
import { DappsItemType } from '../../typings/discoverTypings';
import { IconButton } from '../../../common';
import { FavIcon } from '../../../common/icons';

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  routeTo: push,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type DappsListProps = ConnectedProps<typeof connector>;

type DappsListState = {
  isMobile: boolean;
};

class DappsListComponent extends React.PureComponent<DappsListProps, DappsListState> {
  constructor(props: DappsListProps) {
    super(props);

    this.state = {
      isMobile: window.innerWidth < 768,
    };
  }

  handleAddToFavDapps = () => {};

  handleShowDappsCard = (dappsId: string) => () => {
    const { routeTo } = this.props;

    routeTo(`${HubRoutesEnum.discover}/dapps/${dappsId}`);
  };

  renderDappsListItem = (item: DappsItemType, index: number) => {
    const {
      imgSrc,
      name,
      genre,
      id,
    } = item;

    return <div
      key={index}
      className={styles.dappsItem}
      onClick={this.handleShowDappsCard(id)}
    >
      <IconButton onClick={this.handleAddToFavDapps} className={styles.dappsFav}>
        <FavIcon />
      </IconButton>
      <div className={styles.dappsImgHolder}>
        <img className={styles.dappsImg} src={imgSrc} alt={'dappImg'} />
      </div>
      <div className={styles.dappsName}>{name}</div>
      <div className={styles.dappsGenre}>{genre}</div>
    </div>;
  };

  render() {
    const { isMobile } = this.state;

    return <div className={styles.dappsListWrapper}>
      {Array(isMobile ? 8 : 12).fill(dappsData[0]).map(this.renderDappsListItem)}
    </div>;
  }
}

export const DappsList = connector(DappsListComponent);
