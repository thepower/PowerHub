import cn from 'classnames';
import React from 'react';
import i18n from 'locales/initTranslation';
import { Account } from '../../account/components/Account';
import { setShowUnderConstruction } from '../../application/slice/applicationSlice';
import { useAppDispatch } from '../../application/store';
import ArrowLink from '../arrowLink/ArrowLink';
import IconButton from '../iconButton/IconButton';
import { BellIcon } from '../icons';
import { LangSelect } from '../langSelect/LangSelect';
import styles from './TopBar.module.scss';

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
  backUrlText = i18n.t('back')!,
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
      <div className={cn(styles.controlsSet, !children && styles.mlA)}>
        <LangSelect
          className={cn(!children && styles.lang)}
        />
        <IconButton
          onClick={handleShowUnderConstruction}
        >
          <BellIcon />
        </IconButton>
      </div>
    </header>
    {type === 'shallow' && children && (
      <div className={styles.childrenOutsideBar}>
        {children}
      </div>
    )}
  </>;
};

export default TopBar;
