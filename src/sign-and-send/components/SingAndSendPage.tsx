import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
// @ts-ignore
import * as msgPack from '@thepowereco/msgpack';

import { clearSentData, signAndSendTrxTrigger } from 'send/slices/sendSlice';
import { getSentData } from 'send/selectors/sendSelectors';
import {
  Button,
  FullScreenLoader,
} from 'common';
import cn from 'classnames';
import { RootState } from 'application/store';
import { getWalletNativeTokensAmounts } from 'myAssets/selectors/walletSelectors';
import { getWalletAddress } from 'account/selectors/accountSelectors';
import { checkIfLoading } from 'network/selectors';
import { RouteComponentProps } from 'react-router';
import { AddressApi } from '@thepowereco/tssdk';
import { TxBody, TxKindByName, TxPurpose } from 'sign-and-send/typing';
import { isEmpty, isObject } from 'lodash';
import { correctAmount } from '@thepowereco/tssdk/dist/utils/numbers';
import CardTableKeyAccordion from 'common/cardTableKeyAccordion/CardTableKeyAccordion';
import CardTable from 'common/cardTable/CardTable';
import styles from './SingAndSendPage.module.scss';
import { ThePowerLogoIcon } from './ThePowerLogoIcon';
import ConfirmModal from '../../common/confirmModal/ConfirmModal';

const txKindMap: { [key: number]: string } =
  Object.entries(TxKindByName).reduce((obj, [key, value]) => (Object.assign(obj, { [key]: value })), {});

type OwnProps = RouteComponentProps<{ txBody: string, chainID: string }>;

const mapStateToProps = (state: RootState, props: OwnProps) => ({
  amount: getWalletNativeTokensAmounts(state),
  address: getWalletAddress(state),
  sentData: getSentData(state),
  loading: checkIfLoading(state, signAndSendTrxTrigger.type),
  txBody: props?.match?.params?.txBody,
  chainID: props?.match?.params?.chainID,
});

const mapDispatchToProps = {
  clearSentData,
  signAndSendTrxTrigger,
};

const connector = connect(
  mapStateToProps,
  mapDispatchToProps,
);

type SignAndSendProps = ConnectedProps<typeof connector> & {
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
    const { txBody } = this.props;
    try {
      const decodedTxBody: TxBody = msgPack.decode(Buffer.from(txBody, 'hex'));
      return isObject(decodedTxBody) ? decodedTxBody : null;
    } catch (error) {
      return null;
    }
  }

  handleClickSignAndSend = () => {
    this.setState({ isConfirmModalOpen: true });
  };

  signAndSendCallback = (decryptedWif: string) => {
    const { chainID } = this.props;
    const { decodedTxBody, closeModal } = this;
    if (decodedTxBody) {
      this.props.signAndSendTrxTrigger({ wif: decryptedWif, decodedTxBody, chainID });
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
    const from = decodedTxBody?.f && AddressApi.hexToTextAddress(Buffer.from(decodedTxBody?.f).toString('hex'));
    const to = decodedTxBody?.to && AddressApi.hexToTextAddress(Buffer.from(decodedTxBody?.to).toString('hex'));

    const transfer = decodedTxBody?.p?.find((item) => item?.[0] === TxPurpose.TRANSFER);
    const transferAmount = transfer?.[2] ? correctAmount(transfer?.[2], transfer?.[1]) : null;
    const transferCur = transfer?.[1];

    const fee = decodedTxBody?.p?.find((item) => item?.[0] === TxPurpose.SRCFEE);
    const feeAmount = fee?.[2] ? correctAmount(fee?.[2], fee?.[1]) : null;
    const feeCur = fee?.[1];

    const call = decodedTxBody?.c;
    const functionName = call?.[0];
    const functionArguments = call?.[1].length && JSON.stringify(call?.[1], null, 10);

    const comment = decodedTxBody?.e?.msg;

    const isExtDataEmpty = isEmpty(decodedTxBody?.e);
    return (
      <div className={styles.content}>
        <div className={styles.title}>Transfer of tokens</div>
        <div className={styles.table}>
          <div className={styles.tableTitle}>Transaction initiator</div>
          <div className={styles.tableValue}>{from || address}</div>

          <div className={styles.tableTitle}>Transaction type</div>
          <div className={styles.tableValue}>{txKindName || '-'}</div>

          <div className={styles.tableTitle}>Sender&apos;s address</div>
          <div className={styles.tableValue}>{address || '-'}</div>

          <div className={styles.tableTitle}>Address of the recipient</div>
          <div className={styles.tableValue}>{to || '-'}</div>

          <div className={styles.tableTitle}>Transaction subject</div>
          <div className={styles.tableValue}>
            {(transferAmount && transferCur) && `${transferAmount} ${transferCur}`}
          </div>

          <div className={styles.tableTitle}>Function call</div>
          <div className={styles.tableValue}>{functionName || '-'}</div>

          <div className={styles.tableTitle}>Call arguments</div>
          <div className={styles.tableValue}>{functionArguments || '-'}</div>

          <div className={styles.tableTitle}>Fee</div>
          <div className={styles.tableValue}>{(feeAmount && feeCur) && `${feeAmount} ${feeCur}` || '-'}</div>

          {/* <div className={styles.tableTitle}>Details</div>
          <div className={styles.tableValue}>?</div> */}

          <div className={styles.tableTitle}>Comment</div>
          <div className={styles.tableValue}>{comment || '-'}</div>

          {!isExtDataEmpty && <CardTableKeyAccordion valueLabel="Extra data">{renderExtraDataTable()}</CardTableKeyAccordion>}

        </div>
        <div className={styles.buttons}>
          <Button onClick={handleClickSignAndSend} variant="filled">Sign and send</Button>
          <Button variant="outlined" onClick={() => window.history.back()}>Cancel</Button>
        </div>
      </div>);
  };

  renderTxResult = () => {
    const {
      sentData,
    } = this.props;

    return (
      <div className={styles.content}>

        <div className={styles.result}>
          <div>
            <div className={styles.resultKey}>Amount</div>
            <div className={styles.resultValue}>
              {sentData?.amount}
              {/* <LogoIcon height={24} width={24} className={styles.icon} /> */}
            </div>
          </div>
          <div>
            <div className={styles.resultKey}>From</div>
            <div className={styles.resultValue}>{sentData?.from}</div>
          </div>
          <div>
            <div className={styles.resultKey}>To</div>
            <div className={styles.resultValue}>{sentData?.to}</div>
          </div>
          <div>
            <div className={styles.resultKey}>Tx</div>
            <div className={styles.resultValue}>{sentData?.txId}</div>
          </div>
          <div>
            <div className={styles.commentLabel}>Comments</div>
            <div className={styles.comment}>{sentData?.comment}</div>
          </div>
        </div>
      </div>);
  };

  render() {
    const {
      signAndSendCallback, renderHeader, renderContent, renderTxResult, closeModal, decodedTxBody,
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
        {!sentData ? renderContent() : renderTxResult()}
      </div>
    );
  }
}

export default connector(SignAndSendPage);
