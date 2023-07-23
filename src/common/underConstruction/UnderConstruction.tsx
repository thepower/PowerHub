import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Button } from '@mui/material';
import { push } from 'connected-react-router';
import { t } from 'i18next';
import { setShowUnderConstruction } from '../../application/slice/applicationSlice';
import { Modal } from '../modal/Modal';
import { WalletRoutesEnum } from '../../application/typings/routes';
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
    routeTo(WalletRoutesEnum.root);
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
        {t('goodJob')}
      </div>
      <div className={styles.underConstructionTitle}>
        {t('thisFeatureIsCurrentlyUnderConstruction')}
      </div>
      <div className={styles.underConstructionTitle}>
        {t('thankYouImportantToUs')}
      </div>
    </div>
    <Button
      className={styles.toHomeButton}
      variant="contained"
      size="large"
      onClick={handleProceedToHome}
    >
      {t('toHome')}
    </Button>
  </Modal>;
};

export const UnderConstruction = connector(UnderConstructionComponent);
