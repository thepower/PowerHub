import React from 'react';

// import cn from 'classnames';
import { Button, ButtonProps } from '@mui/material';

import styles from './AddButton.module.scss';

type AddButtonProps = ButtonProps;

class AddButton extends React.PureComponent<AddButtonProps> {
  render() {
    const { children, ...props } = this.props;
    return (
      <Button {...props} size="small" classes={styles}>{children}</Button>
    );
  }
}

export default AddButton;
