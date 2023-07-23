import React from 'react';
import {
  Tab, Box, Tabs as MUITabs, TabsProps as MUITabsProps,
} from '@mui/material';
import classnames from 'classnames';
import { t } from 'i18next';
import styles from './Tabs.module.scss';

interface TabsProps extends MUITabsProps {
  tabs: any;
  tabsLabels: any;
  tabsRootClassName?: string;
  tabsHolderClassName?: string;
  tabClassName?: string;
  tabIndicatorClassName?: string;
  tabSelectedClassName?: string;
}

export class Tabs extends React.PureComponent<TabsProps> {
  boxSx = { borderBottom: 1, borderColor: 'divider' };

  getTabClasses = () => {
    const { tabSelectedClassName } = this.props;

    return {
      selected: classnames(styles.selectedTab, tabSelectedClassName),
    };
  };

  getTabsClasses = () => {
    const { tabsRootClassName, tabIndicatorClassName } = this.props;
    return {
      root: classnames(styles.tabsRoot, tabsRootClassName),
      flexContainer: styles.tabsFlexContainer,
      indicator: classnames(styles.tabsIndicator, tabIndicatorClassName),
    };
  };

  renderTab = (key: string) => {
    const { tabs, tabsLabels, tabClassName } = this.props;
    const labels = tabsLabels || tabs;

    return (
      <Tab
        key={key}
        className={classnames(styles.tab, tabClassName)}
        classes={this.getTabClasses()}
        label={t(labels[key])}
        value={key}
        disableFocusRipple
        disableRipple
        wrapped
      />
    );
  };

  render() {
    const {
      value, onChange, tabs, tabsHolderClassName,
    } = this.props;

    return (
      <Box className={classnames(styles.tabsHolder, tabsHolderClassName)} sx={this.boxSx}>
        <MUITabs value={value} onChange={onChange} classes={this.getTabsClasses()}>
          {Object.keys(tabs).map(this.renderTab)}
        </MUITabs>
      </Box>
    );
  }
}
