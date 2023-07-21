import {
  BuildIcon,
  ContributeIcon,
  DiscoverIcon,
  HomeIcon,
  MyPlaceIcon,
} from 'common/icons';
import React, { MouseEvent } from 'react';
import { NavLink } from 'react-router-dom';
import { isHub } from 'application/components/AppRoutes';
import { t } from 'i18next';
import { WalletRoutesEnum, HubRoutesEnum } from '../../application/typings/routes';
import styles from './NavList.module.scss';
import { setShowUnderConstruction } from '../../application/slice/applicationSlice';
import { closeAccountMenu } from '../../account/slice/accountSlice';
import { useAppDispatch } from '../../application/store';

const routes = isHub ? [
  {
    name: t('home'),
    link: HubRoutesEnum.root,
    Icon: HomeIcon,
    disabled: false,
  },
  {
    name: t('discover'),
    link: HubRoutesEnum.discover,
    Icon: DiscoverIcon,
    disabled: true,
  },
  {
    name: t('myPlace'),
    link: HubRoutesEnum.myPlace,
    Icon: MyPlaceIcon,
    disabled: true,
  },
  {
    name: t('build'),
    link: HubRoutesEnum.build,
    Icon: BuildIcon,
    disabled: true,
  },
  {
    name: t('contribute'),
    link: HubRoutesEnum.contribute,
    Icon: ContributeIcon,
    disabled: true,
  },
] : [
  {
    name: t('home'),
    link: WalletRoutesEnum.root,
    Icon: HomeIcon,
    disabled: false,
  },
];

const NavList = React.memo(() => {
  const dispatch = useAppDispatch();
  const handleShowUnderConstruction = React.useCallback((event: MouseEvent) => {
    event.preventDefault();
    dispatch(setShowUnderConstruction(true));
    dispatch(closeAccountMenu());
  }, [dispatch]);

  return <nav>
    <ul className={styles.list}>
      {routes.map(({
        disabled,
        Icon,
        link,
        name,
      }) => (
        <NavLink
          key={name}
          exact
          to={link}
          className={styles.link}
          activeClassName={styles.linkActive}
          onClick={disabled ? handleShowUnderConstruction : undefined}
        >
          <Icon className={styles.icon} />
          <span className={styles.text}>{name}</span>
        </NavLink>
      ))}
    </ul>
  </nav>;
});

export default NavList;
