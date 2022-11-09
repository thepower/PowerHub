import React, { useCallback, useRef } from 'react';
import cn from 'classnames';
import { CopySvg } from '../icons';
import styles from './CopyButton.module.scss';

interface CopyButtonProps {
  textButton: string;
  copyInfo?: string;
  className?: string;
  iconClassName?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({
  textButton,
  className,
  copyInfo,
  iconClassName,
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const handleClick = useCallback(() => {
    if (ref.current) {
      navigator.clipboard.writeText(copyInfo || ref.current.textContent || '');
    }
  }, [copyInfo]);

  return (
    <button type="button" className={cn(styles.copyData, className)} ref={ref} onClick={handleClick}>
      {textButton}
      <CopySvg className={iconClassName} />
    </button>
  );
};

export default CopyButton;
