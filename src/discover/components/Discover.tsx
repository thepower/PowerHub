import React from 'react';
import classnames from 'classnames';
import {
  PaginationList,
  ShallowPageTemplate,
  Tabs,
  TopBar,
} from 'common';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from 'application/store';
import { getCurrentDiscoverTab } from '../selectors/discoverSelectors';
import { DiscoverTabs } from '../typings/discoverTypings';
import { setCurrentDiscoverTab } from '../slice/discoverSlice';
import styles from './Discover.module.scss';
import { DappsList } from './dappsList/DappsList';

const mapStateToProps = (state: RootState) => ({
  tab: getCurrentDiscoverTab(state),
});

const mapDispatchToProps = {
  setCurrentDiscoverTab,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type DiscoverPageProps = ConnectedProps<typeof connector>;

type DiscoverPageState = {
  currentPage: number;
};

class DiscoverPage extends React.PureComponent<DiscoverPageProps, DiscoverPageState> {
  constructor(props: DiscoverPageProps) {
    super(props);

    this.state = {
      currentPage: 1,
    };
  }

  setCurrentDiscoverPage = (currentPage: number) => {
    this.setState({ currentPage });
  };

  onChangeTab = (_event: React.SyntheticEvent, value: DiscoverTabs) => {
    this.props.setCurrentDiscoverTab(value);
    this.setCurrentDiscoverPage(1);
  };

  render() {
    const { tab } = this.props;
    const { currentPage } = this.state;

    return <ShallowPageTemplate>
      <TopBar className={styles.discoverTopBar} type="shallow">
        <Tabs
          tabs={DiscoverTabs}
          tabsLabels={DiscoverTabs}
          value={tab}
          onChange={this.onChangeTab}
          tabsHolderClassName={styles.discoverTabsHolder}
          tabClassName={styles.discoverTab}
          tabIndicatorClassName={styles.discoverTabIndicator}
          tabSelectedClassName={styles.discoverTabSelected}
        />
      </TopBar>
      <div className={styles.discover}>
        <PaginationList
          min={1}
          max={3}
          current={currentPage}
          onNext={this.setCurrentDiscoverPage}
          onPrev={this.setCurrentDiscoverPage}
          topPaginationClassName={classnames(styles.discoverPagination, styles.discoverTopPagination)}
          bottomPaginationClassName={styles.discoverPagination}
        >
          {tab === DiscoverTabs.Dapps && <DappsList />}
        </PaginationList>
      </div>
    </ShallowPageTemplate>;
  }
}

export default connector(DiscoverPage);
