import React, { PropsWithChildren, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionClasses,
  AccordionSummaryClasses,
  AccordionDetailsClasses,
} from '@mui/material';

import { ChevronDownIcon } from 'common/icons/ChevronDown';
import cn from 'classnames';
import styles from './CardTableValueAccordion.module.scss';

const accordionClasses: Partial<AccordionClasses> = { root: styles.accordionRoot };
const accordionSummaryClasses: Partial<AccordionSummaryClasses> = {
  root: styles.accordionSummaryRoot,
  content: styles.accordionSummaryContent,
  expandIconWrapper: styles.accordionSummaryExpandIconWrapper,
};
const accordionDetailsClasses: Partial<AccordionDetailsClasses> = { root: styles.accordionDetailsRoot };

interface CardTableValueAccordionProps {
  keyLabel: string;
  valueLabel: string;
}

const CardTableValueAccordion: React.FC<PropsWithChildren<CardTableValueAccordionProps>> = ({
  keyLabel,
  valueLabel,
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className={cn(styles.accordionWrapper, isExpanded && styles.active)}>
      <div className={styles.accordionKeyLabel}>{keyLabel}</div>
      <Accordion classes={accordionClasses} disableGutters onChange={(e, expanded) => setIsExpanded(expanded)}>
        <AccordionSummary
          expandIcon={<ChevronDownIcon className={styles.accordionSummaryExpandIcon} />}
          classes={accordionSummaryClasses}
        >
          {valueLabel}
        </AccordionSummary>
        <AccordionDetails classes={accordionDetailsClasses}>{children}</AccordionDetails>
      </Accordion>
    </div>
  );
};

export default CardTableValueAccordion;
