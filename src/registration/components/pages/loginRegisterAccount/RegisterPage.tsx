import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { WizardComponentProps } from 'common';
import { RootState } from 'application/store';
import { LoginRegisterAccountTabs } from '../../../typings/registrationTypes';
import { CreateNewAccount } from './CreateNewAccount';
import { setCurrentRegisterCreateAccountTab } from '../../../slice/registrationSlice';
import { LoginToAccount } from './LoginToAccount';
import { getCurrentRegistrationTab } from '../../../selectors/registrationSelectors';
import { ImportAccount } from './import/ImportAccount';

const mapStateToProps = (state: RootState) => ({
  tab: getCurrentRegistrationTab(state),
});

const mapDispatchToProps = {
  setCurrentRegisterCreateAccountTab,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type LoginRegisterAccountProps = ConnectedProps<typeof connector> & WizardComponentProps;

class LoginRegisterAccountComponent extends React.PureComponent<LoginRegisterAccountProps, never> {
  onChangeTab = (_event: React.SyntheticEvent, value: LoginRegisterAccountTabs) => {
    this.props.setCurrentRegisterCreateAccountTab(value);
  };

  render() {
    const { tab, setNextStep, setPrevStep } = this.props;
    switch (tab) {
      case LoginRegisterAccountTabs.create:
        return <CreateNewAccount
          tab={tab}
          onChangeTab={this.onChangeTab}
          setNextStep={setNextStep}
          setPrevStep={setPrevStep}
        />;
      case LoginRegisterAccountTabs.login:
        return <LoginToAccount
          tab={tab}
          onChangeTab={this.onChangeTab}
          setNextStep={setNextStep}
          setPrevStep={setPrevStep}
        />;
      case LoginRegisterAccountTabs.import:
        return <ImportAccount
          tab={tab}
          onChangeTab={this.onChangeTab}
          setNextStep={setNextStep}
          setPrevStep={setPrevStep}
        />;
      default:
        return null;
    }
  }
}

export const RegisterPage = connector(LoginRegisterAccountComponent);
