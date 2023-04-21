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
  render() {
    const { token, onClickSwitch } = this.props;
    const {
      symbol, name, amount, decimals,
    } = token;
    let formattedAmount = '0';
    if (typeof amount === 'string') {
      formattedAmount = amount;
    } else {
      formattedAmount = BigNumber.from(amount).div(decimals).toString();
    }

    return (
      <>
        <Link to={`${RoutesEnum.myAssets}/${token.type}/${token.address}/transactions`} className={styles.token}>
          <div className={styles.row}>
            <div className={cn(styles.icon)} />
            <div className={styles.info}>
              <span className={styles.symbol}>{symbol}</span>
              <span className={styles.name}>
                {name}
              </span>
            </div>
            {onClickSwitch ?
              <Switch className={styles.tokenSwitch} onChange={(e) => onClickSwitch(e.target.checked)} checked={token.isShow} /> :
              <span className={styles.amount}>
                {formattedAmount}
              </span>}
          </div>
        </Link>
        <Divider className={styles.divider} />
      </>
    );
  }
}

export default Token;
