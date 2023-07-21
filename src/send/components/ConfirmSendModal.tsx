import React, { useCallback, useMemo } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import { CryptoApi } from '@thepowereco/tssdk';
import { connect, ConnectedProps } from 'react-redux';
import { TokenType } from 'myAssets/slices/tokensSlice';
import { t } from 'i18next';
import { Button, Modal, OutlinedInput } from '../../common';
import styles from './ConfirmSendModal.module.scss';
import { RootState } from '../../application/store';
import { getWalletAddress, getWalletData } from '../../account/selectors/accountSelectors';
import { sendTokenTrxTrigger, sendTrxTrigger } from '../slices/sendSlice';

interface OwnProps {
  open: boolean;
  onClose: () => void;
  token?: TokenType;
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
    sendTokenTrxTrigger,
  },
);

type ConfirmSendModalProps = ConnectedProps<typeof connector> & OwnProps;

const ConfirmSendModal: React.FC<ConfirmSendModalProps> = ({
  onClose, open, trxValues, wif, from, sendTrxTrigger, token, sendTokenTrxTrigger,
}) => {
  const handleSubmit = useCallback(async (values: Values, formikHelpers: FormikHelpers<Values>) => {
    try {
      const decryptedWif = await CryptoApi.decryptWif(wif, values.password);
      if (!token) {
        sendTrxTrigger({
          from,
          to: trxValues.address!,
          comment: trxValues.comment,
          amount: Number(trxValues.amount)!,
          wif: decryptedWif,
        });
      } else {
        sendTokenTrxTrigger({
          address: token.address,
          amount: Number(trxValues.amount),
          decimals: token.decimals,
          from,
          to: trxValues.address!,
          wif: decryptedWif,
        });
      }
      onClose();
    } catch (e) {
      formikHelpers.setFieldError('password', t('invalidPasswordError')!);
    }
  }, [from, onClose, sendTrxTrigger, sendTokenTrxTrigger, trxValues, wif, token]);

  const fields = useMemo(() => [
    { key: t('from'), value: from },
    { key: t('to'), value: trxValues.address },
    { key: t('amount'), value: `${trxValues.amount} ${token ? token.symbol : 'SK'}` },
  ], [from, trxValues, token]);

  return (
    <Modal open={open} onClose={onClose} contentClassName={styles.modalContent}>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(formikProps) => (
          <Form className={styles.form}>
            <p className={styles.title}>
              {t('confirmTransfer')}
            </p>
            <p className={styles.subTitle}>
              {t('enterYourPasswordCompleteTransaction')}
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
              inputRef={(input) => input && input.focus()}
              placeholder={t('password')!}
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
              {t('next')}
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default connector(ConfirmSendModal);
