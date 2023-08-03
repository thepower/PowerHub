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

import { getWalletAddress } from 'account/selectors/accountSelectors';
import { WalletRoutesEnum } from 'application/typings/routes';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RegistrationTabs } from '../typings/registrationTypes';

import styles from './Registration.module.scss';
import { RegisterForAppsPage } from './pages/loginRegisterAccount/RegisterForAppsPage';

type OwnProps = RouteComponentProps<{ data?: string }>;

const mapStateToProps = (state: RootState, props: OwnProps) => ({
  walletAddress: getWalletAddress(state),
  data: props.match?.params?.data,
});

const mapDispatchToProps = {
  routeTo: push,
  setCreatingCurrentShard,
  generateSeedPhrase,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type RegistrationForAppsPageProps = ConnectedProps<typeof connector> & WithTranslation;

interface RegistrationForAppsPageState {
  enterButtonPressed: boolean;
}

class RegistrationForAppsPageComponent extends
  React.PureComponent<RegistrationForAppsPageProps, RegistrationForAppsPageState> {
  private registrationBreadcrumbs: BreadcrumbsDataType[] = [
    {
      label: this.props.t(RegistrationTabs.loginRegister),
      component: RegisterForAppsPage,
    },
    {
      label: this.props.t(RegistrationTabs.backup),
    },
  ];

  componentDidMount(): void {
    const {
      generateSeedPhrase,
      setCreatingCurrentShard,
      data,
      routeTo,
      walletAddress,
    } = this.props;

    if (walletAddress) {
      routeTo(`${WalletRoutesEnum.sso}/${data}`);
    } else {
      generateSeedPhrase();
      setCreatingCurrentShard(this.parsedData?.chainID || defaultChain);
    }
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

export const RegistrationForAppsPage = withTranslation()(connector(RegistrationForAppsPageComponent));
