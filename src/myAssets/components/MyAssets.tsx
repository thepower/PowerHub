import { getWalletAddress } from 'account/selectors/accountSelectors';
import { faucetThePowerUrl, walletThePowerUrl } from 'appConstants';
import { isHub } from 'application/components/AppRoutes';
import {
  CardLink, DeepPageTemplate, Tabs,
} from 'common';
import {
  BuySvg, FaucetSvg, LogoIcon, SendSvg,
} from 'common/icons';
import { getTokens } from 'myAssets/selectors/tokensSelectors';
import { TokenType, updateTokensAmountsTrigger } from 'myAssets/slices/tokensSlice';
import {
  MyAssetsTabs, getMyAssetsTabsLabels, TokenPayloadType,
} from 'myAssets/types';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { ConnectedProps, connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { setShowUnderConstruction } from '../../application/slice/applicationSlice';
import { RootState } from '../../application/store';
import { WalletRoutesEnum } from '../../application/typings/routes';
import { getGroupedWalletTransactions } from '../selectors/transactionsSelectors';
import { getWalletNativeTokensAmounts } from '../selectors/walletSelectors';
import AddButton from './AddButton';
import Asset from './Asset';
import styles from './MyAssets.module.scss';

const connector = connect(
  (state: RootState) => ({
    amounts: getWalletNativeTokensAmounts(state),
    tokens: getTokens(state),
    transactions: getGroupedWalletTransactions(state),
    walletAddress: getWalletAddress(state),
  }),
  {
    updateTokensAmountsTrigger,
    setShowUnderConstruction,
  },
);

type MyAssetsProps = ConnectedProps<typeof connector> & WithTranslation;

type MyAssetsState = {
  tab: MyAssetsTabs;
};

class MyAssets extends React.PureComponent<MyAssetsProps, MyAssetsState> {
  constructor(props: MyAssetsProps) {
    super(props);

    this.state = {
      tab: MyAssetsTabs.PowerNativeTokens,
    };
  }

  componentDidMount() {
    this.props.updateTokensAmountsTrigger();
  }

  onChangeTab = (_event: React.SyntheticEvent, value: MyAssetsTabs) => {
    this.setState({ tab: value });
  };

  renderAssetsList = (assets: TokenType[]) => {
    if (!assets.length) {
      return <div className={styles.noTokens}>
        {this.props.t('yourTokensWillBeHere')}
      </div>;
    }

    return (
      <ul className={styles.tokensList}>
        {assets.map((asset) => (
          <li key={asset.address}>
            <Asset asset={asset} />
          </li>
        ))}
      </ul>);
  };

  handleShowUnderConstruction = (event: React.MouseEvent) => {
    event.preventDefault();
    this.props.setShowUnderConstruction(true);
  };

  render() {
    const {
      amounts, tokens,
    } = this.props;
    const { tab } = this.state;

    const nativeTokens = Object.entries(amounts).map(([symbol, amount]) => ({
      type: 'native',
      name: symbol,
      address: symbol,
      symbol,
      decimals: 9,
      amount,
    }) as TokenPayloadType);

    const erc20tokens = tokens.filter((token) => token.isShow);

    const tokensMap = {
      [MyAssetsTabs.PowerNativeTokens]: nativeTokens,
      [MyAssetsTabs.Erc20]: erc20tokens,
      // [MyAssetsTabs.NFT]: [],/my-assets
    };

    const currentTokens = tokensMap[tab];

    return (
      <DeepPageTemplate topBarTitle={this.props.t('myAssets')} backUrl="/" backUrlText={this.props.t('home')!}>
        <div className={styles.panel}>
          <div className={styles.info}>
            <p className={styles.title}>{this.props.t('totalBalance')}</p>
            <p className={styles.balance}>
              <LogoIcon className={styles.icon} />
              {!amounts?.SK || amounts?.SK === '0' ? <span className={styles.emptyTitle}>{this.props.t('yourTokensWillBeHere')}</span> : amounts?.SK}
            </p>
          </div>
          <div className={styles.linksGroup}>
            <CardLink
              label={this.props.t('faucet')}
              isAnchor
              to={faucetThePowerUrl}
              target="_blank"
              rel="noreferrer"
            >
              <FaucetSvg />
            </CardLink>
            <CardLink
              isAnchor={isHub}
              to={isHub
                ? `${walletThePowerUrl}${WalletRoutesEnum.myAssets}${WalletRoutesEnum.assetSelection}`
                : `${WalletRoutesEnum.myAssets}${WalletRoutesEnum.assetSelection}`}
              label={this.props.t('send')}
              target={isHub ? '_blank' : '_self'}
              rel="noreferrer"
            >
              <SendSvg />
            </CardLink>
            <CardLink
              onClick={this.handleShowUnderConstruction}
              isAnchor={isHub}
              to={isHub
                ? `${walletThePowerUrl}${WalletRoutesEnum.buy}`
                : WalletRoutesEnum.buy}
              label={this.props.t('buy')}
              target={isHub ? '_blank' : '_self'}
            >
              <BuySvg />
            </CardLink>
          </div>
        </div>
        <Link className={styles.myAssetsAddAssetsButton} to={`${WalletRoutesEnum.myAssets}${WalletRoutesEnum.add}`}>
          <AddButton>{this.props.t('addAssets')}</AddButton>
        </Link>
        <Tabs
          tabs={MyAssetsTabs}
          tabsLabels={getMyAssetsTabsLabels()}
          value={tab}
          onChange={this.onChangeTab}
          tabsRootClassName={styles.myAssetsTabsRoot}
          tabsHolderClassName={styles.myAssetsTabsHolder}
          tabClassName={styles.myAssetsTab}
          tabIndicatorClassName={styles.myAssetsTabIndicator}
          tabSelectedClassName={styles.myAssetsTabSelected}
        />
        <div className={styles.tokens}>
          {this.renderAssetsList(currentTokens)}
        </div>
      </DeepPageTemplate>
    );
  }
}

export default withTranslation()(connector(MyAssets));
