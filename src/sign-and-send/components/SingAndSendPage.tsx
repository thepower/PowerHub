import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
// @ts-ignore
import * as msgPack from '@thepowereco/msgpack';

import { getWalletAddress } from 'account/selectors/accountSelectors';
import { getNetworkFeeSettings, getNetworkGasSettings } from 'application/selectors';
import { RootState } from 'application/store';
import cn from 'classnames';
import {
  Button,
  FullScreenLoader,
  TxResult,
} from 'common';
import { getWalletNativeTokensAmounts } from 'myAssets/selectors/walletSelectors';
import { getSentData } from 'send/selectors/sendSelectors';
import { clearSentData, signAndSendTrxTrigger } from 'send/slices/sendSlice';

import { AddressApi, TransactionsApi } from '@thepowereco/tssdk';
import { correctAmount } from '@thepowereco/tssdk/dist/utils/numbers';
import CardTable from 'common/cardTable/CardTable';
import CardTableKeyAccordion from 'common/cardTableKeyAccordion/CardTableKeyAccordion';
import {
  isEmpty, isObject,
} from 'lodash';
import { checkIfLoading } from 'network/selectors';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { TxBody, TxKindByName, TxPurpose } from 'sign-and-send/typing';
import ConfirmModal from '../../common/confirmModal/ConfirmModal';
import styles from './SingAndSendPage.module.scss';
import { ThePowerLogoIcon } from './ThePowerLogoIcon';

const { autoAddFee, autoAddGas } = TransactionsApi;

const txKindMap: { [key: number]: string } =
  Object.entries(TxKindByName).reduce((obj, [key, value]) => (Object.assign(obj, { [key]: value })), {});

type OwnProps = RouteComponentProps<{ txBody: string }>;

const mapStateToProps = (state: RootState, props: OwnProps) => ({
  amount: getWalletNativeTokensAmounts(state),
  address: getWalletAddress(state),
  sentData: getSentData(state),
  loading: checkIfLoading(state, signAndSendTrxTrigger.type),
  txBody: props?.match?.params?.txBody,
  feeSettings: getNetworkFeeSettings(state),
  gasSettings: getNetworkGasSettings(state),
});

const mapDispatchToProps = {
  clearSentData,
  signAndSendTrxTrigger,
};

const connector = connect(
  mapStateToProps,
  mapDispatchToProps,
);

type SignAndSendProps = ConnectedProps<typeof connector> & WithTranslation & {
  className?: string
};

type SignAndSendState = {
  isConfirmModalOpen: boolean;
};

class SignAndSendPage extends React.Component<SignAndSendProps, SignAndSendState> {
  constructor(props: SignAndSendProps) {
    super(props);

    this.state = {
      isConfirmModalOpen: false,
    };
  }

  componentWillUnmount() {
    this.props.clearSentData();
  }

  get decodedTxBody() {
    const { txBody, feeSettings, gasSettings } = this.props;
    try {
      const decodedTxBody: TxBody = msgPack.decode(Buffer.from(txBody, 'hex'));
      let body = decodedTxBody;

      const srcFee = decodedTxBody?.p?.find((purpose) => purpose?.[0] === TxPurpose.SRCFEE);
      const gas = body?.p?.find((purpose) => purpose?.[0] === TxPurpose.GAS);
      if (body && !gas) {
        body = autoAddGas(body, gasSettings);
      }
      if (body && !srcFee) {
        body = autoAddFee(body, feeSettings);
      }

      return isObject(body) ? body : null;
    } catch (error) {
      return null;
    }
  }

  handleClickSignAndSend = () => {
    this.setState({ isConfirmModalOpen: true });
  };

  signAndSendCallback = (decryptedWif: string) => {
    const { decodedTxBody, closeModal } = this;
    if (decodedTxBody) {
      this.props.signAndSendTrxTrigger({ wif: decryptedWif, decodedTxBody });
      closeModal();
    }
  };

  closeModal = () => {
    this.setState({ isConfirmModalOpen: false });
  };

  renderHeader = () => (
    <div className={styles.headerLayout}>
      <header className={styles.header}>
        <div className={styles.headerCol}>
          <ThePowerLogoIcon className={styles.headerLogoIcon} />
          <div className={styles.headerText}>POWER HUB</div>
        </div>
      </header>
    </div>);

