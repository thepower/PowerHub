import React from 'react';
import {
  CardLink, DeepPageTemplate, Divider, FullScreenLoader, Tabs,
  Switch,
} from 'common';
import {
  BuySvg, FaucetSvg, LogoIcon, SendSvg,
} from 'common/icons';
// import { InView } from 'react-intersection-observer';
import { connect, ConnectedProps } from 'react-redux';
import { MyAssetsTabs, MyAssetsTabsLabels, TokenKind } from 'myAssets/types';
import { TokenType } from 'myAssets/slices/tokensSlice';
import { RootState } from '../../application/store';
import { loadTransactionsTrigger } from '../slices/walletSlice';
import { checkIfLoading } from '../../network/selectors';
import { getWalletNativeTokensAmounts } from '../selectors/walletSelectors';
// import Transaction from './Transaction';
import { getGroupedWalletTransactions } from '../selectors/transactionsSelectors';
import styles from './MyAssets.module.scss';
// import { TransactionType } from '../slices/transactionsSlice';
import { setShowUnderConstruction } from '../../application/slice/applicationSlice';
import { RoutesEnum } from '../../application/typings/routes';
import Token from './Token';

const connector = connect(
  (state: RootState) => ({
    amounts: getWalletNativeTokensAmounts(state),
    loading: checkIfLoading(state, loadTransactionsTrigger.type),
    transactions: getGroupedWalletTransactions(state),
  }),
  {
    loadTransactionsTrigger,
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
    this.props.loadTransactionsTrigger();
  }

  onChangeTab = (_event: React.SyntheticEvent, value: MyAssetsTabs) => {
    this.setState({ tab: value });
  };

  // handleChangeView = (inView: boolean) => {
  //   if (inView) {
  //     this.props.loadTransactionsTrigger();
  //   }
  // };

  // renderTransactionsList = ([date, transactions]: [date: string, transactions: TransactionType[]]) => (
  //   <li key={date}>
  //     <p className={styles.date}>{date}</p>
  //     <ul className={styles.transactionsList}>
  //       {transactions.map((trx) => (
  //         <li key={trx.id}>
  //           <Transaction trx={trx} />
  //         </li>
  //       ))}
  //     </ul>
  //   </li>
  // );

  renderTokensList = (tokens: TokenType[]) => (
    <ul className={styles.tokensList}>
      {tokens.map((token) => (
        <li key={token.address}>
          <Token token={token} />
        </li>
      ))}
    </ul>
  );

  handleShowUnderConstruction = (event: React.MouseEvent) => {
    event.preventDefault();
    this.props.setShowUnderConstruction(true);
  };

  render() {
    const { amounts, loading, transactions } = this.props;
    const { tab } = this.state;

    if (loading && !Object.keys(transactions).length) {
      return <FullScreenLoader />;
    }

    const nativeTokens = Object.entries(amounts).map(([symbol, amount]) => ({
      type: 'native' as TokenKind,
      name: symbol,
      address: symbol,
      symbol,
      decimals: 9,
      amount,
    }));

    const tokensMap = {
      [MyAssetsTabs.PowerNativeTokens]: nativeTokens,
      [MyAssetsTabs.Erc20]: [],
      [MyAssetsTabs.NFT]: [],
    };

    const tokens = tokensMap[tab];

    return (
      <DeepPageTemplate topBarTitle="My Assets" backUrl="/">
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
            <CardLink to={`${RoutesEnum.myAssets}${RoutesEnum.send}`} label="Send">
              <SendSvg />
            </CardLink>
            <CardLink onClick={this.handleShowUnderConstruction} to="/buy" label="Buy">
              <BuySvg />
            </CardLink>
          </div>
        </div>
        <Divider />
        <Switch />
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
        <div className={styles.tokens}>{this.renderTokensList(tokens)}</div>
        {/* <div className={styles.transactions}>
          <p className={styles.pageTitle}>
            {Object.entries(transactions).length
              ? 'Transaction history'
              : 'Make the first transaction and they will be reflected below'}
          </p>
          <Divider />
          <ul className={styles.groupByDates}>{Object.entries(transactions).map(this.renderTransactionsList)}</ul>
        </div>
        <InView onChange={this.handleChangeView}>
          <div />
        </InView> */}
      </DeepPageTemplate>
    );
  }
}

export default connector(MyAssets);
