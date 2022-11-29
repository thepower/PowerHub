import React from 'react';
import IconButton from '../iconButton/IconButton';
import {
  ArrowL,
  ArrowLDisabled,
  ArrowR,
  ArrowRDisabled,
} from '../icons';
import styles from './Pagination.module.scss';

interface PaginationProps {
  min: number;
  max: number;
  current: number;
  onNext: (data?: any) => void;
  onPrev: (data?: any) => void;
}

interface PaginationState {
  disabledPrev: boolean;
  disabledNext: boolean;
}

export class Pagination extends React.PureComponent<PaginationProps, PaginationState> {
  constructor(props: PaginationProps) {
    super(props);

    this.state = {
      disabledNext: props.current === props.max,
      disabledPrev: props.current === props.min,
    };
  }

  handleNextClick = () => {
    const {
      current,
      max,
      onNext,
    } = this.props;

    const newPageNumber = current + 1;

    if (newPageNumber > max) {
      this.setState({ disabledNext: true });
      return;
    }

    onNext(newPageNumber);
    this.setState({
      disabledPrev: false,
      disabledNext: newPageNumber === max,
    });
  };

  handlePrevClick = () => {
    const {
      current,
      min,
      onPrev,
    } = this.props;

    const newPageNumber = current - 1;

    if (newPageNumber < min) {
      this.setState({ disabledPrev: true });
      return;
    }

    this.setState({
      disabledPrev: newPageNumber === min,
      disabledNext: false,
    });
    onPrev(newPageNumber);
  };

  render() {
    const {
      current,
      max,
    } = this.props;
    const { disabledNext, disabledPrev } = this.state;

    return <div className={styles.pagination}>
      <IconButton onClick={this.handlePrevClick}>
        {disabledPrev ? <ArrowLDisabled /> : <ArrowL />}
      </IconButton>
      <div className={styles.text}>
        <span>{current}</span>
        <span className={styles.textOpacity}>{' / '}</span>
        <span className={!disabledNext ? styles.textOpacity : ''}>{max}</span>
      </div>
      <IconButton onClick={this.handleNextClick}>
        {disabledNext ? <ArrowRDisabled /> : <ArrowR />}
      </IconButton>
    </div>;
  }
}
