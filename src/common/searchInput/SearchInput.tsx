import React from 'react';

import { SearchIcon } from 'common/icons';
import styles from './SearchInput.module.scss';
import MUIOutlinedInput, { OutlinedInputProps } from './OutlinedInput';

interface SearchInputProps extends OutlinedInputProps {
  className?: string;
  errorMessage?: string;
  onClickSearch: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ onClickSearch, className, ...otherProps }) => {
  const getEndAdornment = () => (
    <div className={styles.endAdornment} onClick={onClickSearch}>
      <SearchIcon />
    </div>
  );
  return (
    <MUIOutlinedInput
      className={className}
      placeholder={'searchAnyNameOrAttribute'}
      size="small"
      fullWidth
      autoComplete={'off'}
      endAdornment={getEndAdornment()}
      {...otherProps}
    />
  );
};

export default SearchInput;
