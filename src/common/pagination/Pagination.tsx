import React from 'react';
import IconButton from '../iconButton/IconButton';
import {
  ArrowL,
  ArrowLDisabled,
  ArrowR,
  ArrowRDisabled,
} from '../icons';

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

    if (current + 1 > max) {
      return;
    }

    onNext();
  };

  handlePrevClick = () => {
    const {
      current,
      min,
      onPrev,
    } = this.props;

    if (current - 1 < min) {
      return;
    }

    onPrev();
  };

  render() {
    const {
      current,
      max,
    } = this.props;
    const { disabledNext, disabledPrev } = this.state;

    return <div>
      <IconButton onClick={this.handlePrevClick}>
        {disabledPrev ? <ArrowLDisabled /> : <ArrowL />}
      </IconButton>
      <div>{`${current}/${max}`}</div>
      <IconButton onClick={this.handleNextClick}>
        {disabledNext ? <ArrowRDisabled /> : <ArrowR />}
      </IconButton>
    </div>;
  }
}
