import classnames from 'classnames';
import { Button, Modal, OutlinedInput } from 'common';
import { Form, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import styles from '../../../Registration.module.scss';

interface ImportAccountModalProps {
  open: boolean;
  onClose: (data?: any) => void;
  onSubmit: (data?: any) => void;
}

const initialValues = { password: '' };
type Values = typeof initialValues;

class ImportAccountModalComponent extends React.PureComponent<ImportAccountModalProps & WithTranslation> {
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
                  {this.props.t('importAccount')}
                </div>
                <div className={styles.exportModalTitle}>
                  {this.props.t('pleaseEnterYourPassword')}
                </div>
              </div>
              <OutlinedInput
                inputRef={(input) => input && input.focus()}
                placeholder={this.props.t('password')!}
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
                {this.props.t('next')}
              </Button>
            </Form>
          )}
        </Formik>
      </Modal>

    );
  }
}

export const ImportAccountModal = withTranslation()(ImportAccountModalComponent);
