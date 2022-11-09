/* eslint-disable react/button-has-type */
import React from 'react';
import cn from 'classnames';
import styles from './Button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'outlined' | 'filled';
  size?: 'medium' | 'large',
  StartIcon?: React.ReactElement;
  EndIcon?: React.ReactElement;
}

const Button: React.FC<ButtonProps> = ({
  StartIcon,
  EndIcon,
  variant,
  children,
  size = 'medium',
  className,
  ...btnProps
}) => (
  <button
    {...btnProps}
    className={cn(styles.button, styles[variant], styles[size], className)}
  >
    {StartIcon}
    <span className={styles.text}>
      {children}
    </span>
    {EndIcon}
  </button>
);

export default Button;
