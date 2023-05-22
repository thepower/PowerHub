import React, { useEffect } from 'react';
import { FullScreenLoader, ShallowPageTemplate, TopBar } from 'common';

import { useAppDispatch, useAppSelector } from 'application/store';
import { loadBalanceTrigger } from 'myAssets/slices/walletSlice';
import { checkIfLoading } from 'network/selectors';

import { getWalletAddress } from 'account/selectors/accountSelectors';
import AssetsSection from '../AssetsSection';
import styles from './HubHome.module.scss';

export const HubHome = () => {
  const dispatch = useAppDispatch();
  const walletAddress = useAppSelector(getWalletAddress);
  const loading = useAppSelector((state) => checkIfLoading(state, loadBalanceTrigger.type));

  useEffect(() => {
    if (walletAddress) dispatch(loadBalanceTrigger());
  }, [dispatch, walletAddress]);

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
