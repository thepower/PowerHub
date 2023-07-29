import { WizardComponentProps } from 'common';
import i18n from 'locales/initTranslation';
import React from 'react';

export enum RegistrationTabs {
  quickGuide = 'quickGuide',
  beAware = 'beAware',
  loginRegister = 'loginRegister',
  backup = 'backup',
}

export enum LoginRegisterAccountTabs {
  create = 'create',
  login = 'login',
  import = 'import',
}

export const LoginRegisterAccountTabsLabels = {
  create: i18n.t('createNewAccount'),
  login: i18n.t('loginToAccount'),
  import: i18n.t('importYourAccount'),
} as const;

export const LoginRegisterAccountTabsLabelsShort = {
  create: i18n.t('create'),
  login: i18n.t('login'),
  import: i18n.t('import'),
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
