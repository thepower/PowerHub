import React, { useEffect } from 'react';
import { FullScreenLoader, ShallowPageTemplate, TopBar } from 'common';
import { Route, Switch } from 'react-router-dom';
import { AddAssetsPage } from 'myAssets/pages/AddAssets/AddAssetsPage';
import { AssetTransactionsPage } from 'myAssets/pages/AssetTransactions/AssetTransactionsPage';
import { AssetSelectionPage } from 'myAssets/pages/AssetSelection/AssetSelectionPage';
import SignAndSendPage from 'sign-and-send/components/SingAndSendPage';
import { useAppDispatch, useAppSelector } from 'application/store';
import { loadBalanceTrigger } from 'myAssets/slices/walletSlice';
import { checkIfLoading } from 'network/selectors';
import { RoutesEnum } from 'application/typings/routes';
import Send from 'send/components/Send';
import AssetsSection from './AssetsSection';
import MyAssets from '../../myAssets/components/MyAssets';
import styles from './Home.module.scss';

const Home = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => checkIfLoading(state, loadBalanceTrigger.type));

  useEffect(() => {
    dispatch(loadBalanceTrigger());
  }, [dispatch]);

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <Switch>
      <Route path={`${RoutesEnum.myAssets}/:type/:address${RoutesEnum.send}`} component={Send} />
      <Route path={`${RoutesEnum.myAssets}${RoutesEnum.add}`}>
        <AddAssetsPage />
      </Route>
      <Route
        path={`${RoutesEnum.myAssets}/:type/:address${RoutesEnum.transactions}`}
        component={AssetTransactionsPage}
      />
      <Route
        path={`${RoutesEnum.myAssets}${RoutesEnum.assetSelection}`}
        component={AssetSelectionPage}
      />
      <Route path={`${RoutesEnum.myAssets}${RoutesEnum.signAndSend}/:txBody`} component={SignAndSendPage} />
      <Route path={RoutesEnum.myAssets}>
        <MyAssets />
      </Route>
      <Route path={RoutesEnum.root}>
        <ShallowPageTemplate>
          <TopBar type="shallow" />
          <div className={styles.content}>
            <AssetsSection />
          </div>
        </ShallowPageTemplate>
      </Route>
    </Switch>
  );
};

export default Home;
