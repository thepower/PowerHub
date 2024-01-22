import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { Button, DeepPageTemplate } from 'common';

import { RootState } from 'application/store';
import { WalletRoutesEnum } from 'application/typings/routes';
import Asset from 'myAssets/components/Asset';
import { getTokenByID, getTokens } from 'myAssets/selectors/tokensSelectors';
import { getWalletNativeTokensAmountByID, getWalletNativeTokensAmounts } from 'myAssets/selectors/walletSelectors';
import {
  addTokenTrigger, toggleTokenShow,
  TokenType,
  updateTokensAmountsTrigger,
} from 'myAssets/slices/tokensSlice';
import { TokenPayloadType } from 'myAssets/types';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styles from './AssetSelectionPage.module.scss';

const mapDispatchToProps = {
  addTokenTrigger,
  toggleTokenShow,
  updateTokensAmountsTrigger,
};

const mapStateToProps = (state: RootState) => ({
  amounts: getWalletNativeTokensAmounts(state),
  tokens: getTokens(state),
  getTokenByID: (address: string) => getTokenByID(state, address),
  getWalletNativeTokensAmountByID: (symbol: string) => getWalletNativeTokensAmountByID(state, symbol),
});

interface AssetSelectionPageState {
  selectedAsset: string;
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type AssetSelectionPageProps = ConnectedProps<typeof connector> & WithTranslation;

class AssetSelectionPageComponent extends React.PureComponent<AssetSelectionPageProps, AssetSelectionPageState> {
  constructor(props: AssetSelectionPageProps) {
    super(props);

    this.state = {
      selectedAsset: '',
    };
  }

  componentDidMount() {
    this.props.updateTokensAmountsTrigger();
  }

  onClickCheckBox = (value: string) => {
    const { selectedAsset } = this.state;
    this.setState({ selectedAsset: selectedAsset === value ? '' : value });
  };

  renderAssetsList = (assets: TokenType[]) => {
    const { state, onClickCheckBox } = this;
    return (
      <ul className={styles.tokensList}>
        {assets.map((token) => (
          <li key={token.address}>
            <Asset
              asset={token}
              isCheckBoxChecked={token.type === 'native' ?
                state.selectedAsset === token.symbol :
                state.selectedAsset === token.address}
              onClickCheckBox={onClickCheckBox}
            />
          </li>))}
      </ul>);
  };

  render() {
    const {
      tokens: erc20Tokens, getTokenByID, getWalletNativeTokensAmountByID, amounts,
    } = this.props;
    const { selectedAsset } = this.state;

    const nativeTokens = Object.entries(amounts).map(([symbol, amount]) => ({
      type: 'native',
      name: symbol,
      address: symbol,
      symbol,
      decimals: '9',
      amount,
    }) as TokenPayloadType);

    const nativeAssetAmount = getWalletNativeTokensAmountByID(selectedAsset);
    const asset = getTokenByID(selectedAsset);
    const assetIndetifier = nativeAssetAmount ? selectedAsset : asset?.address;
    const assetType = nativeAssetAmount ? 'native' : asset?.type;
    return (
      <DeepPageTemplate topBarTitle={this.props.t('assetSelection')} backUrl="/my-assets" backUrlText={this.props.t('myAssets')!}>
        <div className={styles.assetSelection}>
          <div className={styles.tokens}>{this.renderAssetsList([...nativeTokens, ...erc20Tokens])}</div>
          <Link to={`${WalletRoutesEnum.myAssets}/${assetType}/${assetIndetifier}${WalletRoutesEnum.send}`}>
            <Button disabled={!asset && !nativeAssetAmount} className={styles.assetSelectionFixedButton} variant="filled">{this.props.t('next')}</Button>
          </Link>
        </div>
      </DeepPageTemplate>
    );
  }
}

export const AssetSelectionPage = withTranslation()(connector(AssetSelectionPageComponent));
