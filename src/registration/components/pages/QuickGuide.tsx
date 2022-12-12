import React from 'react';
import { RegistrationBackground } from '../common/RegistrationBackground';
import { RegistrationStatement } from '../common/RegistrationStatement';
import { WizardComponentProps, Button } from '../../../common';
import styles from '../Registration.module.scss';

type QuickGuideProps = WizardComponentProps;

export const QuickGuide: React.FC<QuickGuideProps> = (props: QuickGuideProps) => (
  <>
    <RegistrationBackground>
      <div className={styles.registrationPageTitle}>{'What is Power Hub?'}</div>
      <RegistrationStatement
        title={'Discover DApps'}
        description={'Power Hub gives people around the world a safe and trusted place to discover dappsList that\n' +
          'are secured by blockchain with high standards of privacy and security'}
      />
      <RegistrationStatement
        title={'Build & Publish'}
        description={'Build Dapp where everything is in one place:  decentralized infrastructure\n' +
          'and services. Make developer’s life easier -  the real full-stack dappsList '}
      />
      <RegistrationStatement title={'Contribute'} description={'?????'} />
    </RegistrationBackground>
    <div className={styles.registrationButtonsHolder}>
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
