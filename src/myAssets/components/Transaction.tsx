import React from 'react';
import { format } from 'date-fns';
import cn from 'classnames';
import { Collapse } from '@mui/material';
import { CopyButton, Divider } from 'common';
import { connect, ConnectedProps } from 'react-redux';
import { isArray } from 'lodash';
import { t } from 'i18next';
import { FaucetSvg, SendSvg } from '../../common/icons';
import { RootState } from '../../application/store';
import { getWalletAddress } from '../../account/selectors/accountSelectors';
import { TransactionType } from '../slices/transactionsSlice';
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
import styles from './Transaction.module.scss';

type OwnProps = { trx: TransactionType };

const connector = connect(
  (state: RootState) => ({
    currentAddress: getWalletAddress(state),
  }),
);

type TransactionProps = ConnectedProps<typeof connector> & OwnProps;
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
      { Icon: <SuccessIcon />, key: t('tx'), value: trx.id },
      { Icon: <FromArrowIcon />, key: t('from'), value: trx.from },
      { Icon: <ToArrowIcon />, key: t('to'), value: trx.to },
      { Icon: <CoinIcon />, key: t('amount'), value: trx.amount },
      { Icon: <LogoIcon />, key: t('cur'), value: trx.cur },
      { Icon: <WatchIcon />, key: t('timestamp'), value: format(trx.timestamp, 'MMMM dd, yyyy, \'at\' p') },
      { Icon: <BarCodeIcon />, key: t('seq'), value: trx.seq },
      { Icon: <KeyIcon />, key: t('publicKey'), value: trx?.sigverify?.pubkeys?.[0] },
      { Icon: <FingerPrintIcon />, key: t('signature'), value: trx.sig[trx.sigverify?.pubkeys?.[0]] },
      { Icon: <CubeIcon />, key: t('inBlock'), value: trx.inBlock },
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
                <span className={styles.name}>{t('myWallet')}</span>
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
                  {t('comment')}
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
                  {`${t('transaction')} #${trx.timestamp}`}
                </span>
                <MinimizeIcon className={cn(styles.minimizedIcon, expanded && styles.expandMinimizedIcon)} />
              </div>
              {this.renderGrid()}
              <CopyButton textButton={t('copy')} copyInfo={trx.id} />
            </div>
          </Collapse>
        </div>
        <Divider className={styles.divider} />
      </>
    );
  }
}

export default connector(Transaction);
