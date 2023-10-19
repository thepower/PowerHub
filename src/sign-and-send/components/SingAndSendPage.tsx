import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { getWalletAddress, getWalletData } from 'account/selectors/accountSelectors';
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

import { AddressApi, CryptoApi, TransactionsApi } from '@thepowereco/tssdk';
import { correctAmount } from '@thepowereco/tssdk/dist/utils/numbers';
import CardTable from 'common/cardTable/CardTable';
import CardTableKeyAccordion from 'common/cardTableKeyAccordion/CardTableKeyAccordion';
import {
  isEmpty, isObject,
} from 'lodash';
import { checkIfLoading } from 'network/selectors';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router';
import { TxBody, TxKindByName, TxPurpose } from 'sign-and-send/typing';
import { stringToObject } from 'sso/utils';
import ConfirmModal from '../../common/confirmModal/ConfirmModal';
import styles from './SingAndSendPage.module.scss';
import { ThePowerLogoIcon } from './ThePowerLogoIcon';

const { autoAddFee, autoAddGas } = TransactionsApi;

const txKindMap: { [key: number]: string } =
  Object.entries(TxKindByName).reduce((obj, [key, value]) => (Object.assign(obj, { [key]: value })), {});

type OwnProps = RouteComponentProps<{ message: string }>;

const mapStateToProps = (state: RootState, props: OwnProps) => ({
  amount: getWalletNativeTokensAmounts(state),
  address: getWalletAddress(state),
  sentData: getSentData(state),
  loading: checkIfLoading(state, signAndSendTrxTrigger.type),
  message: props?.match?.params?.message,
  feeSettings: getNetworkFeeSettings(state),
  gasSettings: getNetworkGasSettings(state),
  wif: getWalletData(state).wif,
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
  returnURL?: string;
  decodedTxBody?: TxBody
};

class SignAndSendPage extends React.Component<SignAndSendProps, SignAndSendState> {
  constructor(props: SignAndSendProps) {
    super(props);

    this.state = {
      isConfirmModalOpen: false,
    };
  }

  componentDidMount(): void {
    const {
      message, address, gasSettings, feeSettings,
    } = this.props;
    try {
      const decodedMessage = stringToObject(message);
      let decodedTxBody: TxBody = decodedMessage?.body;
      this.setState({ returnURL: decodedMessage?.returnUrl });
      const sponsor = decodedMessage?.sponsor;

      const date = Date.now();
      const srcFee = decodedTxBody?.p?.find((purpose) => purpose?.[0] === TxPurpose.SRCFEE);
      const gas = decodedTxBody?.p?.find((purpose) => purpose?.[0] === TxPurpose.GAS);

      if (!decodedTxBody?.e) {
        decodedTxBody.e = {};
      }

      decodedTxBody.f = Buffer.from(AddressApi.parseTextAddress(address));
      decodedTxBody.s = date;
      decodedTxBody.t = date;

      if (sponsor) {
        decodedTxBody.e.sponsor = [Buffer.from(AddressApi.parseTextAddress(sponsor))];
      }

      if (!gas) {
        decodedTxBody = autoAddGas(decodedTxBody, gasSettings);
      }

      if (!srcFee) {
        decodedTxBody = autoAddFee(decodedTxBody, feeSettings);
      }

      if (sponsor) {
        decodedTxBody.p.forEach((item) => {
          if (item[0] === TxPurpose.SRCFEE) {
            item[0] = TxPurpose.SPONSOR_SRCFEE;
          }
          if (item[0] === TxPurpose.GAS) {
            item[0] = TxPurpose.SPONSOR_GAS;
          }
        });
      }

      if (isObject(decodedTxBody)) {
        this.setState({ decodedTxBody });
      }
    } catch (err) {
      console.log(err);
    }
  }

  componentWillUnmount() {
    this.props.clearSentData();
  }

  handleClickSignAndSend = () => {
    const { wif } = this.props;
    const { decodedTxBody, returnURL } = this.state;
    try {
      const decryptedWif = CryptoApi.decryptWif(wif, '');
      if (decodedTxBody) {
        this.props.signAndSendTrxTrigger({ wif: decryptedWif, decodedTxBody, returnURL });
      }
    } catch {
      this.setState({ isConfirmModalOpen: true });
    }
  };

  signAndSendCallback = (decryptedWif: string) => {
    const { closeModal } = this;
    const { decodedTxBody, returnURL } = this.state;

    if (decodedTxBody) {
      this.props.signAndSendTrxTrigger({ wif: decryptedWif, decodedTxBody, returnURL });
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
    const { decodedTxBody } = this.state;

    if (!decodedTxBody?.e || isEmpty(decodedTxBody?.e)) return null;

    return <CardTable items={Object.entries(decodedTxBody?.e).map(([key, value]) => ({ key, value: value.toString() }))} />;
  };

  renderContent = () => {
    const {
      address,
    } = this.props;
    const { returnURL, decodedTxBody } = this.state;
    const {
      handleClickSignAndSend,
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

          <div className={styles.tableTitle}>{this.props.t('returnURL')}</div>
          <div className={styles.tableValue}>{returnURL || '-'}</div>

          {!isExtDataEmpty && <CardTableKeyAccordion valueLabel={this.props.t('extraData')}>{renderExtraDataTable()}</CardTableKeyAccordion>}

        </div>
        <div className={styles.buttons}>
          <Button onClick={handleClickSignAndSend} variant="filled">{this.props.t('signAndSend')}</Button>
          <a href={returnURL || '/'}>
            <Button fullWidth variant="outlined">{this.props.t('cancel')}</Button>
          </a>
        </div>
      </div>);
  };

  render() {
    const {
      signAndSendCallback,
      renderHeader,
      renderContent,
      closeModal,
    } = this;
    const { isConfirmModalOpen, decodedTxBody } = this.state;
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
