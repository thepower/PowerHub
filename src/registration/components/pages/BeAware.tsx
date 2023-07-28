import { Button, WizardComponentProps } from 'common';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../Registration.module.scss';
import { RegistrationBackground } from '../common/RegistrationBackground';
import { RegistrationStatement } from '../common/RegistrationStatement';

type BeAwareProps = WizardComponentProps;

export const BeAware: React.FC<BeAwareProps> = (props: BeAwareProps) => {
  const { t } = useTranslation();
  return (
    <>
      <RegistrationBackground>
        <div className={styles.registrationPageTitle}>{t('importantRules')}</div>
        <RegistrationStatement title={t('beResponsible')!} description={t('onlyYouAreResponsible')} />
        <RegistrationStatement title={t('doNotShare')!} description={t('IfYouSendYourSeedPhrase')} />
        <RegistrationStatement title={t('makeBackup')!} description={t('weDontKeepTrack')} />
        <RegistrationStatement
          title={t('onlyYouHaveAccess')!}
          description={t('weNeverTransmit')}
        />
      </RegistrationBackground>
      <div className={styles.registrationButtonsHolder}>
        <Button
          size="medium"
          variant="outlined"
          type="button"
          onClick={props.setPrevStep}
        >
          {t('back')}
        </Button>
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
