import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, WizardComponentProps } from '../../../common';
import styles from '../Registration.module.scss';
import { RegistrationBackground } from '../common/RegistrationBackground';
import { RegistrationStatement } from '../common/RegistrationStatement';

type QuickGuideProps = WizardComponentProps;

export const QuickGuide: React.FC<QuickGuideProps> = (props: QuickGuideProps) => {
  const { t } = useTranslation();
  return (
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
};
