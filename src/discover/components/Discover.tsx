import React from 'react';
import { ShallowPageTemplate, Tabs, TopBar } from 'common';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../application/store';
import { getCurrentDiscoverTab } from '../selectors/discoverSelectors';
import { DiscoverTabs } from '../typings/discoverTypings';
import { setCurrentDiscoverTab } from '../slice/discoverSlice';
import styles from './Discover.module.scss';

const mapStateToProps = (state: RootState) => ({
  tab: getCurrentDiscoverTab(state),
});
const mapDispatchToProps = {
  setCurrentDiscoverTab,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type DiscoverPageProps = ConnectedProps<typeof connector>;

class DiscoverPage extends React.PureComponent<DiscoverPageProps, never> {
  onChangeTab = (_event: React.SyntheticEvent, value: DiscoverTabs) => {
    this.props.setCurrentDiscoverTab(value);
  };

  render() {
    const { tab } = this.props;

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
    </ShallowPageTemplate>;
  }
}

export default connector(DiscoverPage);
