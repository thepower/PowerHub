import React from 'react';
import {
  Switch as MUISwitch, SwitchProps as MUISwitchProps,
} from '@mui/material';

import styles from './Switch.module.scss';

type TabsProps = MUISwitchProps;

export class Switch extends React.PureComponent<TabsProps> {
  render() {
    const { ...otherProps } = this.props;
    return (
      <MUISwitch
        disableRipple
        disableFocusRipple
        disableTouchRipple
        classes={styles}
        {...otherProps}
      />
    );
  }
}
