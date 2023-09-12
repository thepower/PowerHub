import React from 'react';
import { isHub } from 'application/components/AppRoutes';
import { useAppSelector } from 'application/store';
import Button from 'common/button/Button';
import { WalletRoutesEnum } from 'application/typings/routes';
import { objectToString } from 'sso/utils';
import { getWalletAddress } from 'account/selectors/accountSelectors';
import { useTranslation } from 'react-i18next';
import appEnvs from 'appEnvs';
import NavList from './NavList';
import { Account } from '../../account/components/Account';
import styles from './ShallowPageTemplate.module.scss';

const ShallowPageTemplate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const walletAddress = useAppSelector(getWalletAddress);

  const onClickSignUp = () => {
    const stringData = objectToString({ callbackUrl: `${window.location.href}` });
    window.location.replace(`${appEnvs.WALLET_THEPOWER_URL}${WalletRoutesEnum.sso}/${stringData}`);
  };

  return (

    <div className={styles.template}>
      <aside className={styles.aside}>
        <header className={styles.header}>
          <p className={styles.logo}>{isHub ? 'Power Hub' : 'Power Wallet'}</p>
          {isHub && !walletAddress
            ? <Button onClick={onClickSignUp} variant="filled">{t('signUp')}</Button>
            : <Account />}
        </header>
        <NavList />
      </aside>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default ShallowPageTemplate;
