import classnames from 'classnames';
import React, { ChangeEvent } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import { importAccountFromFile } from '../../../account/slice/accountSlice';
import {
  AttachIcon,
  Button,
  LangSelect,
  OutlinedInput,
  PELogoWithTitle,
} from '../../../common';
import { Maybe } from '../../../typings/common';
import { loginToWalletFromRegistration } from '../../slice/registrationSlice';
import { compareTwoStrings } from '../../utils/registrationUtils';
import { RegistrationBackground } from '../common/RegistrationBackground';
import styles from '../Registration.module.scss';
import { ImportAccountModal } from './loginRegisterAccount/import/ImportAccountModal';

const mapStateToProps = () => ({});
const mapDispatchToProps = {
  importAccountFromFile,
  loginToWalletFromRegistration,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type LoginPageProps = ConnectedProps<typeof connector> & WithTranslation;

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
    const { importAccountFromFile } = this.props;

    const accountFile = event?.target?.files?.[0]!;
    importAccountFromFile({
      password: '',
      accountFile: accountFile!,
      additionalActionOnError: () => {
        this.setState({
          accountFile,
          openedPasswordModal: true,
        });
      },
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
      {this.props.t('importAccount')}
    </div>
    <div className={classnames(styles.loginPagePartDesc, styles.loginPagePartDesc_short)}>
      {this.props.t('toImportAccountUpload')}
    </div>
    <Button
      className={classnames(
        styles.registrationNextButton,
        styles.registrationNextButton_outlined,
        styles.importAccountButton,
        styles.loginPageImportButton,
      )}
      variant="outlined"
      size="medium"
      onClick={this.handleOpenImportFile}
    >
      <AttachIcon />
      <span className={styles.importAccountButtonLabel}>
        {this.props.t('chooseFile')}
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
        {this.props.t('loginToAccount')}
      </div>
      <div className={classnames(styles.loginPagePartDesc, styles.loginPagePartLoginDesc)}>
        {this.props.t('toLoginYouNeedEnter')}
      </div>
      <OutlinedInput
        placeholder={this.props.t('address')!}
        className={styles.passwordInput}
        value={address}
        onChange={this.onChangeAddress}
      />
      <OutlinedInput
        placeholder={this.props.t('seedPhrase')!}
        className={styles.passwordInput}
        value={seed}
        type={'password'}
        onChange={this.onChangeSeed}
      />
      <OutlinedInput
        placeholder={this.props.t('password')!}
        className={styles.passwordInput}
        value={password}
        type={'password'}
        onChange={this.onChangePassword}
      />
      <OutlinedInput
        placeholder={this.props.t('repeatedPassword')!}
        className={styles.passwordInput}
        value={confirmedPassword}
        type={'password'}
        error={passwordsNotEqual}
        errorMessage={this.props.t('oopsPasswordsDidntMatch')!}
        onChange={this.onChangeConfirmedPassword}
      />
      <div className={styles.loginButtonHolder}>
        <Button
          size="medium"
          variant="filled"
          className={styles.button}
          type="button"
          disabled={!address || !seed || passwordsNotEqual || !password || !confirmedPassword}
          onClick={this.loginToAccount}
        >
          {this.props.t('next')}
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
      <LangSelect
        className={styles.langSelect}

      />
      <div className={styles.registrationPageCover} />
      <div className={styles.registrationWizardComponent}>
        <PELogoWithTitle className={styles.registrationPageIcon} />
        <RegistrationBackground className={styles.loginPageBackground}>
          <div className={styles.loginRegisterAccountTitle}>
            {this.props.t('registrationPageImportAccountButton')}
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

export const LoginPage = withTranslation()(connector(LoginPageComponent));
