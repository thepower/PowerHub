import React from 'react';
import { Modal, OutlinedInput, Button } from 'common';
import classnames from 'classnames';
import styles from '../../../Registration.module.scss';

interface ImportAccountModalProps {
  open: boolean;
  onClose: (data?: any) => void;
  onSubmit: (data?: any) => void;
}

interface ImportAccountModalState {
  password: string;
}

export class ImportAccountModal extends React.PureComponent<ImportAccountModalProps, ImportAccountModalState> {
  constructor(props: ImportAccountModalProps) {
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
    const { onSubmit } = this.props;
    const { password } = this.state;

    onSubmit(password);
    this.setState({ password: '' });
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
          {'Import account'}
        </div>
        <div className={styles.exportModalTitle}>
          {'Please enter your password and your account will be loaded'}
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
        size="medium"
        variant="filled"
        type="button"
        onClick={this.handleSubmitImportModal}
      >
        {'Next'}
      </Button>
    </Modal>;
  }
}
