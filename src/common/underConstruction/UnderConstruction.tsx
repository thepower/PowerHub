import { Button } from '@mui/material';
import { push } from 'connected-react-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import { setShowUnderConstruction } from '../../application/slice/applicationSlice';
import { RootState } from '../../application/store';
import { WalletRoutesEnum } from '../../application/typings/routes';
import { Modal } from '../modal/Modal';
import styles from './underConstruction.module.scss';

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
  const { t } = useTranslation();
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
