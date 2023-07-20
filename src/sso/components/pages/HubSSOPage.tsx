import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { stringToObject } from 'sso/utils';
import { RootState } from 'application/store';
import { getWalletAddress } from 'account/selectors/accountSelectors';
import { setWalletData } from 'account/slice/accountSlice';
import { setKeyToApplicationStorage } from 'application/utils/localStorageUtils';
import { push } from 'connected-react-router';
import { HubRoutesEnum } from 'application/typings/routes';

type OwnProps = RouteComponentProps<{ data?: string }>;

const mapDispatchToProps = {
  setWalletData,
  routeTo: push,
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

class WalletSSOPage extends React.Component<WalletSSOProps> {
  componentDidMount(): void {
    const { parsedData } = this;
    const { setWalletData, routeTo } = this.props;
    if (parsedData?.address) {
      setKeyToApplicationStorage('address', parsedData?.address);
      setWalletData({ wif: '', address: parsedData?.address, logged: true });
      routeTo(HubRoutesEnum.root);
    }
  }

  get parsedData(): { address?: string } | null {
    const { data } = this.props;

    if (data) return stringToObject(data);
    return null;
  }

  render() {
    return (
      null
    );
  }
}

export default connector(WalletSSOPage);
