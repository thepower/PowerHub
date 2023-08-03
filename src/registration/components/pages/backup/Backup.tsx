import { Button } from 'common';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { ConnectedProps, connect } from 'react-redux';
import { proceedToHub } from '../../../slice/registrationSlice';
import styles from '../../Registration.module.scss';
import { RegistrationBackground } from '../../common/RegistrationBackground';
import { RegistrationStatement } from '../../common/RegistrationStatement';
import { ExportAccountModal } from './ExportAccountModal';

const mapStateToProps = () => ({});
const mapDispatchToProps = {
  proceedToHub,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type BackupProps = ConnectedProps<typeof connector> & WithTranslation;

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
      <RegistrationBackground className={styles.exportBackground}>
        <div className={styles.registrationPageTitle}>{this.props.t('importantRules')}</div>
        <RegistrationStatement title={this.props.t('export')!} description={this.props.t('pleaseExportWalletData')} />
        <RegistrationStatement title={this.props.t('important')!} description={this.props.t('youNeedBothYourAddress')} />
      </RegistrationBackground>
      <div className={styles.registrationButtonsHolder}>
        <Button
          size="medium"
          variant="outlined"
          type="button"
          onClick={this.handleProceedToHub}
        >
          {this.props.t('skip')}
        </Button>
        <Button
          size="medium"
          variant="filled"
          type="button"
          onClick={this.openPasswordModal}
        >
          {this.props.t('export')}
        </Button>
      </div>
    </>;
  }
}

export const Backup = withTranslation()(connector(BackupComponent));
