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

type CreateNewAccountForAppsState = {
  isAccountExported: boolean
};

class CreateNewAccountForAppsComponent extends React.PureComponent<CreateNewAccountForAppsProps, CreateNewAccountForAppsState> {
  constructor(props: CreateNewAccountForAppsProps) {
    super(props);

    this.state = {
      isAccountExported: false,
    };
  }

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

  submitForm = async () => {
    const {
      creatingStep,
      setSeedPhrase,
      generatedSeedPhrase,
      createWallet,
      walletAddress,
      exportAccount,
    } = this.props;
    const { isAccountExported } = this.state;
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
      });
    }

    if (creatingStep === CreateAccountStepsEnum.encryptPrivateKey) {
      if (isAccountExported) {
        const stringData = objectToString({
          address: walletAddress,
          returnUrl: parsedData?.returnUrl,
        });
        if (parsedData?.callbackUrl) {
          window.location.replace(`${parsedData.callbackUrl}sso/${stringData}`);
        }
      } else {
        const password = '';
        exportAccount({
          password,
          isWithoutGoHome: true,
          additionalActionOnSuccess: () => {
            this.setState({ isAccountExported: true });
          },
        });
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
          <span>
            {`power_wallet_${walletAddress}.pem`}
          </span>
          {' '}
          {t('savedToDisk')}
        </div>
      </RegistrationBackground>
    );
  };

  getSubmitButtonDisabled = () => {
    const { creatingStep, walletAddress } = this.props;

    switch (creatingStep) {
      case CreateAccountStepsEnum.encryptPrivateKey: {
        return !walletAddress;
      }
      default:
        return false;
    }
  };

  getSubmitButtonTitle = () => {
    const { creatingStep } = this.props;
    switch (creatingStep) {
      case CreateAccountStepsEnum.setSeedPhrase:
        return t('next');
      case CreateAccountStepsEnum.encryptPrivateKey:
        return this.state.isAccountExported ? t('logInToTheApp') : t('exportAccount');
      default:
        return null;
    }
  };

  render() {
    const { loading } = this.props;
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
          {this.getSubmitButtonTitle()}
        </Button>
      </div>
    </>;
  }
}

export const CreateNewAccountForApps = connector(CreateNewAccountForAppsComponent);
