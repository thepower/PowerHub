import { RootState } from 'application/store';
import { createMatchSelector } from 'connected-react-router';

export const getRouterParamsAddress = (state: RootState) => {
  const matchSelector = createMatchSelector<RootState, { address: string }>({ path: '/:address' });
  const match = matchSelector(state);
  const address = match?.params?.address;

  return address;
};
