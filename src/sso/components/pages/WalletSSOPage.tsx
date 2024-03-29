import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { objectToString, stringToObject } from 'sso/utils';

import { RootState } from 'application/store';
import { getWalletAddress } from 'account/selectors/accountSelectors';
import { push } from 'connected-react-router';
import { WalletRoutesEnum } from 'application/typings/routes';

type OwnProps = RouteComponentProps<{ data?: string }>;

const mapDispatchToProps = {
};

const mapStateToProps = (state: RootState, props: OwnProps) => ({
  data: props.match.params.data,
  address: getWalletAddress(state),
  routeTo: push,
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps,
);

type WalletSSOProps = ConnectedProps<typeof connector>;

type WalletSSOState = {
  isConfirmModalOpen: boolean;
};

class WalletSSOPage extends React.Component<WalletSSOProps, WalletSSOState> {
  componentDidMount(): void {
    const { parsedData } = this;
    const { address, routeTo } = this.props;

    if (!address) {
      routeTo(WalletRoutesEnum.signup);
    } else {
      const stringData = objectToString({ address, returnUrl: parsedData?.returnUrl });
      if (parsedData?.callbackUrl) {
        window.location.replace(`${parsedData.callbackUrl}sso/${stringData}`);
      }
    }
  }

  get parsedData(): { callbackUrl?: string, returnUrl?: string } | null {
    const { data } = this.props;

    if (data) return stringToObject(data);
    return null;
  }

  render() {
    return null;
  }
}

export default connector(WalletSSOPage);
