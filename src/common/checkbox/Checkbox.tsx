import React from 'react';
import { Checkbox as MUICheckbox, CheckboxProps as MUICheckboxProps } from '@mui/material';
import { CheckedIcon, UnCheckedIcon } from '../icons';

type CheckboxProps = MUICheckboxProps;

export const Checkbox: React.FC<CheckboxProps> = (props) => (
  <MUICheckbox
    checkedIcon={<CheckedIcon />}
    icon={<UnCheckedIcon />}
    {...props}
  />
);
