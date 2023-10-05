import React, { useCallback, useMemo } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import { connect, ConnectedProps } from 'react-redux';
import { TokenType } from 'myAssets/slices/tokensSlice';
import { useTranslation } from 'react-i18next';
import { Button, Modal, OutlinedInput } from '../../common';
import styles from './ConfirmSendModal.module.scss';
import { RootState } from '../../application/store';
import { getWalletAddress } from '../../account/selectors/accountSelectors';
import { FormValues } from './Send';

interface OwnProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues, password: string) => Promise<void>;
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
    from: getWalletAddress(state),
  }),
);

type ConfirmSendModalProps = ConnectedProps<typeof connector> & OwnProps;

const ConfirmSendModal: React.FC<ConfirmSendModalProps> = ({
  onClose, open, trxValues, from, token, onSubmit,
}) => {
  const { t } = useTranslation();
  const handleSubmit = useCallback(async (values: Values, formikHelpers: FormikHelpers<Values>) => {
    try {
      await onSubmit(trxValues, values.password);
      onClose();
    } catch (e) {
      formikHelpers.setFieldError('password', t('invalidPasswordError')!);
    }
  }, [onSubmit, trxValues, onClose, t]);

  const fields = useMemo(() => [
    { key: t('from'), value: from },
    { key: t('to'), value: trxValues.address },
    { key: t('amount'), value: `${trxValues.amount} ${token ? token.symbol : 'SK'}` },
  ], [t, from, trxValues.address, trxValues.amount, token]);

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
            <Button variant="outlined" type="submit" className={styles.button}>
              {t('next')}
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default connector(ConfirmSendModal);
