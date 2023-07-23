import React from 'react';
import classnames from 'classnames';
import { Button } from '@mui/material';
import { branchCallFunction } from '../utils/common';
import styles from './Linkblock.module.scss';
import { UnknownFunctionType } from '../typings/common';

interface LinkBlockProps {
  className?: string;
  title: string;
  titleClassName?: string;
  description?: string;
  descriptionClassName?: string;
  contentRenderer?: UnknownFunctionType;
  buttonTitle?: string;
  onClick?: any;
  hideButton?: boolean;
}

export const LinkBlock: React.FC<LinkBlockProps> = (props) => {
  const {
    title,
    titleClassName,
    description,
    descriptionClassName,
    buttonTitle = '→',
    contentRenderer,
    className,
    onClick,
    hideButton,
  } = props;

  const renderLink = React.useCallback(() => <>
    <div className={classnames(styles.title, titleClassName)}>{title}</div>
    <div className={classnames(styles.description, descriptionClassName)}>{description}</div>
    {
        !hideButton &&
        <Button
          color={'primary'}
          variant="contained"
          className={styles.linkButton}
        >
          {buttonTitle}
        </Button>
      }
  </>, [buttonTitle, description, descriptionClassName, title, titleClassName, hideButton]);

  return <div className={classnames(styles.linkBlock, className)} onClick={onClick}>
    {branchCallFunction(contentRenderer, renderLink)}
  </div>;
};
