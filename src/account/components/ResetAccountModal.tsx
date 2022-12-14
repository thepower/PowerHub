import React from 'react';
import { Modal, OutlinedInput } from 'common';
import classnames from 'classnames';
import { connect, ConnectedProps } from 'react-redux';
import { Button } from '@mui/material';
import styles from '../../registration/components/Registration.module.scss';
import { resetAccount } from '../slice/accountSlice';

const mapDispatchToProps = {
  resetAccount,
};

const connector = connect(null, mapDispatchToProps);
type ResetAccountModalProps = ConnectedProps<typeof connector> & {
  open: boolean;
  onClose: () => void;
};

interface ResetAccountModalState {
  password: string;
}

export class ResetAccountModalComponent extends React.PureComponent<ResetAccountModalProps, ResetAccountModalState> {
  constructor(props: ResetAccountModalProps) {
    super(props);

    this.state = {
      password: '',
    };
  }

  onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      password: event.target.value,
    });
  };

  handleSubmitImportModal = () => {
    const { resetAccount, onClose } = this.props;
    const { password } = this.state;

    resetAccount(password);
    this.setState({ password: '' });
    onClose();
  };

  render() {
    const {
      open,
      onClose,
    } = this.props;

    const { password } = this.state;

    return <Modal
      contentClassName={styles.importModalContent}
      onClose={onClose}
      open={open}
    >
      <div className={styles.exportModalTitleHolder}>
        <div className={styles.exportModalTitle}>
          {'Reset account'}
        </div>
        <div className={styles.exportModalTitle}>
          {'Are you sure you want to reset your account?'}
        </div>
        <div className={styles.exportModalTitle}>
          {'Enter your password to confirm account reset'}
        </div>
      </div>
      <OutlinedInput
        placeholder={'Password'}
        className={classnames(styles.passwordInput, styles.importModalPasswordInput)}
        value={password}
        onChange={this.onChangePassword}
        type={'password'}
        autoFocus
      />
      <Button
        className={classnames(styles.registrationNextButton, styles.registrationNextButton_outlined)}
        variant="outlined"
        size="large"
        onClick={this.handleSubmitImportModal}
      >
        <span className={styles.registrationNextButtonText}>
          {'Next'}
        </span>
      </Button>
    </Modal>;
  }
}

export const ResetAccountModal = connector(ResetAccountModalComponent);
