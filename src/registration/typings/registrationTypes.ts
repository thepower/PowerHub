import React from 'react';
import { WizardComponentProps } from 'common';

export enum RegistrationTabsEnum {
  quickGuide = 'Quick guide',
  beAware = 'Be aware',
  loginRegister = 'Login / Register',
  backup = 'Backup',
}

export enum LoginRegisterAccountTabs {
  create = 'create',
  login = 'login',
  import = 'import',
}

export enum LoginRegisterAccountTabsLabels {
  create = 'Create new account',
  login = 'Login to  account',
  import = 'Import your account',
}

export enum CreateAccountStepsEnum {
  selectSubChain = 'selectSubChain',
  setSeedPhrase = 'setSeedPhrase',
  confirmSeedPhrase = 'confirmSeedPhrase',
  encryptPrivateKey = 'encryptPrivateKey',
}

export type RegistrationPageAdditionalProps = {
  onChangeTab: (_event: React.SyntheticEvent, value: LoginRegisterAccountTabs) => void;
  tab: LoginRegisterAccountTabs;
} & WizardComponentProps;

export type SetSeedPhraseInput = {
  seedPhrase: string;
  nextStep: CreateAccountStepsEnum;
};

export type LoginToWalletInputType = {
  address: string;
  seed: string;
  password: string;
};
