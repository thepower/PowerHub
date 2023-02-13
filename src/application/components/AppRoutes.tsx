import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { FullScreenLoader } from 'common';
import { RegistrationPage } from 'registration/components/RegistrationPage';
import { LoginPage } from 'registration/components/pages/LoginPage';
import { checkIfLoading } from 'network/selectors';
import { DappsCard } from 'discover/components/dappsCard/DappsCard';
import { NftCollectionCard } from 'discover/components/nftCollectionCard/NftCollectionCard';
import { NftCard } from 'discover/components/nftCard/NftCard';
import { useAppDispatch, useAppSelector } from '../store';
import { RoutesEnum } from '../typings/routes';
import { initApplication } from '../slice/applicationSlice';
import Home from '../../home/components/Home';
import Discover from '../../discover/components/Discover';

const AppRoutesComponent: React.FC = () => {
  const dispatch = useAppDispatch();

  const networkApi = useAppSelector((state) => state.applicationData.networkApi);
  const walletApi = useAppSelector((state) => state.applicationData.walletApi);
  const loading = useAppSelector((state) => checkIfLoading(state, initApplication.type));

  useEffect(() => {
    dispatch(initApplication());
  }, [dispatch]);

  if (!walletApi || !networkApi || loading) {
    return (
      <FullScreenLoader />
    );
  }

  return (
    <Switch>
      <Route exact path={RoutesEnum.myPlace} />
      <Route path={`${RoutesEnum.discover}/dapps/:id`} component={DappsCard} />
      <Route path={`${RoutesEnum.discover}/nftCollection/:id`} component={NftCollectionCard} />
      <Route path={`${RoutesEnum.discover}/nft/:id`} component={NftCard} />
      <Route path={RoutesEnum.discover} component={Discover} />
      <Route exact path={RoutesEnum.build} />
      <Route exact path={RoutesEnum.contribute} />
      <Route path={RoutesEnum.signup} component={RegistrationPage} />
      <Route path={RoutesEnum.login} component={LoginPage} />
      <Route path={RoutesEnum.root} component={Home} />
    </Switch>
  );
};

export const AppRoutes = AppRoutesComponent;
