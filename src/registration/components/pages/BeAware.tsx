import React from 'react';
import { WizardComponentProps, Button } from 'common';
import { RegistrationBackground } from '../common/RegistrationBackground';
import { RegistrationStatement } from '../common/RegistrationStatement';
import styles from '../Registration.module.scss';

type BeAwareProps = WizardComponentProps;

export const BeAware: React.FC<BeAwareProps> = (props: BeAwareProps) => (
  <>
    <RegistrationBackground>
      <div className={styles.registrationPageTitle}>{'Important rules!'}</div>
      <RegistrationStatement title={'Be responsible'} description={'Only you are responsible for your security. We’ll not refund your tokens if your keys get stolen'} />
      <RegistrationStatement title={'Do not share'} description={'If you send your seed phrase to someone = they have full control of your account'} />
      <RegistrationStatement title={'Make a backup'} description={'We don’t keep track of your personal information, seed phrases and funds'} />
      <RegistrationStatement
        title={'Only you have access'}
        description={'We never transmit or store your seed phrases or other account information\n' +
          'We can’t restore it or freeze it'}
      />
    </RegistrationBackground>
    <div className={styles.registrationButtonsHolder}>
      <Button
        size="medium"
        variant="outlined"
        type="button"
        onClick={props.setPrevStep}
      >
        {'Back'}
      </Button>
      <Button
        size="medium"
        variant="filled"
        type="button"
        onClick={props.setNextStep}
      >
        {'Next'}
      </Button>
    </div>
  </>
);
