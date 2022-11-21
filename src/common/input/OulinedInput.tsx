import React from 'react';
import {
  FormControl, FormHelperText,
  OutlinedInput as MUIOutlinedInput,
  OutlinedInputProps as MUIOutlinedInputProps,
} from '@mui/material';
import classnames from 'classnames';
import { ClosedEyeIcon } from '../icons/ClosedEyeIcon';
import { EyeIcon } from '../icons/EyeIcon';
import styles from './Input.module.scss';

interface OutlinedInputProps extends MUIOutlinedInputProps {
  errorMessage?: string;
}

interface OutlinedInputState {
  showPassword: boolean;
}

export class OutlinedInput extends React.PureComponent<OutlinedInputProps, OutlinedInputState> {
  constructor(props: OutlinedInputProps) {
    super(props);
    this.state = {
      showPassword: false,
    };
  }

  toggleShowPassword = () => {
    const { showPassword } = this.state;

    this.setState({ showPassword: !showPassword });
  };

  getEndAdornment = () => {
    const { type } = this.props;
    const { showPassword } = this.state;

    if (type === 'password') {
      return <div
        className={styles.passwordAdornment}
        onClick={this.toggleShowPassword}
      >
        { showPassword ? <ClosedEyeIcon /> : <EyeIcon /> }
      </div>;
    }

    return null;
  };

  getInputType = (type: string) => {
    const { showPassword } = this.state;

    if (type === 'password') {
      return showPassword ? 'text' : 'password';
    }

    return type;
  };

  render() {
    const {
      errorMessage,
      className,
      onChange,
      type,
      value,
      error,
      placeholder,
      ...otherProps
    } = this.props;

    return <FormControl className={styles.formControl}>
      <MUIOutlinedInput
        placeholder={placeholder}
        className={classnames(className)}
        value={value}
        onChange={onChange}
        type={this.getInputType(type!)}
        classes={{
          notchedOutline: value ? styles.bordered : '',
        }}
        endAdornment={this.getEndAdornment()}
        {...otherProps}
      />
      {
        error &&
        <FormHelperText className={styles.errorMessage}>
          {errorMessage}
        </FormHelperText>
      }
    </FormControl>;
  }
}
