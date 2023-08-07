import React, { FC } from 'react';
import { Modal, OutlinedInput } from 'common';
import classnames from 'classnames';
import { connect, ConnectedProps } from 'react-redux';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  FormikHelpers, useFormik,
} from 'formik';
import styles from '../../registration/components/Registration.module.scss';
import { resetAccount } from '../slice/accountSlice';

const initialValues = { password: '' };
type Values = typeof initialValues;

const mapDispatchToProps = {
  resetAccount,
};

const connector = connect(null, mapDispatchToProps);
type ResetAccountModalProps = ConnectedProps<typeof connector> & {
  open: boolean;
  onClose: () => void;
};

const ResetAccountModalComponent: FC<ResetAccountModalProps> = ({
  resetAccount, onClose, open,
}) => {
  const { t } = useTranslation();

  const handleSubmitImportModal = async (values: Values, formikHelpers: FormikHelpers<Values>) => {
    const { password } = values;

    resetAccount({ password });

    formikHelpers.setFieldValue('password', '');
    onClose();
  };

  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmitImportModal,
  });

  return <Modal
    contentClassName={styles.importModalContent}
    onClose={onClose}
    open={open}
  >
    <form className={styles.resetModalForm} onSubmit={formik.handleSubmit}>
      <div className={styles.exportModalTitleHolder}>
        <div className={styles.exportModalTitle}>
          {t('resetAccount')}
        </div>
        <div className={styles.exportModalTitle}>
          {t('areYouSureYouWantResetYourAccount')}
        </div>
        <div className={styles.exportModalTitle}>
          {t('enterYourPasswordConfirmAccountReset')}
        </div>
      </div>
      <OutlinedInput
        inputRef={(input) => input && input.focus()}
        placeholder={t('password')!}
        className={classnames(styles.passwordInput, styles.importModalPasswordInput)}
        name="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        type={'password'}
        autoComplete="new-password"
        autoFocus
        errorMessage={formik.errors.password}
        error={formik.touched.password && Boolean(formik.errors.password)}
      />
      <Button
        className={classnames(styles.registrationNextButton, styles.registrationNextButton_outlined)}
        variant="outlined"
        size="large"
        type="submit"
      >
        <span className={styles.registrationNextButtonText}>
          {t('next')}
        </span>
      </Button>
    </form>
  </Modal>;
};

export const ResetAccountModal = connector(ResetAccountModalComponent);
