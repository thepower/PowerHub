import React from 'react';
import { WizardComponentProps } from 'common';

import { CreateNewAccountForApps } from './CreateNewAccountForApps';

type LoginRegisterAccountProps = WizardComponentProps;

class LoginRegisterAccountComponent extends React.PureComponent<LoginRegisterAccountProps> {
  render() {
    return <CreateNewAccountForApps />;
  }
}

export const RegisterForAppsPage = LoginRegisterAccountComponent;
