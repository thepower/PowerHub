import React from 'react';
import { Pagination, PaginationProps } from 'common/pagination/Pagination';
import classnames from 'classnames';
import styles from './Pagination.module.scss';

interface PaginationListProps extends PaginationProps, React.PropsWithChildren {
  bottomPaginationClassName?: string;
  topPaginationClassName?: string;
}

export class PaginationList extends React.PureComponent<PaginationListProps> {
  render() {
    const {
      current,
      onNext,
      onPrev,
      children,
      min,
      max,
      bottomPaginationClassName,
      topPaginationClassName,
    } = this.props;

    return <>
      <Pagination
        className={classnames(topPaginationClassName, styles.paginationListTop)}
        min={min}
        max={max}
        current={current}
        onNext={onNext}
        onPrev={onPrev}
      />
      {children}
      <Pagination
        className={bottomPaginationClassName}
        min={min}
        max={max}
        current={current}
        onNext={onNext}
        onPrev={onPrev}
      />
    </>;
  }
}
