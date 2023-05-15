import React from 'react';

import cn from 'classnames';
import styles from './CardTable.module.scss';

interface CardTableProps {
  className?: string;
  items: { key: string; value: string }[];
}

const CardTable: React.FC<CardTableProps> = ({ className, items }) => (
  <div className={cn(className, styles.cardTable)}>
    {items.map((item) => (
      <div key={item.key} style={{ display: 'contents' }}>
        <div className={styles.cardTableTitle}>{item.key}</div>
        <div className={styles.cardTableValue}>{item.value?.toString() || '-'}</div>
      </div>
    ))}
  </div>
);

export default CardTable;
