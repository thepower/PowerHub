import React, { FC } from 'react';
import {
  Select as MuiSelect,
  SelectProps as MuiSelectProps,
  MenuItem,
  InputBase,
  SelectClasses,
  InputBaseClasses,
  MenuClasses,
  MenuItemClasses,
} from '@mui/material';

import styles from './LangSelect.module.scss';

interface SelectProps extends MuiSelectProps {
  items: string[];
}

const selectClasses: Partial<SelectClasses> = {
  select: styles.select,
  icon: styles.selectIcon,
};

const inputBaseClasses: Partial<InputBaseClasses> = {
  root: styles.inputBaseRoot,
  input: styles.inputBaseInput,
  focused: styles.inputBaseFocused,
};

const menuClasses: Partial<MenuClasses> = { list: styles.menuList, paper: styles.menuPaper };

const menuItemClasses: Partial<MenuItemClasses> = { selected: styles.menuItemSelected, root: styles.menuItemRoot };

export const LangSelect:FC<SelectProps> = ({
  className, value, items, onChange, ...otherProps
}) => (
  <MuiSelect
    className={className}
    variant="standard"
    input={<InputBase classes={inputBaseClasses} />}
    classes={selectClasses}
    MenuProps={{
      classes: menuClasses,
      disableScrollLock: true,
      anchorOrigin: {
        vertical: 64,
        horizontal: 'center',
      },
    }}
    inputProps={{ IconComponent: () => null }}
    value={value}
    onChange={onChange}
    {...otherProps}
  >
    {items.map((rowsPerPageOption) => (
      <MenuItem disableRipple key={rowsPerPageOption} value={rowsPerPageOption} classes={menuItemClasses}>
        {rowsPerPageOption}
      </MenuItem>
    ))}
  </MuiSelect>
);
