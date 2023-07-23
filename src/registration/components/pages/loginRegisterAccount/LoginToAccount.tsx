import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { OutlinedInput } from 'common';
import { t } from 'i18next';
import styles from '../../Registration.module.scss';
import {
  setLoginSeed,
  seLoginAddress,
  setLoginPassword,
  setLoginConfirmedPassword,
} from '../../../slice/registrationSlice';
import { Maybe } from '../../../../typings/common';

const mapDispatchToProps = {
  seLoginAddress,
  setLoginSeed,
  setLoginPassword,
  setLoginConfirmedPassword,
};

const connector = connect(null, mapDispatchToProps);
type LoginToAccountProps = ConnectedProps<typeof connector> & {
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
        {t('toLoginYouNeedEnter')}
      </div>
      <OutlinedInput
        placeholder={t('address')!}
        className={styles.passwordInput}
        value={address}
        onChange={this.onChangeAddress}
      />
      <OutlinedInput
        placeholder={t('seedPhrase')!}
        className={styles.passwordInput}
        value={seed}
        type={'password'}
        onChange={this.onChangeSeed}
      />
      <OutlinedInput
        placeholder={t('password')!}
        className={styles.passwordInput}
        value={password}
        type={'password'}
        onChange={this.onChangePassword}
      />
      <OutlinedInput
        placeholder={t('repeatedPassword')!}
        className={styles.passwordInput}
        value={confirmedPassword}
        type={'password'}
        error={passwordsNotEqual}
        errorMessage={t('oopsPasswordsDidntMatch')!}
        onChange={this.onChangeConfirmedPassword}
      />
    </div>;
  }
}

export const LoginToAccount = connector(LoginToAccountComponent);
