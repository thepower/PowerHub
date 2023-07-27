import React from 'react';
import classnames from 'classnames';
import { Button } from '@mui/material';
import { connect, ConnectedProps } from 'react-redux';
import { t } from 'i18next';
import { Modal, OutlinedInput } from '../../../../common';
import styles from '../../Registration.module.scss';
import { compareTwoStrings } from '../../../utils/registrationUtils';
import { exportAccount } from '../../../../account/slice/accountSlice';

const mapDispatchToProps = {
  exportAccount,
};

const connector = connect(null, mapDispatchToProps);
type ExportAccountModalProps = ConnectedProps<typeof connector> & {
  open: boolean;
  onClose: () => void;
};

interface ExportAccountModalState {
  password: string;
  confirmedPassword: string;
  hint: string;
  passwordsNotEqual: boolean;
}

class ExportAccountModalComponent extends React.PureComponent<ExportAccountModalProps, ExportAccountModalState> {
  private initialState = {
    password: '',
    confirmedPassword: '',
    hint: '',
    passwordsNotEqual: false,
  };

  constructor(props: ExportAccountModalProps) {
    super(props);

    this.state = this.initialState;
  }

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

  onChangeHint = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      hint: event.target.value,
    });
  };

  handleSubmitExportModal = () => {
    const { password, confirmedPassword, hint } = this.state;
    const { exportAccount, onClose } = this.props;

    const passwordsNotEqual = !compareTwoStrings(password!, confirmedPassword!);

    if (passwordsNotEqual) {
      this.setState({ passwordsNotEqual });
      return;
    }

    exportAccount({ password, hint });

    this.setState({ ...this.initialState });

    onClose();
  };

  render() {
    const {
      open,
      onClose,
    } = this.props;

    const {
      password,
      confirmedPassword,
      hint,
      passwordsNotEqual,
    } = this.state;

    return <Modal
      contentClassName={styles.exportModalContent}
      onClose={onClose}
      open={open}
    >
      <div className={styles.exportModalTitleHolder}>
        <div className={styles.exportModalTitle}>
          {t('exportWallet')}
        </div>
        <div className={styles.exportModalTitle}>
          {t('exportYourWallet')}
        </div>
        <div className={styles.exportModalTitle}>
          {t('exportFileEncrypted')}
        </div>
      </div>
      <OutlinedInput
        placeholder={t('password')!}
        className={classnames(styles.passwordInput, styles.passwordInputPadded)}
        value={password}
        onChange={this.onChangePassword}
        type={'password'}
        autoFocus
      />
      <OutlinedInput
        placeholder={t('repeatedPassword')!}
        className={styles.passwordInput}
        value={confirmedPassword}
        onChange={this.onChangeConfirmedPassword}
        error={passwordsNotEqual}
        errorMessage={t('oopsPasswordsDidntMatch')!}
        type={'password'}
      />
      <div className={styles.exportModalHintDesc}>
        {t('hintForPassword')}
      </div>
      <OutlinedInput
        placeholder={t('hint')!}
        className={styles.exportModalHintTextArea}
        value={hint}
        onChange={this.onChangeHint}
        multiline
      />
      <Button
        className={classnames(styles.registrationNextButton, styles.registrationNextButton_outlined)}
        variant="outlined"
        size="large"
        onClick={this.handleSubmitExportModal}
      >
        <span className={styles.registrationNextButtonText}>
          {t('next')}
        </span>
      </Button>
    </Modal>;
  }
}

export const ExportAccountModal = connector(ExportAccountModalComponent);
