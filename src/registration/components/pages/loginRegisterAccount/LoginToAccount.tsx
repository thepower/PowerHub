import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { OutlinedInput, Tabs, Button } from 'common';
import styles from '../../Registration.module.scss';
import { LoginRegisterAccountTabs, LoginRegisterAccountTabsLabels, RegistrationPageAdditionalProps } from '../../../typings/registrationTypes';
import { RegistrationBackground } from '../../common/RegistrationBackground';
import { loginToWalletFromRegistration } from '../../../slice/registrationSlice';
import { compareTwoStrings } from '../../../utils/registrationUtils';

const mapDispatchToProps = {
  loginToWalletFromRegistration,
};

const connector = connect(null, mapDispatchToProps);
type LoginToAccountProps = ConnectedProps<typeof connector> & RegistrationPageAdditionalProps;

interface LoginToAccountState {
  address: string;
  seed: string;
  password: string;
  confirmedPassword: string;
  passwordsNotEqual: boolean;
}

class LoginToAccountComponent extends React.PureComponent<LoginToAccountProps, LoginToAccountState> {
  constructor(props: LoginToAccountProps) {
    super(props);
    this.state = {
      address: '',
      seed: '',
      password: '',
      confirmedPassword: '',
      passwordsNotEqual: false,
    };
  }

  onChangeAddress = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    this.setState({
      address: event.target.value,
    });
  };

  onChangeSeed = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    this.setState({
      seed: event.target.value,
    });
  };

  loginToAccount = () => {
    const { loginToWalletFromRegistration } = this.props;
    const {
      address,
      seed,
      password,
      confirmedPassword,
    } = this.state;

    const passwordsNotEqual = !compareTwoStrings(password!, confirmedPassword!);

    if (passwordsNotEqual) {
      this.setState({ passwordsNotEqual });
      return;
    }

    loginToWalletFromRegistration({ address, seed, password });
  };

  onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      password: event.target.value,
      passwordsNotEqual: false,
    });
  };

  onChangeConfirmedPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      confirmedPassword: event.target.value,
      passwordsNotEqual: false,
    });
  };

  render() {
    const {
      tab,
      onChangeTab,
    } = this.props;
    const {
      address,
      seed,
      passwordsNotEqual,
      password,
      confirmedPassword,
    } = this.state;

    return <>
      <RegistrationBackground>
        <div className={styles.loginRegisterAccountTitle}>
          {'Create, login or import an account'}
        </div>
        <div className={styles.loginRegisterAccountHolder}>
          <Tabs
            tabs={LoginRegisterAccountTabs}
            tabsLabels={LoginRegisterAccountTabsLabels}
            value={tab}
            onChange={onChangeTab}
          />
          <div className={styles.registrationFormHolder}>
            <div className={styles.registrationFormDesc}>
              {'To login, you need enter the address\nand private key or seed phrase'}
            </div>
            <OutlinedInput
              placeholder={'Address'}
              className={styles.passwordInput}
              value={address}
              onChange={this.onChangeAddress}
            />
            <OutlinedInput
              placeholder={'Seed phrase'}
              className={styles.passwordInput}
              value={seed}
              type={'password'}
              onChange={this.onChangeSeed}
            />
            <OutlinedInput
              placeholder={'Password'}
              className={styles.passwordInput}
              value={password}
              type={'password'}
              onChange={this.onChangePassword}
            />
            <OutlinedInput
              placeholder={'Repeated password'}
              className={styles.passwordInput}
              value={confirmedPassword}
              type={'password'}
              error={passwordsNotEqual}
              errorMessage={'oops, passwords didn\'t match, try again'}
              onChange={this.onChangeConfirmedPassword}
            />
          </div>
        </div>
      </RegistrationBackground>
      <div className={styles.registrationButtonsHolder}>
        <Button
          size="medium"
          variant="filled"
          type="button"
          onClick={this.loginToAccount}
          disabled={!address || !seed || passwordsNotEqual || !password || !confirmedPassword}
        >
          {'Next'}
        </Button>
      </div>
    </>;
  }
}

export const LoginToAccount = connector(LoginToAccountComponent);
