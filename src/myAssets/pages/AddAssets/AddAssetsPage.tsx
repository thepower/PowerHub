import { push } from 'connected-react-router';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { OutlinedInput } from '@mui/material';
import { RootState } from 'application/store';
import { Button, DeepPageTemplate, Tabs } from 'common';
import Asset from 'myAssets/components/Asset';
import { getTokens } from 'myAssets/selectors/tokensSelectors';
import { getWalletNativeTokensAmounts } from 'myAssets/selectors/walletSelectors';
import { addTokenTrigger, toggleTokenShow, TokenType } from 'myAssets/slices/tokensSlice';
import {
  AddAssetsTabs, getAddAssetsTabsLabels,
} from 'myAssets/types';
import { WithTranslation, withTranslation } from 'react-i18next';
import SearchInput from '../../../common/searchInput/SearchInput';
import styles from './AddAssetsPage.module.scss';

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
type AddAssetsPageProps = ConnectedProps<typeof connector> & WithTranslation;

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

  renderAssetsList = (assets: TokenType[]) => {
    const { toggleTokenShow } = this.props;

    if (!assets.length && this.state.search) {
      return (
        <div className={styles.noTokens}>
          {this.props.t('assetNotFound')}
        </div>);
    }
    if (!assets.length) {
      return (
        <div className={styles.noTokens}>
          {this.props.t('yourTokensWillBeHere')}
        </div>);
    }
    return (
      <ul className={styles.tokensList}>
        {assets.map((asset) => (
          <li key={asset.address}>
            <Asset
              asset={asset}
              onClickSwitch={() => toggleTokenShow({ address: asset.address, isShow: !asset.isShow })}
            />
          </li>
        ))}
      </ul>);
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
          {this.props.t('youCanAddAnyStandardToken')}
        </div>

        <OutlinedInput
          placeholder={this.props.t('assetsAddress')!}
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
          {this.props.t('addAssets')}
        </Button>
      </div>);
  };

  render() {
    const { tokens } = this.props;
    const { tab, search } = this.state;
    const erc20tokens = tokens.filter((token) => token.isShow && token.type === 'erc20');
    const erc721tokens = tokens.filter((token) => token.isShow && token.type === 'erc721');

    const tokensMap = {
      [AddAssetsTabs.Erc20]: erc20tokens,
      [AddAssetsTabs.Erc721]: erc721tokens,
      [AddAssetsTabs.AddAssets]: [],
    };

    const currentTokens = tokensMap[tab];

    const filteredAssets = currentTokens?.filter((token) => {
      const regexp = new RegExp(search, 'gmi');
      const stringifiedToken = JSON.stringify(token);
      return !search || regexp.test(stringifiedToken);
    });

    return (
      <DeepPageTemplate topBarTitle={this.props.t('addAssets')} backUrl="/my-assets" backUrlText={this.props.t('myAssets')!}>
        <div className={styles.addAssetsPage}>
          <SearchInput
            className={styles.addAssetsPageSearchInput}
            onClickSearch={() => {}}
            onChange={this.onChangeSearchInput}
            value={search}
          />
          <Tabs
            tabs={AddAssetsTabs}
            tabsLabels={getAddAssetsTabsLabels()}
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
            : <div className={styles.tokens}>{this.renderAssetsList(filteredAssets)}</div>}
        </div>
      </DeepPageTemplate>
    );
  }
}

export const AddAssetsPage = withTranslation()(connector(AddAssetsPageComponent));
