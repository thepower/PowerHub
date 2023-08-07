import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from 'application/store';
import {
  OutlinedInput,
  ModalLoader,
  Button,
} from 'common';
import { checkIfLoading } from 'network/selectors';
import classnames from 'classnames';
import { t } from 'i18next';
import { getWalletAddress } from 'account/selectors/accountSelectors';
import { exportAccount } from 'account/slice/accountSlice';
import { objectToString, stringToObject } from 'sso/utils';
import { getRouterParamsData } from 'router/selectors';
import styles from '../../Registration.module.scss';
import {
  setCreatingCurrentShard,
  setCreatingStep,
  setSeedPhrase,
  createWallet,
  toggleRandomChain,
} from '../../../slice/registrationSlice';
import {
  CreateAccountStepsEnum,
} from '../../../typings/registrationTypes';
import { getCurrentCreatingStep, getCurrentShardSelector, getGeneratedSeedPhrase } from '../../../selectors/registrationSelectors';
import { RegistrationBackground } from '../../common/RegistrationBackground';
import { RegistrationStatement } from '../../common/RegistrationStatement';
import { getCurrentNetworkChains } from '../../../../application/selectors';

const mapStateToProps = (state: RootState) => ({
  currentShard: getCurrentShardSelector(state),
  creatingStep: getCurrentCreatingStep(state),
  generatedSeedPhrase: getGeneratedSeedPhrase(state),
  loading: checkIfLoading(state, createWallet.type),
  networkChains: getCurrentNetworkChains(state),
  walletAddress: getWalletAddress(state),
  data: getRouterParamsData(state),
});

const mapDispatchToProps = {
  setCreatingCurrentShard,
  setCreatingStep,
  setSeedPhrase,
  createWallet,
  toggleRandomChain,
  exportAccount,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type CreateNewAccountForAppsProps = ConnectedProps<typeof connector>;

class CreateNewAccountForAppsComponent extends React.PureComponent<CreateNewAccountForAppsProps> {
  get parsedData(): {
    chainID: number,
    callbackUrl?: string,
    returnUrl: string,
    isShowSeedAfterRegistration?: boolean
  } | null {
    const { data } = this.props;

    if (data) return stringToObject(data);
    return null;
  }

  submitForm = () => {
    const {
      creatingStep,
      setSeedPhrase,
      generatedSeedPhrase,
      createWallet,
      walletAddress,

    } = this.props;
    const { parsedData } = this;
    if (creatingStep === CreateAccountStepsEnum.setSeedPhrase) {
      const password = '';
      setSeedPhrase({
        seedPhrase: generatedSeedPhrase!,
        nextStep: CreateAccountStepsEnum.encryptPrivateKey,
      });
      createWallet({
        password,
        randomChain: false,
        additionalAction: () => {
          const { exportAccount } = this.props;
          exportAccount({ password, isWithoutGoHome: true });
        },
      });
      return;
    }

    if (creatingStep === CreateAccountStepsEnum.encryptPrivateKey) {
      const stringData = objectToString({ address: walletAddress, returnUrl: parsedData?.returnUrl });
      if (parsedData?.callbackUrl) {
        window.location.replace(`${parsedData.callbackUrl}sso/${stringData}`);
      }
    }
  };

  renderContent = () => {
    const { creatingStep } = this.props;
    switch (creatingStep) {
      case CreateAccountStepsEnum.setSeedPhrase:
        return this.renderSetSeedPhrase();
      case CreateAccountStepsEnum.encryptPrivateKey:
        return this.exportKeyForApps();
      default:
        return null;
    }
  };

  renderSetSeedPhrase = () => {
    const { generatedSeedPhrase } = this.props;

    return <RegistrationBackground className={styles.rememberBackground}>
      <div className={classnames(styles.loginRegisterAccountTitle, styles.rememberTitle)}>
        {t('remember')}
      </div>
      <RegistrationStatement description={t('enterSeedPhrase')} />
      <RegistrationStatement description={t('IfYouSpecifyYourOwnSeedPhrase')} />
      <RegistrationStatement description={t('writeDownYourSeedPhraseAndStore')} />
      <RegistrationStatement description={t('seedPhraseIsTheOnlyWay')} />
      <div className={styles.setSeedPhraseHolder}>
        <div className={styles.seedPhraseTitle}>
          {t('seedPhrase')}
        </div>
        <OutlinedInput
          placeholder={generatedSeedPhrase!}
          className={styles.loginTextArea}
          multiline
          value={generatedSeedPhrase}
        />
      </div>
    </RegistrationBackground>;
  };

  exportKeyForApps = () => {
    const { parsedData } = this;
    const { walletAddress, generatedSeedPhrase } = this.props;
    return (
      <RegistrationBackground className={styles.exportKeyForAppsHolder}>
        <div className={styles.exportKeyForAppsTitle}>
          {t('registrationCompleted')}
        </div>
        <div className={styles.exportKeyForAppsAdvice}>
          {t('toLogInItIsMoreConvenientToUseKeyFile')}
        </div>
        <div className={styles.exportKeyForAppsText}>
          {t('yourAccount')}
          :
          <br />
          <span>{walletAddress || '-'}</span>
        </div>
        {parsedData?.isShowSeedAfterRegistration === false &&
          <div className={styles.exportKeyForAppsText}>
            {t('yourSeedPhrase')}
            :
            <br />
            <span>
              {generatedSeedPhrase || '-'}
            </span>
          </div>}
        <div className={styles.exportKeyForAppsText}>
          {t('yourKeyFile')}
          {' '}
          <span>power_wallet.pem</span>
          {' '}
          {t('savedToDisk')}
        </div>
      </RegistrationBackground>
    );
  };

  getSubmitButtonDisabled = () => {
    const { creatingStep } = this.props;

    switch (creatingStep) {
      default:
        return false;
    }
  };

  render() {
    const { creatingStep, loading } = this.props;
    return <>
      <ModalLoader
        loadingTitle={t('processingVerySoonEverythingWillHappen')}
        open={loading}
        hideIcon
      />
      {this.renderContent()}
      <div className={styles.registrationButtonsHolder}>
        <Button
          size="medium"
          variant="filled"
          type="button"
          onClick={this.submitForm}
          disabled={this.getSubmitButtonDisabled()}
        >
          {creatingStep === CreateAccountStepsEnum.encryptPrivateKey ? t('logInToTheApp') : t('next')}
        </Button>
      </div>
    </>;
  }
}

export const CreateNewAccountForApps = connector(CreateNewAccountForAppsComponent);
