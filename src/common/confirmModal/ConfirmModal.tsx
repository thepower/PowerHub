import React, {
  useCallback,
} from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import { CryptoApi } from '@thepowereco/tssdk';
import { connect, ConnectedProps } from 'react-redux';
import { Button, Modal, OutlinedInput } from '..';
import styles from './ConfirmModal.module.scss';
import { RootState } from '../../application/store';
import { getWalletData } from '../../account/selectors/accountSelectors';

interface OwnProps {
  open: boolean;
  onClose: () => void;
  callback: (decryptedWif: string) => void
}

const initialValues = { password: '' };
type Values = typeof initialValues;

const connector = connect(
  (state: RootState) => ({
    wif: getWalletData(state).wif,
  }),
);

type ConfirmModalProps = ConnectedProps<typeof connector> & OwnProps;

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  onClose, open, wif, callback,
}) => {
  const handleSubmit = useCallback(async (values: Values, formikHelpers: FormikHelpers<Values>) => {
    try {
      const decryptedWif = await CryptoApi.decryptWif(wif, values.password);
      callback(decryptedWif);
    } catch (e) {
      formikHelpers.setFieldError('password', 'Invalid password');
    }
  }, [callback, wif]);

  return (
    <Modal open={open} onClose={onClose} contentClassName={styles.modalContent}>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(formikProps) => (
          <Form className={styles.form}>
            <p className={styles.title}>
              Confirm action
            </p>
            <p className={styles.subTitle}>
              Enter your password to complete the transaction
            </p>
            <OutlinedInput
              inputRef={(input) => input && input.focus()}
              placeholder={'Password'}
              className={styles.passwordInput}
              name="password"
              value={formikProps.values.password}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              type={'password'}
              autoComplete="new-password"
              autoFocus
              errorMessage={formikProps.errors.password}
              error={formikProps.touched.password && Boolean(formikProps.errors.password)}
            />
            <Button variant="outlined" type="submit" disabled={!formikProps.dirty} className={styles.button}>
              Confirm
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default connector(ConfirmModal);
