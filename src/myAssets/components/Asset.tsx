import React from 'react';
import { TokenType } from 'myAssets/slices/tokensSlice';
import cn from 'classnames';
import { Checkbox, Divider, Switch } from 'common';
import { BigNumber } from '@ethersproject/bignumber';

import { Link } from 'react-router-dom';
import { RoutesEnum } from 'application/typings/routes';
import { CheckedIcon, LogoIcon, UnCheckedIcon } from 'common/icons';
import styles from './Asset.module.scss';

type OwnProps = {
  asset: TokenType,
  isCheckBoxChecked?: boolean,
  onClickSwitch?: (checked: boolean) => void,
  onClickCheckBox?: (value: string) => void
};

type AssetProps = OwnProps;

class Asset extends React.PureComponent<AssetProps> {
  get formattedAmount() {
    const { asset } = this.props;
    const { amount, decimals } = asset;
    return typeof amount === 'string'
      ? amount
      : BigNumber.from(amount).div(BigNumber.from(decimals).mul(10)).toString();
  }

  onClickAsset = () => {
    const {
      asset, onClickSwitch, onClickCheckBox,
    } = this.props;
    if (onClickSwitch) {
      onClickSwitch(!asset.isShow);
    }
    if (onClickCheckBox) {
      onClickCheckBox(asset.address);
    }
  };

  renderWrapper = (children: React.ReactNode) => {
    const { asset, onClickSwitch, onClickCheckBox } = this.props;

    return onClickSwitch || onClickCheckBox ?
      <div onClick={this.onClickAsset} className={styles.asset}>{children}</div>
      : <Link
          to={`${RoutesEnum.myAssets}/${asset.type}/${asset.address}${RoutesEnum.transactions}`}
          className={styles.asset}
      >
        {children}
      </Link>;
  };

  renderSymbol = () => {
    const { onClickCheckBox, asset } = this.props;
    const { symbol } = asset;
    return onClickCheckBox ? `${symbol} ${this.formattedAmount}` : symbol;
  };

  renderIcon = () => {
    const { asset } = this.props;

    switch (asset.address) {
      case 'SK':
        return <LogoIcon />;

      default:
        return <div />;
    }
  };

  renderRightCol = () => {
    const {
      asset, onClickSwitch, onClickCheckBox, isCheckBoxChecked,
    } = this.props;
    const { formattedAmount } = this;

    if (onClickSwitch) {
      return <Switch
        className={styles.assetSwitch}
        checked={asset.isShow}
      />;
    }
    if (onClickCheckBox) {
      return <Checkbox
        className={styles.assetCheckBox}
        size={'medium'}
        checked={isCheckBoxChecked}
        checkedIcon={<CheckedIcon />}
        icon={<UnCheckedIcon />}
        disableRipple
      />;
    }
    return <span className={styles.amount}>
      {formattedAmount}
    </span>;
  };

  render() {
    const { asset } = this.props;
    const { renderRightCol, renderSymbol, renderIcon } = this;
    const {
      name,
    } = asset;

    return (
      <>
        {this.renderWrapper(
          <div className={styles.row}>
            <div className={cn(styles.icon)}>{renderIcon()}</div>
            <div className={styles.info}>
              <span className={styles.symbol}>{renderSymbol()}</span>
              <span className={styles.name}>
                {name}
              </span>
            </div>
            {renderRightCol()}
          </div>,
        )}
        <Divider className={styles.divider} />
      </>
    );
  }
}

export default Asset;
