import React from 'react';
import { DialogActions, Button } from '@mui/material';
import { Modal, ModalProps } from './Modal';
import styles from './Modal.module.scss';

interface ConfirmModalProps extends ModalProps {
  onMainSubmit?: () => void;
  onSecondarySubmit?: () => void;
  mainButtonLabel?: string;
  secondaryButtonLabel?: string;
  hideSecondaryButton?: boolean;
  disableMainButton?: boolean;
  disableSecondaryButton?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = (props: ConfirmModalProps) => {
  const {
    onClose = () => {},
    onMainSubmit,
    onSecondarySubmit,
    mainButtonLabel = 'Удалить',
    secondaryButtonLabel = 'Отмена',
    children,
    hideSecondaryButton,
    disableMainButton,
    disableSecondaryButton,
    ...otherProps
  } = props;

  const handleMainButtonClick = React.useCallback(() => {
    if (onMainSubmit && typeof onMainSubmit === 'function') {
      onMainSubmit();
    } else {
      onClose();
    }
  }, [onClose, onMainSubmit]);

  const handleSecondaryButtonClick = React.useCallback(() => {
    if (onSecondarySubmit && typeof onSecondarySubmit === 'function') {
      onSecondarySubmit();
    } else {
      onClose();
    }
  }, [onClose, onSecondarySubmit]);

  return <Modal
    {...otherProps}
    onClose={onClose}
  >
    <>
      {
        !!children &&
        <>{children}</>
      }
    </>
    <DialogActions className={styles.confirmModalActions}>
      <Button
        className={styles.modalButton}
        onClick={handleMainButtonClick}
        variant={'contained'}
        disabled={disableMainButton}
      >
        {mainButtonLabel}
      </Button>
      {
        !hideSecondaryButton &&
        <Button
          className={styles.modalButton}
          onClick={handleSecondaryButtonClick}
          variant={'text'}
          disabled={disableSecondaryButton}
        >
          {secondaryButtonLabel}
        </Button>
      }
    </DialogActions>
  </Modal>;
};
