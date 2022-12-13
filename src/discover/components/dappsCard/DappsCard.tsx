import React from 'react';
import { push } from 'connected-react-router';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { RootState } from 'application/store';
import { getDappsCardData } from 'discover/selectors/discoverSelectors';
import { RoutesEnum } from 'application/typings/routes';
import styles from './DappsCard.module.scss';

type OwnProps = RouteComponentProps<{ id: string }>;

const mapStateToProps = (_state: RootState, props: OwnProps) => ({
  currentDappsData: getDappsCardData(props?.match?.params?.id),
});

const mapDispatchToProps = {
  routeTo: push,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type DappsCardProps = ConnectedProps<typeof connector> & OwnProps;

class DappsCardComponent extends React.PureComponent<DappsCardProps, never> {
  handleRouteToDappsList = () => {
    const { routeTo } = this.props;

    routeTo(RoutesEnum.discover);
  };

  render() {
    const { currentDappsData } = this.props;
    console.log(this.props.currentDappsData);
    return <div className={styles.dappsCard} onClick={this.handleRouteToDappsList}>
      <div className={styles.dappsCoverHolder}>
        <img src={currentDappsData?.card?.cover} alt={'dappsCover'} />
      </div>
    </div>;
  }
}

export const DappsCard = connector(DappsCardComponent);
