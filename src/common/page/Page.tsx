import React from 'react';
import classnames from 'classnames';
import styles from './Page.module.scss';

interface PageProps extends React.ComponentProps<any> {
  className?: string;
  contentClassName?: string;
  loading?: boolean;
  title?: string;
}

export const Page: React.FC<PageProps> = (props: PageProps) => {
  const {
    className,
    contentClassName,
    children,
    title,
  } = props;

  return <div className={classnames(styles.page, className)}>
    {
      title &&
      <h1 className={styles.pageTitle}>{title}</h1>
    }
    <div className={classnames(contentClassName, styles.pageContent)}>
      {children}
    </div>
  </div>;
};
