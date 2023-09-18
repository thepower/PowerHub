import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { FullScreenLoader } from 'common';
import { RegistrationPage } from 'registration/components/RegistrationPage';
import { LoginPage } from 'registration/components/pages/LoginPage';
import { checkIfLoading } from 'network/selectors';
import { DappsCard } from 'discover/components/dappsCard/DappsCard';
import { NftCollectionCard } from 'discover/components/nftCollectionCard/NftCollectionCard';
import { NftCard } from 'discover/components/nftCard/NftCard';
import { AddAssetsPage } from 'myAssets/pages/AddAssets/AddAssetsPage';
import { AssetTransactionsPage } from 'myAssets/pages/AssetTransactions/AssetTransactionsPage';
import { AssetSelectionPage } from 'myAssets/pages/AssetSelection/AssetSelectionPage';
import MyAssets from 'myAssets/components/MyAssets';
import Send from 'send/components/Send';
import { WalletHome } from 'home/components/pages/WalletHome';
import { HubHome } from 'home/components/pages/HubHome';

import Discover from 'discover/components/Discover';
import SignAndSendPage from 'sign-and-send/components/SingAndSendPage';
import WalletSSOPage from 'sso/components/pages/WalletSSOPage';
import HubSSOPage from 'sso/components/pages/HubSSOPage';
import { RegistrationForAppsPage } from 'registration/components/RegistrationForAppsPage';
import appEnvs from 'appEnvs';
import { objectToString, stringToObject } from 'sso/utils';
import { signAndSendTrxTrigger } from 'send/slices/sendSlice';
import { AddressApi, CryptoApi, TransactionsApi } from '@thepowereco/tssdk';
import { TxBody, TxPurpose } from 'sign-and-send/typing';
import { getNetworkFeeSettings } from 'application/selectors';
import { getWalletAddress, getWalletData } from 'account/selectors/accountSelectors';
import { getKeyFromApplicationStorage } from 'application/utils/localStorageUtils';

import { useAppDispatch, useAppSelector } from '../store';
import { WalletRoutesEnum, HubRoutesEnum } from '../typings/routes';
import { initApplication } from '../slice/applicationSlice';

const { autoAddFee, autoAddGas } = TransactionsApi;

export const localApp: any = process.env.REACT_APP_TYPE;

export const [subdomain1, subdomain2] = window.location.hostname.split('.');
export const isLocalHost = [subdomain1, subdomain2].includes('localhost');
export const isWallet = (localApp === 'wallet' && isLocalHost) || [subdomain1, subdomain2].includes('wallet');
export const isHub = (localApp === 'hub' && isLocalHost) || [subdomain1, subdomain2].includes('hub');

const IFrame: React.FC = () => {
  const dispatch = useAppDispatch();
  const feeSettings = useAppSelector(getNetworkFeeSettings);
  const gasSettings = useAppSelector(getNetworkFeeSettings);
  const walletAddress = useAppSelector(getWalletAddress);
  const walletData = useAppSelector(getWalletData);

  const handler = async (ev: MessageEvent<any>) => {
    try {
      if (ev.origin !== appEnvs.DIRECT_HELP_THEPOWER_URL) return;
      const message = stringToObject(ev.data);

      if (message?.type === 'signAndSendMessage') {
        const allowedAutoSignTxContractsAddresses: string[] | null = await getKeyFromApplicationStorage('allowedAutoSignTxContractsAddresses');
        if (!allowedAutoSignTxContractsAddresses?.includes(message?.data?.address)) {
          window.parent.postMessage?.(
            objectToString({
              type: 'signAndSendMessageError',
              data: 'allowedAutoSignTxContractsAddresses !== message?.data?.address',
            }),
            appEnvs.DIRECT_HELP_THEPOWER_URL,
          );
          return;
        }

        let decodedTxBody: TxBody = message.data.body;

        const sponsor = message.data?.sponsor;
        const date = Date.now();
        const srcFee = decodedTxBody?.p?.find((purpose) => purpose?.[0] === TxPurpose.SRCFEE);
        const gas = decodedTxBody?.p?.find((purpose) => purpose?.[0] === TxPurpose.GAS);

        if (!decodedTxBody?.e) {
          decodedTxBody.e = {};
        }

        decodedTxBody.f = Buffer.from(AddressApi.parseTextAddress(walletAddress));
        decodedTxBody.s = date;
        decodedTxBody.t = date;

        if (sponsor) {
          decodedTxBody.e.sponsor = [Buffer.from(AddressApi.parseTextAddress(sponsor))];
        }

        if (!gas) {
          decodedTxBody = autoAddGas(decodedTxBody, gasSettings);
        }

        if (!srcFee) {
          decodedTxBody = autoAddFee(decodedTxBody, feeSettings);
        }

        if (sponsor) {
          decodedTxBody.p.forEach((item) => {
            if (item[0] === TxPurpose.SRCFEE) {
              item[0] = TxPurpose.SPONSOR_SRCFEE;
            }
            if (item[0] === TxPurpose.GAS) {
              item[0] = TxPurpose.SPONSOR_GAS;
            }
          });
        }

        const decryptedWif = CryptoApi.decryptWif(walletData.wif, '');

        dispatch(signAndSendTrxTrigger({
          decodedTxBody,
          wif: decryptedWif,
          additionalActionOnSuccess: (txResponse) => {
            window.parent.postMessage?.(
              objectToString({
                type: 'signAndSendMessageResponse',
                data: txResponse,
              }),
              appEnvs.DIRECT_HELP_THEPOWER_URL,
            );
          },
          additionalActionOnError(error) {
            window.parent.postMessage?.(
              objectToString({
                type: 'signAndSendMessageError',
                data: error,
              }),
              appEnvs.DIRECT_HELP_THEPOWER_URL,
            );
          },
        }));
      }
    } catch (error: any) {
      window.parent.postMessage?.(
        objectToString({
          type: 'signAndSendMessageError',
          data: error,
        }),
        appEnvs.DIRECT_HELP_THEPOWER_URL,
      );
    }
  };
  useEffect(() => {
    window.addEventListener('message', handler);
    return () => {
      window.removeEventListener('message', handler);
    };
  }, []);

  return (
    null
  );
};

