import React from 'react';
import { Button } from '@mui/material';
import { RegistrationBackground } from '../common/RegistrationBackground';
import { RegistrationStatement } from '../common/RegistrationStatement';
import { WizardComponentProps } from '../../../common';
import styles from '../Registration.module.scss';

type QuickGuideProps = WizardComponentProps;

export const QuickGuide: React.FC<QuickGuideProps> = (props: QuickGuideProps) => (
  <>
    <RegistrationBackground>
      <div className={styles.registrationPageTitle}>{'What is Power Hub?'}</div>
      <RegistrationStatement
        title={'Discover DApps'}
        description={'Power Hub gives people around the world a safe and trusted place to discover dapps that\n' +
          'are secured by blockchain with high standards of privacy and security'}
      />
      <RegistrationStatement
        title={'Build & Publish'}
        description={'Build Dapp where everything is in one place:  decentralized infrastructure\n' +
          'and services. Make developer’s life easier -  the real full-stack dapps '}
      />
      <RegistrationStatement title={'Contribute'} description={'?????'} />
    </RegistrationBackground>
    <div className={styles.registrationButtonsHolder}>
      <Button
        className={styles.registrationNextButton}
        variant="contained"
        size="large"
        onClick={props.setNextStep}
      >
        {'Next'}
      </Button>
    </div>
  </>
);
