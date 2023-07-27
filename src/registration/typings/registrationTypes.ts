import React from 'react';
import { WizardComponentProps } from 'common';

export enum RegistrationTabs {
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

export const LoginRegisterAccountTabsLabels = {
  create: 'createNewAccount',
  login: 'loginToAccount',
  import: 'importYourAccount',
} as const;

export const LoginRegisterAccountTabsLabelsShort = {
  create: 'create',
  login: 'login',
  import: 'import',
} as const;

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
