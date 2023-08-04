import { WizardComponentProps } from 'common';
import i18n from 'locales/initTranslation';
import React from 'react';

const { t } = i18n;

// i18next keys
export const getRegistrationTabs = () => ({
  quickGuide: t('quickGuide'),
  beAware: t('beAware'),
  loginRegister: t('loginRegister'),
  backup: t('backup'),
} as const);

export enum LoginRegisterAccountTabs {
  create = 'create',
  login = 'login',
  import = 'import',
}

// i18next keys
export const getLoginRegisterAccountTabsLabels = () => ({
  create: t('createNewAccount'),
  login: t('loginToAccount'),
  import: t('importYourAccount'),
} as const);

// i18next keys
export const getLoginRegisterAccountTabsLabelsShort = () => ({
  create: t('create'),
  login: t('login'),
  import: t('import'),
} as const);

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
