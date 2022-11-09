import React, { ChangeEvent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import classnames from 'classnames';
import { Button } from '@mui/material';
import styles from '../Registration.module.scss';
import { RegistrationBackground } from '../common/RegistrationBackground';
import { AttachIcon, OutlinedInput, PELogoWithTitle } from '../../../common';
import { Maybe } from '../../../typings/common';
import { importAccountFromFile } from '../../../account/slice/accountSlice';
import { ImportAccountModal } from './loginRegisterAccount/import/ImportAccountModal';
import { compareTwoStrings } from '../../utils/registrationUtils';
import { loginToWalletFromRegistration } from '../../slice/registrationSlice';

const mapStateToProps = () => ({});
const mapDispatchToProps = {
  importAccountFromFile,
  loginToWalletFromRegistration,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type LoginPageProps = ConnectedProps<typeof connector>;

interface LoginPageState {
  openedPasswordModal: boolean;
  accountFile: Maybe<File>;
  address: string;
  seed: string;
  password: string;
  confirmedPassword: string;
  passwordsNotEqual: boolean;
}

class LoginPageComponent extends React.PureComponent<LoginPageProps, LoginPageState> {
  private importAccountInput: Maybe<HTMLInputElement> = null;

  constructor(props: LoginPageProps) {
    super(props);

    this.state = {
      openedPasswordModal: false,
      accountFile: null,
      address: '',
      seed: '',
      password: '',
      confirmedPassword: '',
      passwordsNotEqual: false,
    };
  }

  setImportAccountRef = (el: HTMLInputElement) => this.importAccountInput = el;

  handleOpenImportFile = () => {
    if (this.importAccountInput) {
      this.importAccountInput.click();
    }
  };

  setAccountFile = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      accountFile: event?.target?.files?.[0]!,
      openedPasswordModal: true,
    });
  };

  closePasswordModal = () => {
    this.setState({ openedPasswordModal: false });
  };

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

  handleImportAccount = (password: string) => {
    const { importAccountFromFile } = this.props;
    const { accountFile } = this.state;

    importAccountFromFile({
      password,
      accountFile: accountFile!,
    });

    this.closePasswordModal();
  };

  renderImportPart = () => <div className={styles.loginPagePart}>
    <input
      ref={this.setImportAccountRef}
      className={styles.importAccountInput}
      onChange={this.setAccountFile}
      type="file"
    />
    <div className={styles.loginPagePartTitle}>
      {'Import account'}
    </div>
    <div className={styles.loginPagePartDesc}>
      {'To import an account, upload the required file'}
    </div>
    <Button
      className={classnames(
        styles.registrationNextButton,
        styles.registrationNextButton_outlined,
        styles.importAccountButton,
        styles.loginPageImportButton,
      )}
      variant="outlined"
      size="large"
      onClick={this.handleOpenImportFile}
    >
      <AttachIcon />
      <span className={styles.importAccountButtonLabel}>
        {'Choose file'}
      </span>
    </Button>
  </div>;

  renderLoginPart = () => {
    const {
      address,
      seed,
      password,
      confirmedPassword,
      passwordsNotEqual,
    } = this.state;

    return <div className={styles.loginPagePart}>
      <div className={styles.loginPagePartTitle}>
        {'Login to account'}
      </div>
      <div className={styles.loginPagePartDesc}>
        {'To login, you need enter the address and private key or seed phrase'}
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
      <div className={styles.registrationButtonsHolder}>
        <Button
          className={styles.registrationNextButton}
          variant="contained"
          size="large"
          onClick={this.loginToAccount}
          disabled={!address || !seed || passwordsNotEqual || !password || !confirmedPassword}
        >
          {'Next'}
        </Button>
      </div>
    </div>;
  };

  render() {
    const { openedPasswordModal } = this.state;

    return <div className={styles.registrationPage}>
      <ImportAccountModal
        open={openedPasswordModal}
        onClose={this.closePasswordModal}
        onSubmit={this.handleImportAccount}
      />
      <div className={styles.registrationPageCover} />
      <div className={styles.registrationWizardComponent}>
        <PELogoWithTitle className={styles.registrationPageIcon} />
        <RegistrationBackground className={styles.loginPageBackground}>
          <div className={styles.loginRegisterAccountTitle}>
            {'Login or import an account'}
          </div>
          <div className={styles.loginPageFormsHolder}>
            {this.renderImportPart()}
            {this.renderLoginPart()}
          </div>
        </RegistrationBackground>
      </div>
    </div>;
  }
}

export const LoginPage = connector(LoginPageComponent);
