import React from 'react';
import { push } from 'connected-react-router';
import { connect, ConnectedProps } from 'react-redux';

import { DeepPageTemplate, Tabs, Button } from 'common';
import {
  AddAssetsTabs, AddAssetsTabsLabels,
} from 'myAssets/types';
import { RootState } from 'application/store';
import { getWalletNativeTokensAmounts } from 'myAssets/selectors/walletSelectors';
import { TokenType, addTokenTrigger, toggleTokenShow } from 'myAssets/slices/tokensSlice';
import Token from 'myAssets/components/Token';
import { OutlinedInput } from '@mui/material';
import { getTokens } from 'myAssets/selectors/tokensSelectors';
import styles from './AddAssetsPage.module.scss';
import SearchInput from '../../../common/searchInput/SearchInput';

const mapDispatchToProps = {
  routeTo: push,
  addTokenTrigger,
  toggleTokenShow,
};

const mapStateToProps = (state: RootState) => ({
  amounts: getWalletNativeTokensAmounts(state),
  tokens: getTokens(state),
});

interface AddAssetsPageState {
  search: string;
  address: string;
  tab: AddAssetsTabs;
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type AddAssetsPageProps = ConnectedProps<typeof connector>;

class AddAssetsPageComponent extends React.PureComponent<AddAssetsPageProps, AddAssetsPageState> {
  constructor(props: AddAssetsPageProps) {
    super(props);

    this.state = {
      address: '',
      search: '',
      tab: AddAssetsTabs.Erc20,
    };
  }

  onChangeTab = (_event: React.SyntheticEvent, value: AddAssetsTabs) => {
    this.setState({ tab: value });
  };

  onChangeAddressInput = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    this.setState({ address: e.target.value });
  };

  onChangeSearchInput = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    this.setState({ search: e.target.value });
  };

  renderTokensList = (tokens: TokenType[]) => {
    const { toggleTokenShow } = this.props;
    return <ul className={styles.tokensList}>
      {tokens.map((token) => (
        <li key={token.address}>
          <Token
            token={token}
            onClickSwitch={() => toggleTokenShow({ address: token.address, isShow: !token.isShow })}
          />
        </li>
      ))}
    </ul>;
  };

  renderAddAssetsForm = () => {
    const {
      onChangeAddressInput, props, state,
    } = this;
    const { addTokenTrigger } = props;
    const { address } = state;
    return (
      <div className={styles.addAssetsPageForm}>
        <div className={styles.addAssetsPageFormTip}>
          You can add any standard token or standard asset....................................................
          Enter the address, scan the code and click &quot;add asset&quot;
        </div>

        <OutlinedInput
          placeholder="Assets adress"
          fullWidth
          size="small"
          className={styles.addAssetsPageFormInput}
          value={address}
          onChange={onChangeAddressInput}
        />
        <Button
          className={styles.addAssetsPageFormButton}
          onClick={() => addTokenTrigger(address)}
          variant="filled"
          disabled={!address}
        >
          Add assets
        </Button>
      </div>);
  };

  render() {
    const { tokens: erc20Tokens } = this.props;
    const { tab, search } = this.state;

    const tokensMap = {
      [AddAssetsTabs.Erc20]: erc20Tokens,
      // [AddAssetsTabs.NFT]: [],
      [AddAssetsTabs.AddAssets]: [],
    };

    const currentTokens = tokensMap[tab];

    const filteredTokens = currentTokens?.filter((token) => {
      const regexp = new RegExp(search, 'gmi');
      const stringifiedToken = JSON.stringify(token);
      return !search || regexp.test(stringifiedToken);
    });

    return (
      <DeepPageTemplate topBarTitle="Add assets" backUrl="/my-assets" backUrlText="My assets">
        <div className={styles.addAssetsPage}>
          <SearchInput
            className={styles.addAssetsPageSearchInput}
            onClickSearch={() => {}}
            onChange={this.onChangeSearchInput}
            value={search}
          />
          <Tabs
            tabs={AddAssetsTabs}
            tabsLabels={AddAssetsTabsLabels}
            value={tab}
            onChange={this.onChangeTab}
            tabsRootClassName={styles.addAssetsPageTabsRoot}
            tabsHolderClassName={styles.addAssetsPageTabsHolder}
            tabClassName={styles.addAssetsPageTab}
            tabIndicatorClassName={styles.addAssetsPageTabIndicator}
            tabSelectedClassName={styles.addAssetsPageTabSelected}
          />
          {tab === AddAssetsTabs.AddAssets
            ? this.renderAddAssetsForm()
            : <div className={styles.tokens}>{this.renderTokensList(filteredTokens)}</div>}
        </div>
      </DeepPageTemplate>
    );
  }
}

export const AddAssetsPage = connector(AddAssetsPageComponent);
