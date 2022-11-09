import React from 'react';
import cn from 'classnames';
import styles from './Divider.module.scss';

const Divider: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn(styles.divider, className)} />
);

export default Divider;
