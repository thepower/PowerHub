import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { objectToString, stringToObject } from 'sso/utils';

import { RootState } from 'application/store';
import { getWalletAddress } from 'account/selectors/accountSelectors';

type OwnProps = RouteComponentProps<{ data?: string }>;

const mapDispatchToProps = {
};

const mapStateToProps = (state: RootState, props: OwnProps) => ({
  data: props.match.params.data,
  address: getWalletAddress(state),
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
    const { address } = this.props;
    const stringData = objectToString({ address });
    if (parsedData?.callbackUrl) {
      window.location.replace(`${parsedData.callbackUrl}sso/${stringData}`);
    }
  }

  get parsedData(): { callbackUrl?: string } | null {
    const { data } = this.props;

    if (data) return stringToObject(data);
    return null;
  }

  render() {
    return null;
  }
}

export default connector(WalletSSOPage);
