import React from 'react';
import cn from 'classnames';
import { t } from 'i18next';
import IconButton from '../iconButton/IconButton';
import { Account } from '../../account/components/Account';
import ArrowLink from '../arrowLink/ArrowLink';
import { BellIcon } from '../icons';
import { setShowUnderConstruction } from '../../application/slice/applicationSlice';
import styles from './TopBar.module.scss';
import { useAppDispatch } from '../../application/store';

type TopBarProps = {
  type: 'deep' | 'shallow';
  backUrl?: string;
  backUrlText?: string;
  children?: React.ReactNode;
  disableAccount?: boolean;
  className?: string;
};

const TopBar: React.FC<TopBarProps> = ({
  children,
  type,
  backUrl,
  backUrlText = t('back')!,
  disableAccount = false,
  className,
}) => {
  const dispatch = useAppDispatch();
  const handleShowUnderConstruction = React.useCallback(() => {
    dispatch(setShowUnderConstruction(true));
  }, [dispatch]);

  return <>
    <header className={cn(styles.bar, styles[type], className)}>
      {type === 'deep' && backUrl && (
        <ArrowLink
          to={backUrl}
          direction="left"
          hideTextOnMobile
          size="small"
          defaultColor="lilac"
        >
          {backUrlText}
        </ArrowLink>
      )}
      {type === 'shallow' && !disableAccount && (
        <div className={styles.accountHolder}>
          <Account />
        </div>
      )}
      {type === 'shallow' && children && (
        <div className={styles.childrenInsideBar}>
          {children}
        </div>
      )}
      {type === 'deep' && children && (
        <div className={styles.title}>
          {children}
        </div>
      )}
      <IconButton
        className={cn(!children && styles.bell)}
        onClick={handleShowUnderConstruction}
      >
        <BellIcon />
      </IconButton>
    </header>
    {type === 'shallow' && children && (
      <div className={styles.childrenOutsideBar}>
        {children}
      </div>
    )}
  </>;
};

export default TopBar;
