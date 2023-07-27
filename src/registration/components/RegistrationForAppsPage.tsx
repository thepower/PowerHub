import React from 'react';
import { push } from 'connected-react-router';
import { connect, ConnectedProps } from 'react-redux';
import {
  BreadcrumbsDataType,
  BreadcrumbsTypeEnum,
  PELogoWithTitle,
  Wizard,
} from 'common';
import {
  generateSeedPhrase,
  setCreatingCurrentShard,
} from 'registration/slice/registrationSlice';
import { defaultChain } from 'application/sagas/initApplicationSaga';
import { stringToObject } from 'sso/utils';
import { RootState } from 'application/store';
import { RouteComponentProps } from 'react-router';

import { RegistrationTabs } from '../typings/registrationTypes';

import styles from './Registration.module.scss';
import { RegisterForAppsPage } from './pages/loginRegisterAccount/RegisterForAppsPage';

type OwnProps = RouteComponentProps<{ data?: string }>;

const mapStateToProps = (state: RootState, props: OwnProps) => ({
  data: props.match.params.data,
});

const mapDispatchToProps = {
  routeTo: push,
  setCreatingCurrentShard,
  generateSeedPhrase,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type RegistrationForAppsPageProps = ConnectedProps<typeof connector>;

interface RegistrationForAppsPageState {
  enterButtonPressed: boolean;
}

class RegistrationForAppsPageComponent extends
  React.PureComponent<RegistrationForAppsPageProps, RegistrationForAppsPageState> {
  private registrationBreadcrumbs: BreadcrumbsDataType[] = [
    {
      label: RegistrationTabs.loginRegister,
      component: RegisterForAppsPage,
    },
    {
      label: RegistrationTabs.backup,
    },
  ];

  componentDidMount(): void {
    const {
      generateSeedPhrase,
      setCreatingCurrentShard,
    } = this.props;

    generateSeedPhrase();
    setCreatingCurrentShard(this.parsedData?.chainID || defaultChain);
  }

  get parsedData(): { chainID: number, callbackUrl?: string } | null {
    const { data } = this.props;

    if (data) return stringToObject(data);
    return null;
  }

  renderRegistration = () => (
    <div className={styles.registrationWizardComponent}>
      <PELogoWithTitle className={styles.registrationPageIcon} />
      <div className={styles.registrationWizardHolder}>
        <Wizard
          className={styles.registrationWizard}
          breadcrumbs={this.registrationBreadcrumbs}
          type={BreadcrumbsTypeEnum.direction}
          breadCrumbHasBorder
        />
      </div>
    </div>
  );

  render() {
    return <div className={styles.registrationPage}>
      <div className={styles.registrationPageCover} />
      {this.renderRegistration()}
    </div>;
  }
}

export const RegistrationForAppsPage = connector(RegistrationForAppsPageComponent);