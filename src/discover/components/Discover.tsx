import React from 'react';
import {
  Pagination, ShallowPageTemplate, Tabs, TopBar,
} from 'common';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../application/store';
import { getCurrentDiscoverPage, getCurrentDiscoverTab } from '../selectors/discoverSelectors';
import { DiscoverTabs } from '../typings/discoverTypings';
import { setCurrentDiscoverTab, setCurrentDiscoverPage } from '../slice/discoverSlice';
import styles from './Discover.module.scss';
import { DappsList } from './dappsList/DappsList';

const mapStateToProps = (state: RootState) => ({
  tab: getCurrentDiscoverTab(state),
  currentPage: getCurrentDiscoverPage(state),
});

const mapDispatchToProps = {
  setCurrentDiscoverTab,
  setCurrentDiscoverPage,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type DiscoverPageProps = ConnectedProps<typeof connector>;

class DiscoverPage extends React.PureComponent<DiscoverPageProps, never> {
  onChangeTab = (_event: React.SyntheticEvent, value: DiscoverTabs) => {
    this.props.setCurrentDiscoverTab(value);
    this.props.setCurrentDiscoverPage(1);
  };

  render() {
    const { tab, currentPage, setCurrentDiscoverPage } = this.props;

    return <ShallowPageTemplate>
      <TopBar type="shallow">
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
        {
          tab === DiscoverTabs.Dapps &&
          <DappsList />
        }
        <Pagination
          className={styles.discoverPagination}
          min={1}
          max={3}
          current={currentPage}
          onNext={setCurrentDiscoverPage}
          onPrev={setCurrentDiscoverPage}
        />
      </div>
    </ShallowPageTemplate>;
  }
}

export default connector(DiscoverPage);
