import React from 'react';
import classnames from 'classnames';
import styles from './Loader.module.scss';

export const Loader = () => (
  <div className={styles.loader}>
    <div className={classnames(styles.inner, styles.one)} />
    <div className={classnames(styles.inner, styles.two)} />
    <div className={classnames(styles.inner, styles.three)} />
  </div>
);
