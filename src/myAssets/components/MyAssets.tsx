import React from 'react';
import {
  CardLink, DeepPageTemplate, Tabs,
} from 'common';
import {
  BuySvg, FaucetSvg, LogoIcon, SendSvg,
} from 'common/icons';
import { connect, ConnectedProps } from 'react-redux';
import {
  MyAssetsTabs, MyAssetsTabsLabels, TokenPayloadType,
} from 'myAssets/types';
import { TokenType, updateTokensAmountsTrigger } from 'myAssets/slices/tokensSlice';
import { Link } from 'react-router-dom';
import { getTokens } from 'myAssets/selectors/tokensSelectors';
import { RootState } from '../../application/store';
import { getWalletNativeTokensAmounts } from '../selectors/walletSelectors';
import { getGroupedWalletTransactions } from '../selectors/transactionsSelectors';
import styles from './MyAssets.module.scss';
import { setShowUnderConstruction } from '../../application/slice/applicationSlice';
import { RoutesEnum } from '../../application/typings/routes';
import Asset from './Asset';
import AddButton from './AddButton';

const connector = connect(
  (state: RootState) => ({
    amounts: getWalletNativeTokensAmounts(state),
    tokens: getTokens(state),
    transactions: getGroupedWalletTransactions(state),
  }),
  {
    updateTokensAmountsTrigger,
    setShowUnderConstruction,
  },
);

type MyAssetsProps = ConnectedProps<typeof connector>;

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

  renderAssetsList = (assets: TokenType[]) => (
    <ul className={styles.tokensList}>
      {assets.map((asset) => (
        <li key={asset.address}>
          <Asset asset={asset} />
        </li>
      ))}
    </ul>
  );

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
      // [MyAssetsTabs.NFT]: [],
    };

    const currentTokens = tokensMap[tab];

    return (
      <DeepPageTemplate topBarTitle="My Assets" backUrl="/" backUrlText="Home">
        <div className={styles.panel}>
          <div className={styles.info}>
            <p className={styles.title}>{'Total balance'}</p>
            <p className={styles.balance}>
              <LogoIcon className={styles.icon} />
              {amounts?.SK === '0' ? <span className={styles.emptyTitle}>Your tokens will be here</span> : amounts?.SK}
            </p>
          </div>
          <div className={styles.linksGroup}>
            <CardLink label="Faucet" isAnchor to="https://faucet.thepower.io/" target="_blank" rel="noreferrer">
              <FaucetSvg />
            </CardLink>
            <CardLink to={`${RoutesEnum.myAssets}${RoutesEnum.assetSelection}`} label="Send">
              <SendSvg />
            </CardLink>
            <CardLink onClick={this.handleShowUnderConstruction} to="/buy" label="Buy">
              <BuySvg />
            </CardLink>
          </div>
        </div>
        <Link className={styles.myAssetsAddAssetsButton} to={`${RoutesEnum.myAssets}${RoutesEnum.add}`}>
          <AddButton>Add assets</AddButton>
        </Link>
        <Tabs
          tabs={MyAssetsTabs}
          tabsLabels={MyAssetsTabsLabels}
          value={tab}
          onChange={this.onChangeTab}
          tabsRootClassName={styles.myAssetsTabsRoot}
          tabsHolderClassName={styles.myAssetsTabsHolder}
          tabClassName={styles.myAssetsTab}
          tabIndicatorClassName={styles.myAssetsTabIndicator}
          tabSelectedClassName={styles.myAssetsTabSelected}
        />
        <div className={styles.tokens}>{this.renderAssetsList(currentTokens)}</div>
      </DeepPageTemplate>
    );
  }
}

export default connector(MyAssets);
