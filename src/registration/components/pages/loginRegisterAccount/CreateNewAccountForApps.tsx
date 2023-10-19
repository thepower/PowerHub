import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from 'application/store';
import {
  OutlinedInput,
  ModalLoader,
  Button,
  // Checkbox,
} from 'common';
import { checkIfLoading } from 'network/selectors';
import classnames from 'classnames';
import { t } from 'i18next';
import { getWalletAddress } from 'account/selectors/accountSelectors';
import { exportAccount } from 'account/slice/accountSlice';
import { objectToString, stringToObject } from 'sso/utils';
import { getRouterParamsData } from 'router/selectors';
// import { CheckedIcon, UnCheckedIcon } from 'common/icons';
// import { FormControlLabel } from '@mui/material';
import { setKeyToApplicationStorage } from 'application/utils/localStorageUtils';
import { union } from 'lodash';
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
import { getKeyFromApplicationStorage } from '../../../../application/utils/localStorageUtils';

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
  isAutoSignMessages: boolean
  isAccountExported: boolean
};

class CreateNewAccountForAppsComponent extends React.PureComponent<CreateNewAccountForAppsProps, CreateNewAccountForAppsState> {
  constructor(props: CreateNewAccountForAppsProps) {
    super(props);

    this.state = {
      isAutoSignMessages: true,
      isAccountExported: false,
    };
  }

  get parsedData(): {
    isAutoSignMessagesShowCheckBox?: boolean,
    chainID: number,
    callbackUrl?: string,
    returnUrl: string,
    isShowSeedAfterRegistration?: boolean
    allowedAutoSignTxContractsAddresses?: string[]
  } | null {
    const { data } = this.props;

    if (data) return stringToObject(data);
    return null;
  }

  // handleCheckAutoSign = () => {
  //   const isAutoSignMessages = this.state.isAutoSignMessages;

  //   this.setState({ isAutoSignMessages: !isAutoSignMessages });
  // };

  submitForm = async () => {
    const {
      creatingStep,
      setSeedPhrase,
      generatedSeedPhrase,
      createWallet,
      walletAddress,
      exportAccount,
    } = this.props;
    const { isAutoSignMessages, isAccountExported } = this.state;
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

      if (isAutoSignMessages && parsedData?.allowedAutoSignTxContractsAddresses) {
        const existedAllowedAutoSignTxContractsAddresses =
            await getKeyFromApplicationStorage<string[]>('allowedAutoSignTxContractsAddresses');
        if (existedAllowedAutoSignTxContractsAddresses?.length) {
          setKeyToApplicationStorage(
            'allowedAutoSignTxContractsAddresses',
            union(existedAllowedAutoSignTxContractsAddresses, parsedData.allowedAutoSignTxContractsAddresses),
          );
        } else {
          setKeyToApplicationStorage(
            'allowedAutoSignTxContractsAddresses',
            parsedData.allowedAutoSignTxContractsAddresses,
          );
        }
      }
      return;
    }

    if (creatingStep === CreateAccountStepsEnum.encryptPrivateKey) {
      if (isAccountExported) {
        const stringData = objectToString({
          address: walletAddress,
          returnUrl: parsedData?.returnUrl,
          isAutoSignMessages,
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
    // const { isAutoSignMessages } = this.state;

    // const { parsedData, handleCheckAutoSign } = this;

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

      {/* {parsedData?.isAutoSignMessagesShowCheckBox && (
      <FormControlLabel
        control={<Checkbox
          size={'medium'}
          checked={isAutoSignMessages}
          onClick={handleCheckAutoSign}
          checkedIcon={<CheckedIcon />}
          icon={<UnCheckedIcon />}
          disableRipple
        />}
        label={t('signMessagesAutomatically')}
      />)} */}
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
