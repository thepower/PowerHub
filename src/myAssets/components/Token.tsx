import React from 'react';
import { TokenType } from 'myAssets/slices/tokensSlice';
import cn from 'classnames';
import { Divider, Switch } from 'common';
import { BigNumber } from '@ethersproject/bignumber';

import { Link } from 'react-router-dom';
import { RoutesEnum } from 'application/typings/routes';
import styles from './Token.module.scss';

type OwnProps = { token: TokenType, onClickSwitch?: (checked: boolean) => void };

type TokenProps = OwnProps;

class Token extends React.PureComponent<TokenProps> {
  renderWrapper = (children: React.ReactNode) => {
    const { token, onClickSwitch } = this.props;
    return onClickSwitch ?
      <div className={styles.token}>{children}</div>
      : <Link
          to={`${RoutesEnum.myAssets}/${token.type}/${token.address}${RoutesEnum.transactions}`}
          className={styles.token}
      >
        {children}
      </Link>;
  };

  render() {
    const { token, onClickSwitch } = this.props;
    const {
      symbol, name, amount, decimals,
    } = token;

    const formattedAmount = typeof amount === 'string'
      ? amount
      : BigNumber.from(amount).div(decimals).toString();

    return (
      <>
        {this.renderWrapper(
          <div className={styles.row}>
            <div className={cn(styles.icon)} />
            <div className={styles.info}>
              <span className={styles.symbol}>{symbol}</span>
              <span className={styles.name}>
                {name}
              </span>
            </div>
            {onClickSwitch ?
              <Switch
                className={styles.tokenSwitch}
                onChange={(e) => onClickSwitch(e.target.checked)}
                checked={token.isShow}
              /> :
              <span className={styles.amount}>
                {formattedAmount}
              </span>}
          </div>,
        )}
        <Divider className={styles.divider} />
      </>
    );
  }
}

export default Token;
