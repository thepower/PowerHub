import {
  BreadcrumbsDataType,
  BreadcrumbsTypeEnum,
  Button,
  LangSelect,
  PELogoWithTitle,
  Wizard,
} from 'common';
import { push } from 'connected-react-router';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { ConnectedProps, connect } from 'react-redux';
import { WalletRoutesEnum } from '../../application/typings/routes';
import { getRegistrationTabs } from '../typings/registrationTypes';
import styles from './Registration.module.scss';
import { BeAware } from './pages/BeAware';
import { QuickGuide } from './pages/QuickGuide';
import { Backup } from './pages/backup/Backup';
import { RegisterPage } from './pages/loginRegisterAccount/RegisterPage';

const mapDispatchToProps = {
  routeTo: push,
};

const connector = connect(null, mapDispatchToProps);
type RegistrationPageProps = ConnectedProps<typeof connector> & WithTranslation;

interface RegistrationPageState {
  enterButtonPressed: boolean;
}

class RegistrationPageComponent extends React.PureComponent<RegistrationPageProps, RegistrationPageState> {
  constructor(props: RegistrationPageProps) {
    super(props);
    this.state = {
      enterButtonPressed: false,
    };
  }

  getRegistrationBreadcrumbs: () => BreadcrumbsDataType[] = () => [
    {
      label: getRegistrationTabs().quickGuide,
      component: QuickGuide,
    },
    {
      label: getRegistrationTabs().beAware,
      component: BeAware,
    },
    {
      label: getRegistrationTabs().loginRegister,
      component: RegisterPage,
    },
    {
      label: getRegistrationTabs().backup,
      component: Backup,
    },
  ];

  handleProceedToRegistration = () => {
    this.setState({ enterButtonPressed: true });
  };

  handleProceedToLogin = () => {
    this.props.routeTo(WalletRoutesEnum.login);
  };

  renderWelcome = () => (
    <>
      <div className={styles.registrationTitle}>{'Power Hub'}</div>
      <div className={styles.registrationDesc}>
        {this.props.t('registrationPageDesc')}
      </div>
      <div className={styles.buttonsHolder}>
        <Button
          size="large"
          variant="filled"
          className={styles.loginButton}
          type="button"
          onClick={this.handleProceedToRegistration}
        >
          {this.props.t('registrationPageJoinButton')}
        </Button>
        <Button
          size="large"
          variant="outlined"
          className={styles.loginButton}
          type="button"
          onClick={this.handleProceedToLogin}
        >
          {this.props.t('registrationPageImportAccountButton')}
        </Button>
      </div>
    </>
  );

  renderRegistration = () => (
    <div className={styles.registrationWizardComponent}>
      <PELogoWithTitle className={styles.registrationPageIcon} />
      <div className={styles.registrationWizardHolder}>
        <Wizard
          className={styles.registrationWizard}
          breadcrumbs={this.getRegistrationBreadcrumbs()}
          type={BreadcrumbsTypeEnum.direction}
          breadCrumbHasBorder
        />
      </div>
    </div>
  );

  render() {
    const { enterButtonPressed } = this.state;

    return <div className={styles.registrationPage}>
      <div className={styles.registrationPageCover} />
      <LangSelect
        className={styles.langSelect}
      />
      {enterButtonPressed ? this.renderRegistration() : this.renderWelcome()}
    </div>;
  }
}

export const RegistrationPage = withTranslation()(connector(RegistrationPageComponent));
