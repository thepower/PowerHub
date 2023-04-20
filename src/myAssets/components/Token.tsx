import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { TokenType } from 'myAssets/slices/tokensSlice';
import cn from 'classnames';
import { Divider } from 'common';
import { RootState } from '../../application/store';

import styles from './Token.module.scss';

type OwnProps = { token: TokenType };

const mapStateToProps = (state: RootState) => ({

});

const mapDispatchToProps = {

};

const connector = connect(mapStateToProps, mapDispatchToProps);

type TokenProps = ConnectedProps<typeof connector> & OwnProps;

type TokenState = { };

class Token extends React.PureComponent<TokenProps, TokenState> {
  // constructor(props: TokenProps) {
  //   super(props);
  // }

  render() {
    const { token } = this.props;

    const { symbol, name, amount } = token;
    return (
      <>
        <div className={styles.token}>
          <div className={styles.row}>
            <div className={cn(styles.icon)} />
            <div className={styles.info}>
              <span className={styles.symbol}>{symbol}</span>
              <span className={styles.name}>
                {name}
              </span>
            </div>
            <span className={styles.amount}>
              {amount}
            </span>
          </div>
        </div>
        <Divider className={styles.divider} />
      </>
    );
  }
}

export default connector(Token);
