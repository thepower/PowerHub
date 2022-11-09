import React from 'react';
import { ToastContainer, ToastContainerProps, Slide } from 'react-toastify';
import styles from './ToastNotification.module.scss';

type ToastNotificationProps = ToastContainerProps;

export const ToastNotification: React.FC<ToastNotificationProps> = (props) => (
  <ToastContainer
    {...props}
    className={styles.toastContainer}
    toastClassName={styles.toast}
    theme={'dark'}
    transition={Slide}
    limit={1}
  />
);
