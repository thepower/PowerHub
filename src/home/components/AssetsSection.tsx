import React from 'react';
import {
  BuySvg,
  FaucetSvg,
  LogoIcon,
  SendSvg,
  WalletsSvg,
} from 'common/icons';
import { connect, ConnectedProps } from 'react-redux';
import { ArrowLink, CardLink, CopyButton } from 'common';
import { getWalletAddress } from '../../account/selectors/accountSelectors';
import { getWalletAmount } from '../../myAssets/selectors/walletSelectors';
import { setShowUnderConstruction } from '../../application/slice/applicationSlice';
import { RootState } from '../../application/store';
import styles from './AssetsSection.module.scss';
import { RoutesEnum } from '../../application/typings/routes';

const mapStateToProps = (state: RootState) => ({
  walletAddress: getWalletAddress(state),
  amount: getWalletAmount(state),
});
const mapDispatchToProps = {
  setShowUnderConstruction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type AssetsSectionProps = ConnectedProps<typeof connector>;

const AssetsSection = ({ walletAddress, setShowUnderConstruction, amount }: AssetsSectionProps) => {
  const handleShowUnderConstruction = React.useCallback((event: React.MouseEvent) => {
    event.preventDefault();

    setShowUnderConstruction(true);
  }, [setShowUnderConstruction]);

  return (
    <div>
      <ArrowLink size="large" direction="right" to="my-assets">
        {'My assets'}
      </ArrowLink>
      <div className={styles.box}>
        <div className={styles.majorWallet}>
          <p className={styles.total}>
            <LogoIcon className={styles.icon} />
            {amount === '0' ? <span className={styles.emptyTitle}>Your tokens will be here</span> : amount}
          </p>
          <CopyButton
            textButton={walletAddress}
            className={styles.addressButton}
            iconClassName={styles.copyIcon}
          />
        </div>
        <div className={styles.cards}>
          <CardLink to="/my-assets" label="Wallets">
            <WalletsSvg />
          </CardLink>
          <CardLink label="Faucet" isAnchor to="https://faucet.thepower.io/" target="_blank" rel="noreferrer">
            <FaucetSvg />
          </CardLink>
          <CardLink to={`${RoutesEnum.myAssets}${RoutesEnum.send}`} label="Send">
            <SendSvg />
          </CardLink>
          <CardLink to="/buy" label="Buy" onClick={handleShowUnderConstruction}>
            <BuySvg />
          </CardLink>
        </div>
      </div>
    </div>
  );
};

export default connector(AssetsSection);
