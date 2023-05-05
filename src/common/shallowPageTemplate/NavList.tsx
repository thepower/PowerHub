import {
  BuildIcon,
  ContributeIcon,
  DiscoverIcon,
  HomeIcon,
  MyPlaceIcon,
} from 'common/icons';
import React, { MouseEvent } from 'react';
import { NavLink } from 'react-router-dom';
import { RoutesEnum } from '../../application/typings/routes';
import styles from './NavList.module.scss';
import { setShowUnderConstruction } from '../../application/slice/applicationSlice';
import { closeAccountMenu } from '../../account/slice/accountSlice';
import { useAppDispatch } from '../../application/store';

const routes = [
  {
    name: 'Home',
    link: RoutesEnum.root,
    Icon: HomeIcon,
    disabled: false,
  },
  {
    name: 'Discover',
    link: RoutesEnum.discover,
    Icon: DiscoverIcon,
    disabled: true,
  },
  {
    name: 'MyPlace',
    link: RoutesEnum.myPlace,
    Icon: MyPlaceIcon,
    disabled: true,
  },
  {
    name: 'Build',
    link: RoutesEnum.build,
    Icon: BuildIcon,
    disabled: true,
  },
  {
    name: 'Contribute',
    link: RoutesEnum.contribute,
    Icon: ContributeIcon,
    disabled: true,
  },
];

export const NavList = React.memo(() => {
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
