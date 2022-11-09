import React, { PropsWithChildren } from 'react';
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
  backUrlText = 'Back',
}) => (
  <div className={styles.template}>
    <TopBar type="deep" backUrl={backUrl} backUrlText={backUrlText}>
      {topBarTitle}
    </TopBar>
    {children}
  </div>
);

export default DeepPageTemplate;
