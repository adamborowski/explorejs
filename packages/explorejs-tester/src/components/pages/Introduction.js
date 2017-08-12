import React from 'react';
import PropTypes from 'prop-types';
import {Pager, Well} from 'react-bootstrap';
import {Link} from 'react-router';

export default class Introduction extends React.Component {

  static contextTypes = {
    trans: PropTypes.func
  };

  static propTypes = {
    onFinish: PropTypes.func
  };

  constructor() {
    super();
    this.state = {
      currentSlide: 0,
      numSlides: 9
    };
  }

  handleNext() {
    if (this.canNext()) {
      this.setState({currentSlide: this.state.currentSlide + 1});
    }
  }

  canNext(state = this.state) {
    return state.currentSlide + 1 < state.numSlides;
  }

  handlePrev() {
    if (this.canPrev()) {
      this.setState({currentSlide: this.state.currentSlide - 1});
    }
  }

  canPrev(state = this.state) {
    return state.currentSlide > 0;
  }

  render() {

    const {trans} = this.context;

    const {currentSlide, numSlides} = this.state;

    const {onFinish} = this.props;

    return <div>
      {trans('general.intro', currentSlide)}
      <Pager>
        {this.canPrev() && <Pager.Item previous onClick={::this.handlePrev}>&larr; {trans('general.prevPage')}</Pager.Item>}
        {this.canNext() && <Pager.Item next onClick={::this.handleNext}>{trans('general.nextPage')} &rarr;</Pager.Item>}
      </Pager>
      {this.canNext() === false &&
      <p className="text-center">
        <Link className="btn btn-primary btn-lg" to="/scenario/"
              onClick={e => {
                // e.preventDefault();
                onFinish();
              }}>{trans('general.beginSurvey')}</Link>
      </p> }
    </div>
  }
}
