import React, { useEffect } from 'react';
import { FullScreenLoader, ShallowPageTemplate, TopBar } from 'common';

import { useAppDispatch, useAppSelector } from 'application/store';
import { loadBalanceTrigger } from 'myAssets/slices/walletSlice';
import { checkIfLoading } from 'network/selectors';

import AssetsSection from './AssetsSection';
import styles from './HubHome.module.scss';

const HubHome = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => checkIfLoading(state, loadBalanceTrigger.type));

  useEffect(() => {
    dispatch(loadBalanceTrigger());
  }, [dispatch]);

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <ShallowPageTemplate>
      <TopBar type="shallow" />
      <div className={styles.content}>
        <AssetsSection />
      </div>
    </ShallowPageTemplate>
  );
};

export default HubHome;
