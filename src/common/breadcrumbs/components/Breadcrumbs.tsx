import React from 'react';
import cn from 'classnames';
import ChevronRight from '@mui/icons-material/ChevronRight';
import styles from './Breadcrumbs.module.scss';
import { BreadcrumbsDataType, BreadcrumbsTypeEnum } from '../typings/breadcrumbsTypings';

interface BreadcrumbsProps {
  currentStep: number;
  breadcrumbs: BreadcrumbsDataType[];
  setCurrentStep: (step: number) => void;
  className?: string;
  type: BreadcrumbsTypeEnum;
  breadCrumbHasBorder?: boolean;
  breadCrumbClassName?: string;
}

export class Breadcrumbs extends React.PureComponent<BreadcrumbsProps, any> {
  handleSetCurrentBreadcrumb = (index: number) => () => {
    const { setCurrentStep, type } = this.props;
    const notDirectionMode = type !== BreadcrumbsTypeEnum.direction;
    if (notDirectionMode) {
      setCurrentStep(index);
    }
  };

  renderBreadcrumb = (breadcrumb: BreadcrumbsDataType, index: number): React.ReactNode => {
    const {
      currentStep,
      breadcrumbs,
      breadCrumbClassName,
      type,
    } = this.props;

    const isSelectedBreadcrumb = index === currentStep;
    const isLastBreadcrumb = index === breadcrumbs.length - 1;
    const { label } = breadcrumb;

    return <div
      key={index}
      onClick={this.handleSetCurrentBreadcrumb(index)}
      className={cn(styles.breadcrumb, isSelectedBreadcrumb && styles.selectedBreadcrumb, breadCrumbClassName)}
    >
      {
        type === BreadcrumbsTypeEnum.direction &&
        <span className={styles.breadcrumbIndex}>{index + 1}</span>
      }
      <span className={styles.breadcrumbLabel}>{label}</span>
      {!isLastBreadcrumb && (
        <ChevronRight
          className={cn(
            styles.breadcrumbIcon,
            isSelectedBreadcrumb && styles.selectedBreadcrumbIcon,
          )}
        />
      )}
    </div>;
  };

  render() {
    const {
      breadcrumbs,
      className,
      type,
      breadCrumbHasBorder,
    } = this.props;

    const breadcrumbsData = Array.from(breadcrumbs.values());
    const notDirectionMode = type !== BreadcrumbsTypeEnum.direction;

    if (!breadcrumbsData.length) {
      return null;
    }

    return (
      <div className={cn(styles.breadcrumbs, breadCrumbHasBorder && styles.breadcrumbsHolderBordered)}>
        <div
          className={cn(
            className,
            styles.breadcrumbsHolder,
            notDirectionMode && styles.tabsBreadcrumbsHolder,
            styles[`tabsBreadcrumbsHolder_${type}`],
          )}
        >
          {breadcrumbsData.map(this.renderBreadcrumb)}
        </div>
      </div>
    );
  }
}
