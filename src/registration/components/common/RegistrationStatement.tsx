import React from 'react';
import styles from '../Registration.module.scss';

interface RegistrationStatementProps {
  title?: string;
  description: string;
}

export const RegistrationStatement: React.FC<RegistrationStatementProps> = (props: RegistrationStatementProps) => {
  return <div className={styles.registrationStatement}>
    {
      props.title &&
      <div className={styles.registrationStatementTitle}>
        {props.title}
      </div>
    }
    <div className={styles.registrationStatementDesc}>
      {props.description}
    </div>
  </div>;
};
