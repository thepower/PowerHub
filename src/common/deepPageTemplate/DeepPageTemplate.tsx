import React, { PropsWithChildren } from 'react';
import { t } from 'i18next';
import styles from './DeepPageTemplate.module.scss';
import { TopBar } from '../index';

interface DeepPageTemplateProps {
  topBarTitle: string;
  backUrl: string;
  backUrlText?: string;
}

const DeepPageTemplate: React.FC<PropsWithChildren<DeepPageTemplateProps>> = ({
  children,
  topBarTitle,
  backUrl,
  backUrlText = t('back')!,
}) => (
  <div className={styles.template}>
    <TopBar type="deep" backUrl={backUrl} backUrlText={backUrlText}>
      {topBarTitle}
    </TopBar>
    {children}
  </div>
);

export default DeepPageTemplate;
