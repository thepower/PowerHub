import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { FullScreenLoader } from 'common';
import { RoutesEnum } from '../typings/routes';
import { initApplication } from '../slice/applicationSlice';
import Home from '../../home/components/Home';
import { RegistrationPage } from '../../registration/components/RegistrationPage';
import { LoginPage } from '../../registration/components/pages/LoginPage';
import { useAppDispatch, useAppSelector } from '../store';
import { checkIfLoading } from '../../network/selectors';

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
      <Route exact path={RoutesEnum.discover} />
      <Route exact path={RoutesEnum.myPlace} />
      <Route exact path={RoutesEnum.build} />
      <Route exact path={RoutesEnum.contribute} />
      <Route path={RoutesEnum.signup}>
        <RegistrationPage />
      </Route>
      <Route path={RoutesEnum.login}>
        <LoginPage />
      </Route>
      <Route path={RoutesEnum.root}>
        <Home />
      </Route>
    </Switch>
  );
};

export const AppRoutes = AppRoutesComponent;
