import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Button } from 'common';
import { t } from 'i18next';
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
      <RegistrationBackground className={styles.exportBackground}>
        <div className={styles.registrationPageTitle}>{t('importantRules')}</div>
        <RegistrationStatement title={t('export')!} description={t('pleaseExportWalletData')} />
        <RegistrationStatement title={t('important')!} description={t('youNeedBothYourAddress')} />
      </RegistrationBackground>
      <div className={styles.registrationButtonsHolder}>
        <Button
          size="medium"
          variant="outlined"
          type="button"
          onClick={this.handleProceedToHub}
        >
          {t('skip')}
        </Button>
        <Button
          size="medium"
          variant="filled"
          type="button"
          onClick={this.openPasswordModal}
        >
          {t('export')}
        </Button>
      </div>
    </>;
  }
}

export const Backup = connector(BackupComponent);
