import React from 'react';
import { t } from 'i18next';
import { RegistrationBackground } from '../common/RegistrationBackground';
import { RegistrationStatement } from '../common/RegistrationStatement';
import { WizardComponentProps, Button } from '../../../common';
import styles from '../Registration.module.scss';

type QuickGuideProps = WizardComponentProps;

export const QuickGuide: React.FC<QuickGuideProps> = (props: QuickGuideProps) => (
  <>
    <RegistrationBackground>
      <div className={styles.registrationPageTitle}>{t('whatIsPowerHub')}</div>
      <RegistrationStatement
        title={t('discoverDApps')!}
        description={t('powerHubGivesPeople')}
      />
      <RegistrationStatement
        title={t('buildPublish')!}
        description={t('buildDappWhereEverything')}
      />
      <RegistrationStatement
        title={t('contribute')!}
        description={t('communityInputIsValuable')}
      />
    </RegistrationBackground>
    <div className={styles.registrationButtonsHolder}>
      <Button
        size="medium"
        variant="filled"
        type="button"
        onClick={props.setNextStep}
      >
        {t('next')}
      </Button>
    </div>
  </>
);
