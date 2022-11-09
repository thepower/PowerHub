import React from 'react';
import classnames from 'classnames';
import styles from '../Registration.module.scss';

interface RegistrationBackgroundProps extends React.PropsWithChildren {
  className?: string;
}

export const RegistrationBackground: React.FC<RegistrationBackgroundProps> = (props) => (
  <div className={classnames(styles.registrationBackground, props.className)}>
    {props.children}
  </div>
);
