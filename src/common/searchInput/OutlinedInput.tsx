import React from 'react';
import {
  FormControl,
  FormHelperText,
  OutlinedInput as MuiOutlinedInput,
  OutlinedInputProps as MuiOutlinedInputProps,
} from '@mui/material';
import styles from './OutlinedInput.module.scss';

export interface OutlinedInputProps extends MuiOutlinedInputProps {
  errorMessage?: string;
}

export const OutlinedInput: React.FC<OutlinedInputProps> = ({
  errorMessage, className, error, ...otherProps
}) => (
  <FormControl className={className}>
    <MuiOutlinedInput classes={styles} {...otherProps} />
    {error && <FormHelperText className={styles.errorMessage}>{errorMessage}</FormHelperText>}
  </FormControl>
);

export default OutlinedInput;
