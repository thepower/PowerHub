import { OutlinedInput } from 'common';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { ConnectedProps, connect } from 'react-redux';
import { Maybe } from '../../../../typings/common';
import {
  seLoginAddress,
  setLoginConfirmedPassword,
  setLoginPassword,
  setLoginSeed,
} from '../../../slice/registrationSlice';
import styles from '../../Registration.module.scss';

const mapDispatchToProps = {
  seLoginAddress,
  setLoginSeed,
  setLoginPassword,
  setLoginConfirmedPassword,
};

const connector = connect(null, mapDispatchToProps);
type LoginToAccountProps = ConnectedProps<typeof connector> & WithTranslation & {
  address: Maybe<string>;
  seed: Maybe<string>;
  password: Maybe<string>;
  confirmedPassword: Maybe<string>;
  passwordsNotEqual: boolean;
};

class LoginToAccountComponent extends React.PureComponent<LoginToAccountProps> {
  onChangeAddress = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    this.props.seLoginAddress(event.target.value);
  };

  onChangeSeed = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    this.props.setLoginSeed(event.target.value);
  };

  onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.setLoginPassword(event.target.value);
  };

  onChangeConfirmedPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.setLoginConfirmedPassword(event.target.value);
  };

  render() {
    const {
      address,
      seed,
      passwordsNotEqual,
      password,
      confirmedPassword,
    } = this.props;

    return <div className={styles.registrationFormHolder}>
      <div className={styles.registrationFormDesc}>
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
    </div>;
  }
}

export const LoginToAccount = withTranslation()(connector(LoginToAccountComponent));
