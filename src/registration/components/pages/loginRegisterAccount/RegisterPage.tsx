import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Button, Tabs, WizardComponentProps } from 'common';
import { RootState } from 'application/store';
import {
  CreateAccountStepsEnum,
  LoginRegisterAccountTabs,
  LoginRegisterAccountTabsLabels, LoginRegisterAccountTabsLabelsShort,
} from '../../../typings/registrationTypes';
import { CreateNewAccount } from './CreateNewAccount';
import {
  generateSeedPhrase,
  setCurrentRegisterCreateAccountTab,
  setPasswordNotEqual,
  loginToWalletFromRegistration,
} from '../../../slice/registrationSlice';
import { LoginToAccount } from './LoginToAccount';
import {
  getCurrentCreatingStep,
  getCurrentRegistrationTab,
  getCurrentShardSelector,
  getLoginData,
} from '../../../selectors/registrationSelectors';
import { ImportAccount } from './import/ImportAccount';
import styles from '../../Registration.module.scss';
import { RegistrationBackground } from '../../common/RegistrationBackground';
import { compareTwoStrings } from '../../../utils/registrationUtils';

const mapStateToProps = (state: RootState) => ({
  tab: getCurrentRegistrationTab(state),
  currentShard: getCurrentShardSelector(state),
  creatingStep: getCurrentCreatingStep(state),
  ...getLoginData(state),
});

const mapDispatchToProps = {
  setCurrentRegisterCreateAccountTab,
  generateSeedPhrase,
  setPasswordNotEqual,
  loginToWalletFromRegistration,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type LoginRegisterAccountProps = ConnectedProps<typeof connector> & WizardComponentProps;

interface LoginRegisterAccountState {
  isMobile: boolean;
}

class LoginRegisterAccountComponent extends React.PureComponent<LoginRegisterAccountProps, LoginRegisterAccountState> {
  constructor(props: LoginRegisterAccountProps) {
    super(props);

    this.state = {
      isMobile: window.innerWidth < 768,
    };
  }

  onChangeTab = (_event: React.SyntheticEvent, value: LoginRegisterAccountTabs) => {
    this.props.setCurrentRegisterCreateAccountTab(value);
  };

  getPageContent = () => {
    const {
      tab,
      setNextStep,
      address,
      seed,
      password,
      confirmedPassword,
      passwordsNotEqual,
    } = this.props;

    switch (tab) {
      case LoginRegisterAccountTabs.create:
        return <CreateNewAccount setNextStep={setNextStep} />;
      case LoginRegisterAccountTabs.login:
        return <LoginToAccount
          address={address}
          confirmedPassword={confirmedPassword}
          password={password}
          passwordsNotEqual={passwordsNotEqual}
          seed={seed}
        />;
      case LoginRegisterAccountTabs.import:
        return <ImportAccount />;
      default:
        return null;
    }
  };

  getButtonDisabled = () => {
    const {
      currentShard,
      tab,
      address,
      seed,
      password,
      confirmedPassword,
      passwordsNotEqual,
    } = this.props;

    if (tab === LoginRegisterAccountTabs.create) {
      return !currentShard;
    }

    return !address || !seed || passwordsNotEqual || !password || !confirmedPassword;
  };

  handleButtonClick = () => {
    const {
      tab,
      generateSeedPhrase,
      address,
      seed,
      password,
      confirmedPassword,
      setPasswordNotEqual,
    } = this.props;

    if (tab === LoginRegisterAccountTabs.create) {
      generateSeedPhrase();
      return;
    }

    const passwordsNotEqual = !compareTwoStrings(password!, confirmedPassword!);

    if (passwordsNotEqual) {
      setPasswordNotEqual(true);
      return;
    }

    loginToWalletFromRegistration({
      address: address!,
      seed: seed!,
      password: password!,
    });
  };

  render() {
    const { tab, setNextStep } = this.props;
    const { isMobile } = this.state;

    if (this.props.creatingStep !== CreateAccountStepsEnum.selectSubChain) {
      return <CreateNewAccount setNextStep={setNextStep} />;
    }

    return <div className={styles.registrationComponent}>
      <RegistrationBackground>
        <div className={styles.loginRegisterAccountTitle}>
          {'Create, login or import an account'}
        </div>
        <div className={styles.loginRegisterAccountHolder}>
          <Tabs
            tabs={LoginRegisterAccountTabs}
            tabsLabels={isMobile ? LoginRegisterAccountTabsLabelsShort : LoginRegisterAccountTabsLabels}
            value={tab}
            onChange={this.onChangeTab}
          />
          {this.getPageContent()}
        </div>
      </RegistrationBackground>
      <div className={styles.registrationButtonsHolder}>
        {
          tab !== LoginRegisterAccountTabs.import &&
          <Button
            size="medium"
            variant="filled"
            type="button"
            onClick={this.handleButtonClick}
            disabled={this.getButtonDisabled()}
          >
            {'Next'}
          </Button>
        }
      </div>
    </div>;
  }
}

export const RegisterPage = connector(LoginRegisterAccountComponent);
