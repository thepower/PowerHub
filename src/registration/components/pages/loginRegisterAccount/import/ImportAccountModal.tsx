import React from 'react';
import { Modal, OutlinedInput, Button } from 'common';
import classnames from 'classnames';
import { Form, Formik, FormikHelpers } from 'formik';
import styles from '../../../Registration.module.scss';

interface ImportAccountModalProps {
  open: boolean;
  onClose: (data?: any) => void;
  onSubmit: (data?: any) => void;
}

const initialValues = { password: '' };
type Values = typeof initialValues;

export class ImportAccountModal extends React.PureComponent<ImportAccountModalProps> {
  handleSubmitImportModal = (values: Values, formikHelpers: FormikHelpers<Values>) => {
    const { onSubmit } = this.props;

    onSubmit(values.password);
    formikHelpers.setFieldValue('password', '');
  };

  render() {
    const {
      open,
      onClose,
    } = this.props;

    return (
      <Modal
        contentClassName={styles.importModalContent}
        onClose={onClose}
        open={open}
      >
        <Formik initialValues={initialValues} onSubmit={this.handleSubmitImportModal}>
          {(formikProps) => (
            <Form className={styles.exportModalForm}>
              <div className={styles.exportModalTitleHolder}>
                <div className={styles.exportModalTitle}>
                  {'Import account'}
                </div>
                <div className={styles.exportModalTitle}>
                  {'Please enter your password and your account will be loaded'}
                </div>
              </div>
              <OutlinedInput
                placeholder={'Password'}
                className={classnames(styles.passwordInput, styles.importModalPasswordInput)}
                name="password"
                value={formikProps.values.password}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                type={'password'}
                autoFocus
                errorMessage={formikProps.errors.password}
                error={formikProps.touched.password && Boolean(formikProps.errors.password)}
              />
              <Button
                size="medium"
                variant="filled"
                type="submit"
                disabled={!formikProps.dirty}
              >
                {'Next'}
              </Button>
            </Form>
          )}
        </Formik>
      </Modal>

    );
  }
}
