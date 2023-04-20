import React from 'react';
import { InputAdornment, TextField } from '@mui/material';
import { connect, ConnectedProps } from 'react-redux';
import {
  Form, Formik, FormikHelpers, FormikProps,
} from 'formik';
import * as yup from 'yup';
import cn from 'classnames';
import { AddressApi } from '@thepowereco/tssdk';
import {
  Button, DeepPageTemplate, Divider, FullScreenLoader,
} from '../../common';
import { RoutesEnum } from '../../application/typings/routes';
import { RootState } from '../../application/store';
import { getWalletNativeTokensAmounts } from '../../myAssets/selectors/walletSelectors';
import { getWalletAddress } from '../../account/selectors/accountSelectors';
import { LogoIcon, MoneyBugIcon } from '../../common/icons';
import ConfirmSendModal from './ConfirmSendModal';
import { getSentData } from '../selectors/sendSelectors';
import { checkIfLoading } from '../../network/selectors';
import { clearSentData, sendTrxTrigger } from '../slices/sendSlice';
import styles from './Send.module.scss';

const connector = connect(
  (state: RootState) => ({
    amount: getWalletNativeTokensAmounts(state),
    address: getWalletAddress(state),
    sentData: getSentData(state),
    loading: checkIfLoading(state, sendTrxTrigger.type),
  }),
  {
    clearSentData,
  },
);

type SendProps = ConnectedProps<typeof connector>;

type SendState = {
  openModal: boolean;
};

type FormValues = {
  amount: string;
  comment: string;
  address: string;
};

const initialValues: FormValues = {
  amount: '',
  comment: '',
  address: '',
};

class Send extends React.Component<SendProps, SendState> {
  private InputLabelProps = {
    className: styles.label,
  };

  constructor(props: SendProps) {
    super(props);

    this.state = {
      openModal: false,
    };
  }

  componentWillUnmount() {
    this.props.clearSentData();
  }

  getValidationSchema = () => yup.object({
    amount: yup
      .number()
      .required()
      .moreThan(0)
      .lessThan(Number(this.props.amount), 'Balance exceeded, reduce amount')
      .nullable(),
    address: yup.string().required().length(20),
    comment: yup.string().max(1024),
  });

  handleClose = () => this.setState({ openModal: false });

  handleSubmit = ({ address }: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
    if (!AddressApi.isTextAddressValid(address!)) {
      formikHelpers.setFieldError('address', 'invalid address');
    } else {
      this.setState({ openModal: true });
    }
  };

  renderForm = (formikProps: FormikProps<typeof initialValues>) => (
    <>
      <ConfirmSendModal open={this.state.openModal} trxValues={formikProps.values} onClose={this.handleClose} />
      <Form className={styles.form}>
        <div className={styles.fields}>
          <TextField
            variant="standard"
            label="Amount"
            type="number"
            placeholder="00.000"
            name="amount"
            value={formikProps.values.amount}
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            error={formikProps.touched.amount && Boolean(formikProps.errors.amount)}
            helperText={formikProps.touched.amount && formikProps.errors.amount}
            InputLabelProps={this.InputLabelProps}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MoneyBugIcon className={cn(formikProps.values.amount && styles.activeBugIcon)} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            variant="standard"
            label="Address of the recipient"
            placeholder="AA000000000000000000"
            name="address"
            value={formikProps.values.address}
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            error={formikProps.touched.address && Boolean(formikProps.errors.address)}
            helperText={formikProps.touched.address && formikProps.errors.address}
          />
          <TextField
            variant="outlined"
            placeholder="Add comment"
            multiline
            minRows={2}
            name="comment"
            value={formikProps.values.comment}
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            error={formikProps.touched.comment && Boolean(formikProps.errors.comment)}
            helperText={formikProps.touched.comment && formikProps.errors.comment}
          />
        </div>
        <Button size="large" variant="filled" className={styles.button} type="submit" disabled={!formikProps.dirty}>
          Send
        </Button>
      </Form>
    </>
  );

  render() {
    const {
      amount, address, sentData, loading,
    } = this.props;

    if (loading) {
      return <FullScreenLoader />;
    }

    if (sentData) {
      return (
        <DeepPageTemplate topBarTitle="Send" backUrl={RoutesEnum.myAssets} backUrlText="My assets">
          <div className={styles.content}>
            <div className={styles.result}>
              <div>
                <div className={styles.resultKey}>Amount</div>
                <div className={styles.resultValue}>
                  {sentData.amount}
                  <LogoIcon height={24} width={24} className={styles.icon} />
                </div>
              </div>
              <div>
                <div className={styles.resultKey}>From</div>
                <div className={styles.resultValue}>{sentData.from}</div>
              </div>
              <div>
                <div className={styles.resultKey}>To</div>
                <div className={styles.resultValue}>{sentData.to}</div>
              </div>
              <div>
                <div className={styles.resultKey}>Tx</div>
                <div className={styles.resultValue}>{sentData.txId}</div>
              </div>
              <div>
                <div className={styles.commentLabel}>Comments</div>
                <div className={styles.comment}>{sentData.comment}</div>
              </div>
            </div>
          </div>
        </DeepPageTemplate>
      );
    }

    return (
      <DeepPageTemplate topBarTitle="Send" backUrl={RoutesEnum.myAssets} backUrlText="My assets">
        <div className={styles.content}>
          <div className={styles.walletInfo}>
            <span className={styles.titleBalance}>Total balance</span>
            <span className={styles.address}>{address}</span>
            <span className={styles.amount}>
              <LogoIcon width={20} height={20} className={styles.totalBalanceIcon} />
              {amount?.SK === '0' ? 'Your tokens will be here' : amount.SK}
            </span>
          </div>
          <Divider className={styles.divider} />
          <Formik
            validationSchema={this.getValidationSchema()}
            initialValues={initialValues}
            onSubmit={this.handleSubmit}
          >
            {this.renderForm}
          </Formik>
        </div>
      </DeepPageTemplate>
    );
  }
}

export default connector(Send);
