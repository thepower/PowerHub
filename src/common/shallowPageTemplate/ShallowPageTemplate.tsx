import React from 'react';
import { isHub } from 'application/components/AppRoutes';
import { useAppSelector } from 'application/store';
import { getRouterParamsAddress } from 'router/selectors';
import Button from 'common/button/Button';
import NavList from './NavList';
import { Account } from '../../account/components/Account';
import styles from './ShallowPageTemplate.module.scss';

const ShallowPageTemplate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const walletAddress = useAppSelector(getRouterParamsAddress);

  return (

    <div className={styles.template}>
      <aside className={styles.aside}>
        <header className={styles.header}>
          <p className={styles.logo}>{isHub ? 'Power Hub' : 'Power Wallet'}</p>
          {isHub && !walletAddress
            ? <Button variant="filled">Sign up</Button>
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
