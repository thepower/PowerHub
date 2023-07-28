import { Collapse } from '@mui/material';
import cn from 'classnames';
import { CopyButton, Divider } from 'common';
import { format } from 'date-fns';
import { isArray } from 'lodash';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { ConnectedProps, connect } from 'react-redux';
import { getWalletAddress } from '../../account/selectors/accountSelectors';
import { RootState } from '../../application/store';
import { FaucetSvg, SendSvg } from '../../common/icons';
import { TransactionType } from '../slices/transactionsSlice';
import styles from './Transaction.module.scss';
import {
  BarCodeIcon,
  CoinIcon,
  CubeIcon,
  FingerPrintIcon,
  FromArrowIcon,
  KeyIcon,
  LogoIcon,
  MinimizeIcon,
  SuccessIcon,
  ToArrowIcon,
  WatchIcon,
} from './icons';

type OwnProps = { trx: TransactionType };

const connector = connect(
  (state: RootState) => ({
    currentAddress: getWalletAddress(state),
  }),
);

type TransactionProps = ConnectedProps<typeof connector> & OwnProps & WithTranslation;
type TransactionState = { expanded: boolean };

class Transaction extends React.PureComponent<TransactionProps, TransactionState> {
  constructor(props: TransactionProps) {
    super(props);

    this.state = {
      expanded: false,
    };
  }

  handleClick = () => {
    this.setState((prevState) => ({ expanded: !prevState.expanded }));
  };

  handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      this.setState((prevState) => ({ expanded: !prevState.expanded }));
    }
  };

  renderGrid = () => {
    const { trx } = this.props;

    const rows = [
      { Icon: <SuccessIcon />, key: this.props.t('tx'), value: trx.id },
      { Icon: <FromArrowIcon />, key: this.props.t('from'), value: trx.from },
      { Icon: <ToArrowIcon />, key: this.props.t('to'), value: trx.to },
      { Icon: <CoinIcon />, key: this.props.t('amount'), value: trx.amount },
      { Icon: <LogoIcon />, key: this.props.t('cur'), value: trx.cur },
      { Icon: <WatchIcon />, key: this.props.t('timestamp'), value: format(trx.timestamp, 'MMMM dd, yyyy, \'at\' p') },
      { Icon: <BarCodeIcon />, key: this.props.t('seq'), value: trx.seq },
      { Icon: <KeyIcon />, key: this.props.t('publicKey'), value: trx?.sigverify?.pubkeys?.[0] },
      { Icon: <FingerPrintIcon />, key: this.props.t('signature'), value: trx.sig[trx.sigverify?.pubkeys?.[0]] },
      { Icon: <CubeIcon />, key: this.props.t('inBlock'), value: trx.inBlock },
    ];

    return (
      <div className={styles.grid}>
        {rows.map(({ Icon, key, value }) => (
          <React.Fragment key={key}>
            {Icon}
            <span className={styles.key}>{`${key}:`}</span>
            <span className={styles.value}>{value}</span>
          </React.Fragment>
        ))}
      </div>
    );
  };

  render() {
    const { trx, currentAddress } = this.props;
    const { expanded } = this.state;
    const isReceived = currentAddress === trx.to;

    return (
      <>
        <div className={styles.transaction} aria-expanded={expanded}>
          <div
            className={styles.shortInfoButton}
            onClick={this.handleClick}
            onKeyDown={this.handleKeyDown}
            tabIndex={0}
            role="button"
          >
            <div className={styles.row}>
              <div className={cn(styles.icon)}>
                {isReceived
                  ? <FaucetSvg className={styles.receiveIcon} />
                  : <SendSvg className={styles.sendIcon} />}
              </div>
              <div className={styles.info}>
                <span className={styles.name}>{this.props.t('myWallet')}</span>
                <span className={cn(styles.date, styles.fullDate)}>
                  {format(trx.timestamp, 'dd MMM yyyy \'at\' p')}
                </span>
                <span className={cn(styles.date, styles.compactDate)}>
                  {format(trx.timestamp, '\'at\' p')}
                </span>
              </div>
              <span className={styles.amount}>
                {`${isReceived ? '+' : '-'} ${trx.amount.toFixed(2)} ${trx.cur}`}
              </span>
            </div>
            {!isArray(trx.txext) && (
              <div className={styles.comment}>
                <div className={styles.commentTitle}>
                  {this.props.t('comment')}
                </div>
                <div className={styles.msg}>
                  {trx.txext.msg}
                </div>
              </div>
            )}
          </div>
          <Collapse in={expanded}>
            <div className={styles.content}>
              <div
                role="button"
                tabIndex={0}
                className={styles.row}
                onClick={this.handleClick}
                onKeyDown={this.handleKeyDown}
              >
                <span className={styles.title}>
                  {`${this.props.t('transaction')} #${trx.timestamp}`}
                </span>
                <MinimizeIcon className={cn(styles.minimizedIcon, expanded && styles.expandMinimizedIcon)} />
              </div>
              {this.renderGrid()}
              <CopyButton textButton={this.props.t('copy')} copyInfo={trx.id} />
            </div>
          </Collapse>
        </div>
        <Divider className={styles.divider} />
      </>
    );
  }
}

export default withTranslation()(connector(Transaction));
