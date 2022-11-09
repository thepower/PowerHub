import React from 'react';
import styles from './FullScreenLoader.module.scss';
import { Loader } from './Loader';

const FullScreenLoader = () => (
  <div className={styles.loader}>
    <Loader />
  </div>
);

export default FullScreenLoader;
