import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { WizardComponentProps } from 'common';
import { RootState } from 'application/store';

import { CreateNewAccountForApps } from './CreateNewAccountForApps';

import {
  getCurrentCreatingStep,
  getCurrentRegistrationTab,
  getCurrentShardSelector,
  getLoginData,
} from '../../../selectors/registrationSelectors';

const mapStateToProps = (state: RootState) => ({
  tab: getCurrentRegistrationTab(state),
  currentShard: getCurrentShardSelector(state),
  creatingStep: getCurrentCreatingStep(state),
  ...getLoginData(state),
});

const connector = connect(mapStateToProps, null);
type LoginRegisterAccountProps = ConnectedProps<typeof connector> & WizardComponentProps;

interface LoginRegisterAccountState {
  isMobile: boolean;
}

class LoginRegisterAccountComponent extends React.PureComponent<LoginRegisterAccountProps, LoginRegisterAccountState> {
  render() {
    const { randomChain } = this.props;

    return <CreateNewAccountForApps
      randomChain={randomChain}
    />;
  }
}

export const RegisterForAppsPage = connector(LoginRegisterAccountComponent);
