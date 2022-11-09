import React from 'react';
import cn from 'classnames';
import { Link, LinkProps } from 'react-router-dom';
import styles from './ArrowLink.module.scss';
import { ChevronLeftIcon } from '../icons';

interface LinkButtonProps extends LinkProps {
  hideTextOnMobile?: boolean;
  defaultColor?: 'white' | 'lilac';
  size?: 'small' | 'medium' | 'large';
  direction: 'left' | 'right';
  children: React.ReactNode;
}

const ArrowLink: React.FC<LinkButtonProps> = ({
  direction,
  children,
  size = 'medium',
  defaultColor = 'white',
  hideTextOnMobile = false,
  ...linkProps
}) => (
  <Link
    {...linkProps}
    className={cn(styles.button, styles[defaultColor], hideTextOnMobile && styles.hideTextOnMobile)}
  >
    {direction === 'left' && <ChevronLeftIcon />}
    <span className={cn(styles.text, styles[size])}>
      {children}
    </span>
    {direction === 'right' && <ChevronLeftIcon className={styles.rotate} />}
  </Link>
);

export default ArrowLink;
