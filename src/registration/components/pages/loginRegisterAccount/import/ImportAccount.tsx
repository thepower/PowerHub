import { AttachIcon, Button } from 'common';
import React, { ChangeEvent } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { ConnectedProps, connect } from 'react-redux';
import { importAccountFromFile } from '../../../../../account/slice/accountSlice';
import { Maybe } from '../../../../../typings/common';
import styles from '../../../Registration.module.scss';
import { ImportAccountModal } from './ImportAccountModal';

const mapStateToProps = () => ({});
const mapDispatchToProps = {
  importAccountFromFile,
};

interface ImportAccountState {
  openedPasswordModal: boolean;
  accountFile: Maybe<File>;
}
const connector = connect(mapStateToProps, mapDispatchToProps);
type ImportAccountProps = ConnectedProps<typeof connector> & WithTranslation;

class ImportAccountComponent extends React.PureComponent<ImportAccountProps, ImportAccountState> {
  private importAccountInput: Maybe<HTMLInputElement> = null;

  constructor(props: ImportAccountProps) {
    super(props);

    this.state = {
      openedPasswordModal: false,
      accountFile: null,
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
      additionalActionOnDecryptError: () => {
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

  handleImportAccount = (password: string) => {
    const { importAccountFromFile } = this.props;
    const { accountFile } = this.state;

    importAccountFromFile({
      password,
      accountFile: accountFile!,
    });

    this.closePasswordModal();
  };

  render() {
    const { openedPasswordModal } = this.state;

    return <>
      <ImportAccountModal
        open={openedPasswordModal}
        onClose={this.closePasswordModal}
        onSubmit={this.handleImportAccount}
      />
      <div className={styles.importAccountFormHolder}>
        <div className={styles.importAccountFormDesc}>
          {this.props.t('toImportAccountUpload')}
        </div>
        <input
          ref={this.setImportAccountRef}
          className={styles.importAccountInput}
          onChange={this.setAccountFile}
          type="file"
        />
        <Button
          size="medium"
          variant="outlined"
          type="button"
          onClick={this.handleOpenImportFile}
        >
          <AttachIcon />
          <span className={styles.importAccountButtonLabel}>
            {this.props.t('chooseFile')}
          </span>
        </Button>
      </div>
    </>;
  }
}

export const ImportAccount = withTranslation()(connector(ImportAccountComponent));
