import { RootState } from 'application/store';
import { WalletRoutesEnum } from 'application/typings/routes';
import { createMatchSelector } from 'connected-react-router';

export const getRouterParamsAddress = (state: RootState) => {
  const matchSelector = createMatchSelector<RootState, { address: string }>({ path: '/:address' });
  const match = matchSelector(state);
  const address = match?.params?.address;

  return address;
};

export const getRouterParamsData = (state: RootState) => {
  const matchSelector =
    createMatchSelector<RootState, { data: string }>({ path: `${WalletRoutesEnum.registrationForApps}/:data` });
  const match = matchSelector(state);
  const data = match?.params?.data;

  return data;
};
