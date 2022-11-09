import React from 'react';
import { Button } from '@mui/material';
import classnames from 'classnames';
import { connect, ConnectedProps } from 'react-redux';
import { RegistrationBackground } from '../../common/RegistrationBackground';
import { RegistrationStatement } from '../../common/RegistrationStatement';
import styles from '../../Registration.module.scss';
import { proceedToHub } from '../../../slice/registrationSlice';
import { ExportAccountModal } from './ExportAccountModal';

const mapStateToProps = () => ({});
const mapDispatchToProps = {
  proceedToHub,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type BackupProps = ConnectedProps<typeof connector>;

interface BackupState {
  openedPasswordModal: boolean;
}

class BackupComponent extends React.PureComponent<BackupProps, BackupState> {
  constructor(props: BackupProps) {
    super(props);

    this.state = {
      openedPasswordModal: false,
    };
  }

  openPasswordModal = () => {
    this.setState({ openedPasswordModal: true });
  };

  closePasswordModal = () => {
    this.setState({ openedPasswordModal: false });
  };

  handleProceedToHub = () => {
    this.props.proceedToHub();
  };

  render() {
    const { openedPasswordModal } = this.state;

    return <>
      <ExportAccountModal
        open={openedPasswordModal}
        onClose={this.closePasswordModal}
      />
      <RegistrationBackground>
        <div className={styles.registrationPageTitle}>{'Important rules!'}</div>
        <RegistrationStatement title={'Export'} description={'Please export wallet data so that you may recover your wallet later in case of emergency'} />
        <RegistrationStatement title={'IMPORTANT!'} description={'You need both your address and seed phrase to restore your wallet. So store them both'} />
      </RegistrationBackground>
      <div className={styles.registrationButtonsHolder}>
        <Button
          className={classnames(styles.registrationNextButton, styles.registrationNextButton_outlined)}
          variant="outlined"
          size="large"
          onClick={this.handleProceedToHub}
        >
          <span className={styles.registrationNextButtonText}>
            {'Skip'}
          </span>
        </Button>
        <Button
          className={styles.registrationNextButton}
          variant="contained"
          size="large"
          onClick={this.openPasswordModal}
        >
          {'Export'}
        </Button>
      </div>
    </>;
  }
}

export const Backup = connector(BackupComponent);