const renderWalletRoutes = () => (
  <>
    <Route exact path={WalletRoutesEnum.signup} component={RegistrationPage} />
    <Route exact path={`${WalletRoutesEnum.registrationForApps}/:data`} component={RegistrationForAppsPage} />
    <Route exact path={WalletRoutesEnum.login} component={LoginPage} />
    <Route path={`${WalletRoutesEnum.myAssets}/:type/:address${WalletRoutesEnum.send}`} component={Send} />
    <Route exact path={`${WalletRoutesEnum.myAssets}${WalletRoutesEnum.add}`}>
      <AddAssetsPage />
    </Route>
    <Route
      path={`${WalletRoutesEnum.myAssets}/:type/:address${WalletRoutesEnum.transactions}`}
      component={AssetTransactionsPage}
    />
    <Route
      path={`${WalletRoutesEnum.myAssets}${WalletRoutesEnum.assetSelection}`}
      component={AssetSelectionPage}
      exact
    />
    <Route path={`${WalletRoutesEnum.myAssets}${WalletRoutesEnum.signAndSend}/:message`} component={SignAndSendPage} />
    <Route exact path={WalletRoutesEnum.myAssets}>
      <MyAssets />
    </Route>
    <Route path={`${WalletRoutesEnum.sso}/:data`} component={WalletSSOPage} />
    <Route path={WalletRoutesEnum.iframe} component={IFrame} />

    <Route exact path={WalletRoutesEnum.root} component={WalletHome} />
  </>
);

const renderHubRoutes = () => (
  <>
    <Route exact path={HubRoutesEnum.myPlace} />
    <Route path={`${HubRoutesEnum.discover}/dapps/:id`} component={DappsCard} />
    <Route path={`${HubRoutesEnum.discover}/nftCollection/:id`} component={NftCollectionCard} />
    <Route path={`${HubRoutesEnum.discover}/nft/:id`} component={NftCard} />
    <Route exact path={HubRoutesEnum.discover} component={Discover} />
    <Route exact path={HubRoutesEnum.build} />
    <Route exact path={HubRoutesEnum.contribute} />
    <Route path={`${HubRoutesEnum.sso}/:data`} component={HubSSOPage} />
    <Route
      path={`${WalletRoutesEnum.myAssets}/:type/:address${WalletRoutesEnum.transactions}`}
      component={AssetTransactionsPage}
    />
    <Route exact path={`${WalletRoutesEnum.myAssets}${WalletRoutesEnum.add}`}>
      <AddAssetsPage />
    </Route>
    <Route exact path={WalletRoutesEnum.myAssets}>
      <MyAssets />
    </Route>
    <Route exact path={HubRoutesEnum.root} component={HubHome} />
  </>
);

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
      {isWallet && renderWalletRoutes()}
      {isHub && renderHubRoutes()}
    </Switch>
  );
};

export const AppRoutes = AppRoutesComponent;
