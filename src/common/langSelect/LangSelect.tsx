import React, { FC, useCallback } from 'react';
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

import { useTranslation } from 'react-i18next';
import { buildYupLocale, langsKeys } from 'locales/initTranslation';
import styles from './LangSelect.module.scss';

type SelectProps = MuiSelectProps;

const selectClasses: Partial<SelectClasses> = {
  select: styles.select,
  icon: styles.selectIcon,
};

const inputBaseClasses: Partial<InputBaseClasses> = {
  root: styles.inputBaseRoot,
  input: styles.inputBaseInput,
  focused: styles.inputBaseFocused,
};

const menuClasses: Partial<MenuClasses> = { list: styles.menuList, paper: styles.menuPaper, root: styles.menuRoot };

const menuItemClasses: Partial<MenuItemClasses> = { selected: styles.menuItemSelected, root: styles.menuItemRoot };

export const LangSelect:FC<SelectProps> = ({
  className, value, onChange, ...otherProps
}) => {
  const { t, i18n } = useTranslation();
  const changeLanguage = useCallback(
    (newLng: string): void => {
      if (i18n.isInitialized && i18n.language !== newLng) {
        i18n.changeLanguage(newLng);

        buildYupLocale(null, t);
      }
    },
    [t, i18n],
  );
  return (
    <MuiSelect
      className={className}
      variant="standard"
      input={<InputBase classes={inputBaseClasses} />}
      classes={selectClasses}
      MenuProps={{
        classes: menuClasses,
        disableScrollLock: true,
        anchorOrigin: {
          vertical: 56,
          horizontal: 'center',
        },
      }}
      inputProps={{ IconComponent: () => null }}
      value={i18n.language}
      onChange={(props) => {
        changeLanguage((props.target.value as string));
      }}
      {...otherProps}
    >
      {langsKeys.map((rowsPerPageOption) => (
        <MenuItem disableRipple key={rowsPerPageOption} value={rowsPerPageOption} classes={menuItemClasses}>
          {rowsPerPageOption}
        </MenuItem>
      ))}
    </MuiSelect>
  );
};
