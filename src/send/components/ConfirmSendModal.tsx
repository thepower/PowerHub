import React, { useCallback, useMemo } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import { CryptoApi } from '@thepowereco/tssdk';
import { connect, ConnectedProps } from 'react-redux';
import { Button, Modal, OutlinedInput } from '../../common';
import styles from './ConfirmSendModal.module.scss';
import { RootState } from '../../application/store';
import { getWalletAddress, getWalletData } from '../../account/selectors/accountSelectors';
import { sendTrxTrigger } from '../slices/sendSlice';

interface OwnProps {
  open: boolean;
  onClose: () => void;
  trxValues: {
    amount: string;
    comment: string;
    address: string;
  }
}

const initialValues = { password: '' };
type Values = typeof initialValues;

const connector = connect(
  (state: RootState) => ({
    wif: getWalletData(state).wif,
    from: getWalletAddress(state),
  }),
  {
    sendTrxTrigger,
  },
);

type ConfirmSendModalProps = ConnectedProps<typeof connector> & OwnProps;

const ConfirmSendModal: React.FC<ConfirmSendModalProps> = ({
  onClose, open, trxValues, wif, from, sendTrxTrigger,
}) => {
  const handleSubmit = useCallback(async (values: Values, formikHelpers: FormikHelpers<Values>) => {
    try {
      const decryptedWif = await CryptoApi.decryptWif(wif, values.password);
      sendTrxTrigger({
        from,
        to: trxValues.address!,
        comment: trxValues.comment,
        amount: Number(trxValues.amount)!,
        wif: decryptedWif,
      });
      onClose();
    } catch (e) {
      formikHelpers.setFieldError('password', 'Invalid password');
    }
  }, [from, onClose, sendTrxTrigger, trxValues, wif]);

  const fields = useMemo(() => [
    { key: 'From', value: from },
    { key: 'To', value: trxValues.address },
    { key: 'Amount', value: `${trxValues.amount} SK` },
  ], [from, trxValues]);

  return (
    <Modal open={open} onClose={onClose} contentClassName={styles.modalContent}>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(formikProps) => (
          <Form className={styles.form}>
            <p className={styles.title}>
              Confirm transfer
            </p>
            <p className={styles.subTitle}>
              Enter your password to complete the transaction
            </p>
            <div className={styles.grid}>
              {fields.map(({ key, value }) => (
                <React.Fragment key={key}>
                  <span className={styles.key}>
                    {`${key}:`}
                  </span>
                  <span className={styles.value}>
                    {value}
                  </span>
                </React.Fragment>
              ))}
            </div>
            <OutlinedInput
              placeholder={'Password'}
              className={styles.passwordInput}
              name="password"
              value={formikProps.values.password}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              type={'password'}
              autoFocus
              errorMessage={formikProps.errors.password}
              error={formikProps.touched.password && Boolean(formikProps.errors.password)}
            />
            <Button variant="outlined" type="submit" disabled={!formikProps.dirty} className={styles.button}>
              Next
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default connector(ConfirmSendModal);
