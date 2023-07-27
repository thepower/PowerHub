import React, { ChangeEvent } from 'react';
import cn from 'classnames';
import {
  SupportIcon,
  CreateIcon,
  ExportIcon,
  ImportIcon,
  ResetIcon,
} from 'common/icons';
import { CopyButton } from 'common';
import { connect, ConnectedProps } from 'react-redux';
import { Drawer } from '@mui/material';
import { isHub, isWallet } from 'application/components/AppRoutes';
import { clearApplicationStorage } from 'application/utils/localStorageUtils';
import { t } from 'i18next';
import { getOpenedMenu, getWalletAddress } from '../selectors/accountSelectors';
import globe from './globe.jpg';
import { Maybe } from '../../typings/common';
import { AccountActionsList } from './AccountActionsList';
import { AccountActionType } from '../typings/accountTypings';
import { ImportAccountModal } from '../../registration/components/pages/loginRegisterAccount/import/ImportAccountModal';
import {
  clearAccountData, exportAccount, importAccountFromFile, resetAccount, toggleOpenedAccountMenu,
} from '../slice/accountSlice';
import { ExportAccountModal } from '../../registration/components/pages/backup/ExportAccountModal';
import { ResetAccountModal } from './ResetAccountModal';
import { setShowUnderConstruction } from '../../application/slice/applicationSlice';
import { RootState } from '../../application/store';
import styles from './Account.module.scss';

const mapStateToProps = (state: RootState) => ({
  walletAddress: getWalletAddress(state),
  openedMenu: getOpenedMenu(state),
});

const mapDispatchToProps = {
  importAccountFromFile,
  setShowUnderConstruction,
  toggleOpenedAccountMenu,
  clearAccountData,
  resetAccount,
  exportAccount,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type AccountProps = ConnectedProps<typeof connector> & { className?: string };

interface AccountState {
  accountFile: Maybe<File>;
  openedImportAccountModal: boolean;
  openedExportAccountModal: boolean;
  openedResetAccountModal: boolean;
}

class AccountComponent extends React.PureComponent<AccountProps, AccountState> {
  private drawerPaperClasses = {
    paper: styles.drawerPaper,
    root: styles.drawerModalRoot,
  };

  private drawerModalProps = {
    componentsProps: {
      backdrop: {
        className: styles.drawerBackdrop,
      },
    },
  };

  private importAccountInput: Maybe<HTMLInputElement> = null;

  constructor(props: AccountProps) {
    super(props);
    this.state = {
      accountFile: null,
      openedImportAccountModal: false,
      openedExportAccountModal: false,
      openedResetAccountModal: false,
    };
  }

  handleCreateAccount = () => {
    this.props.setShowUnderConstruction(true);
  };

  handleExportAccount = () => {
    const { exportAccount } = this.props;
    exportAccount({
      password: '',
      additionalActionOnError: () => {
        this.setState({ openedExportAccountModal: true });
      },
    });
  };

  closeImportAccountModal = () => {
    this.setState({ openedImportAccountModal: false });
  };

  setImportAccountRef = (el: HTMLInputElement) => this.importAccountInput = el;

  handleOpenImportFile = () => {
    if (this.importAccountInput) {
      this.importAccountInput.click();
    }
  };

  handleImportAccount = (password: string) => {
    const { importAccountFromFile } = this.props;
    const { accountFile } = this.state;

    importAccountFromFile({
      password,
      accountFile: accountFile!,
    });

    this.setState({ openedImportAccountModal: false });
  };

  setAccountFile = (event: ChangeEvent<HTMLInputElement>) => {
    const accountFile = event?.target?.files?.[0]!;

    importAccountFromFile({
      password: '',
      accountFile,
      additionalActionOnError: () => this.setState({
        accountFile,
        openedImportAccountModal: true,
      }),
    });

    this.props.toggleOpenedAccountMenu();
  };

  closeExportAccountModal = () => {
    this.setState({ openedExportAccountModal: false });
  };

  handleResetAccount = () => {
    const { resetAccount } = this.props;
    if (isWallet) {
      resetAccount({
        password: '',
        additionalActionOnError: () => this.setState({ openedResetAccountModal: true }),
      });
    } else if (isHub) {
      clearApplicationStorage();
      window.location.reload();
    }
  };

  closeResetAccountModal = () => {
    this.setState({ openedResetAccountModal: false });
  };

  // eslint-disable-next-line react/sort-comp
  private accountActionsData: AccountActionType[] = isWallet ? [
    {
      title: t('createNewAccount'),
      action: this.handleCreateAccount,
      Icon: CreateIcon,
    },
    {
      title: t('exportAccount'),
      action: this.handleExportAccount,
      Icon: ExportIcon,
    },
    {
      title: t('importAccount'),
      action: this.handleOpenImportFile,
      Icon: ImportIcon,
    },
    {
      title: t('resetAccount'),
      action: this.handleResetAccount,
      Icon: ResetIcon,
    },
  ] : [{
    title: t('resetAccount'),
    action: this.handleResetAccount,
    Icon: ResetIcon,
  }];

  toggleAccountMenu = () => {
    this.props.toggleOpenedAccountMenu();
  };

  render() {
    const {
      walletAddress,
      className,
      openedMenu,
    } = this.props;

    const {
      openedImportAccountModal,
      openedExportAccountModal,
      openedResetAccountModal,
    } = this.state;

    return <div className={cn(styles.account, className)}>
      <input
        ref={this.setImportAccountRef}
        className={styles.importAccountInput}
        onChange={this.setAccountFile}
        type="file"
      />
      <Drawer
        anchor={'left'}
        open={openedMenu}
        onClose={this.toggleAccountMenu}
        elevation={0}
        ModalProps={this.drawerModalProps}
        classes={this.drawerPaperClasses}
      >
        <div className={styles.accountTitle}>
          {t('myAccount')}
        </div>
        <CopyButton
          textButton={walletAddress}
          className={styles.addressButton}
          iconClassName={styles.copyIcon}
        />
        <AccountActionsList actions={this.accountActionsData} />
        <a
          className={styles.supportLink}
          rel={'noreferrer'}
          target={'_blank'}
          href={'https://t.me/thepower_chat'}
        >
          <SupportIcon />
        </a>
      </Drawer>
      <ImportAccountModal
        open={openedImportAccountModal}
        onClose={this.closeImportAccountModal}
        onSubmit={this.handleImportAccount}
      />
      <ExportAccountModal
        open={openedExportAccountModal}
        onClose={this.closeExportAccountModal}
      />
      <ResetAccountModal
        open={openedResetAccountModal}
        onClose={this.closeResetAccountModal}
      />
      <div
        className={styles.accountDataHolder}
        onClick={this.toggleAccountMenu}
      >
        <img className={styles.img} src={globe} alt="Avatar" />
        <div className={styles.accountText}>
          <p>{walletAddress}</p>
        </div>
      </div>
    </div>;
  }
}

export const Account = connector(AccountComponent);
