import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Button } from '@mui/material';
import { push } from 'connected-react-router';
import { setShowUnderConstruction } from '../../application/slice/applicationSlice';
import { Modal } from '../modal/Modal';
import { RoutesEnum } from '../../application/typings/routes';
import styles from './underConstruction.module.scss';
import { RootState } from '../../application/store';

const mapStateToProps = (state: RootState) => ({
  showUnderConstruction: state.applicationData.showUnderConstruction,
});

const mapDispatchToProps = {
  setShowUnderConstruction,
  routeTo: push,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type UnderConstructionProps = ConnectedProps<typeof connector>;

const UnderConstructionComponent: React.FC<UnderConstructionProps> = (props: UnderConstructionProps) => {
  const {
    setShowUnderConstruction,
    showUnderConstruction,
    routeTo,
  } = props;

  const handleCloseModal = React.useCallback(() => {
    setShowUnderConstruction(false);
  }, [setShowUnderConstruction]);

  const handleProceedToHome = React.useCallback(() => {
    routeTo(RoutesEnum.root);
    handleCloseModal();
  }, [handleCloseModal, routeTo]);

  return <Modal
    contentClassName={styles.underConstructionContent}
    onClose={handleCloseModal}
    open={showUnderConstruction}
    className={styles.underConstruction}
    alwaysShowCloseIcon
  >
    <div className={styles.underConstructionTitleHolder}>
      <div className={styles.underConstructionTitle}>
        {'Good job!'}
      </div>
      <div className={styles.underConstructionTitle}>
        {'This feature is currently under construction. But your actions make us better'}
      </div>
      <div className={styles.underConstructionTitle}>
        {'Thank you, it\'s very important to us!'}
      </div>
    </div>
    <Button
      className={styles.toHomeButton}
      variant="contained"
      size="large"
      onClick={handleProceedToHome}
    >
      {'To home'}
    </Button>
  </Modal>;
};

export const UnderConstruction = connector(UnderConstructionComponent);
