import React, { ChangeEvent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { AttachIcon, Button } from 'common';
import styles from '../../../Registration.module.scss';
import { Maybe } from '../../../../../typings/common';
import { importAccountFromFile } from '../../../../../account/slice/accountSlice';
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
type ImportAccountProps = ConnectedProps<typeof connector>;

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
    this.setState({
      accountFile: event?.target?.files?.[0]!,
      openedPasswordModal: true,
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
          {'To import an account, upload the required file'}
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
            {'Choose file'}
          </span>
        </Button>
      </div>
    </>;
  }
}

export const ImportAccount = connector(ImportAccountComponent);