  renderExtraDataTable = () => {
    const { decodedTxBody } = this;

    if (!decodedTxBody?.e || isEmpty(decodedTxBody?.e)) return null;

    return <CardTable items={Object.entries(decodedTxBody?.e).map(([key, value]) => ({ key, value }))} />;
  };

  renderContent = () => {
    const {
      address,
    } = this.props;
    const {
      decodedTxBody, handleClickSignAndSend,
      renderExtraDataTable,
    } = this;

    const txKind = decodedTxBody?.k as number;
    const txKindName = txKind && txKindMap[txKind];
    const to = decodedTxBody?.to && AddressApi.hexToTextAddress(Buffer.from(decodedTxBody?.to).toString('hex'));

    const transfer = decodedTxBody?.p?.find((item) => item?.[0] === TxPurpose.TRANSFER);
    const transferAmount = transfer?.[2] ? correctAmount(transfer?.[2], transfer?.[1]) : null;
    const transferCur = transfer?.[1];

    const fee = decodedTxBody?.p?.find((item) => item?.[0] === TxPurpose.SRCFEE);
    const feeAmount = fee?.[2] ? correctAmount(fee?.[2], fee?.[1]) : null;
    const feeCur = fee?.[1];

    const call = decodedTxBody?.c;
    const functionName = call?.[0];
    const functionArguments = call?.[1] && JSON.stringify(call?.[1], null, 10);

    const comment = decodedTxBody?.e?.msg;

    const isExtDataEmpty = isEmpty(decodedTxBody?.e);

    return (
      <div className={styles.content}>
        <div className={styles.title}>{this.props.t('transferOfTokens')}</div>
        <div className={styles.table}>
          <div className={styles.tableTitle}>{this.props.t('transactionType')}</div>
          <div className={styles.tableValue}>{txKindName || '-'}</div>

          <div className={styles.tableTitle}>{this.props.t('senderAddress')}</div>
          <div className={styles.tableValue}>{address || '-'}</div>

          <div className={styles.tableTitle}>{this.props.t('addressOfTheRecipient')}</div>
          <div className={styles.tableValue}>{to || '-'}</div>

          <div className={styles.tableTitle}>{this.props.t('transactionSubject')}</div>
          <div className={styles.tableValue}>
            {(transferAmount && transferCur) ? `${transferAmount} ${transferCur}` : '-'}
          </div>

          <div className={styles.tableTitle}>{this.props.t('functionCall')}</div>
          <div className={styles.tableValue}>{functionName || '-'}</div>

          <div className={styles.tableTitle}>{this.props.t('callArguments')}</div>
          <div className={styles.tableValue}>{functionArguments || '-'}</div>

          <div className={styles.tableTitle}>{this.props.t('fee')}</div>
          <div className={styles.tableValue}>{(feeAmount && feeCur) && `${feeAmount} ${feeCur}` || '-'}</div>

          {/* <div className={styles.tableTitle}>Details</div>
          <div className={styles.tableValue}>?</div> */}

          <div className={styles.tableTitle}>{this.props.t('comment')}</div>
          <div className={styles.tableValue}>{comment || '-'}</div>

          {!isExtDataEmpty && <CardTableKeyAccordion valueLabel={this.props.t('extraData')}>{renderExtraDataTable()}</CardTableKeyAccordion>}

        </div>
        <div className={styles.buttons}>
          <Button onClick={handleClickSignAndSend} variant="filled">{this.props.t('signAndSend')}</Button>
          <Link to="/">
            <Button fullWidth variant="outlined">{this.props.t('cancel')}</Button>
          </Link>
        </div>
      </div>);
  };

  render() {
    const {
      signAndSendCallback, renderHeader, renderContent, closeModal, decodedTxBody,
    } = this;
    const { isConfirmModalOpen } = this.state;
    const {
      loading,
      className,
      sentData,
    } = this.props;

    if (loading) {
      return <FullScreenLoader />;
    }

    if (!decodedTxBody) {
      return <>{renderHeader()}</>;
    }

    return (
      <div className={cn(styles.signAndSendPage, className)}>
        <ConfirmModal
          open={isConfirmModalOpen}
          onClose={closeModal}
          callback={signAndSendCallback}
        />
        {renderHeader()}
        {!sentData ? renderContent() : <TxResult sentData={sentData} />}
      </div>
    );
  }
}

export default withTranslation()(connector(SignAndSendPage));
