import React from 'react';
import {
  Tab,
  Box,
  Tabs as MUITabs,
  TabsProps as MUITabsProps,
} from '@mui/material';
import styles from './Tabs.module.scss';

interface TabsProps extends MUITabsProps {
  tabs: any;
  tabsLabels: any;
}

interface TabsState {}

export class Tabs extends React.PureComponent<TabsProps, TabsState> {
  boxSx = { borderBottom: 1, borderColor: 'divider' };

  tabClasses = {
    selected: styles.selectedTab,
  };

  tabsClasses = {
    root: styles.tabsRoot,
    flexContainer: styles.tabsFlexContainer,
  };

  renderTab = (key: string) => {
    const { tabs, tabsLabels } = this.props;
    const labels =  tabsLabels || tabs;

    return <Tab
      className={styles.tab}
      classes={this.tabClasses}
      label={labels[key as keyof typeof labels]}
      value={key}
      disableFocusRipple
      disableRipple
    />;
  };

  render() {
    const { value, onChange, tabs } = this.props;
    return <Box sx={this.boxSx}>
      <MUITabs
        value={value}
        onChange={onChange}
        classes={this.tabsClasses}
        // variant="scrollable"
        // scrollButtons="auto"
      >
        {Object.keys(tabs).map(this.renderTab)}
      </MUITabs>
    </Box>;
  }
}
