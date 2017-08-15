import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {formatDate} from '../utils';
import keydown from 'react-keydown';


class ResultList extends React.Component {

  static propTypes = {
    results: PropTypes.arrayOf(PropTypes.object).isRequired,
    currentResult: PropTypes.number,
    onResultClick: PropTypes.func
  };

  @keydown('down')
  onKeyDown(e) {
    e.preventDefault();
    const {currentResult, results, onResultClick} = this.props;
    if (currentResult + 1 < results.length) {
      onResultClick(currentResult + 1);
    }
  }

  @keydown('up')
  onKeyUp(e) {
    e.preventDefault();
    const {currentResult, onResultClick} = this.props;
    if (currentResult > 0) {
      onResultClick(currentResult - 1);
    }
  }

  componentDidUpdate() {
    this.dom.querySelectorAll('.list-group-item')[this.props.currentResult].scrollIntoView(false);
  }

  render() {

    const {results, currentResult, onResultClick} = this.props;


    return <div className="list-group results-list" ref={r=>this.dom=r}>
      {results.map((r, i) => (
        <a key={i}
           href="#"
           className={classes('list-group-item', {active: currentResult === i})}
           onClick={() => onResultClick(i)}
        >
          <h4 className="list-group-item-heading">
            {
              r.name ?
                r.name
                :
                <span className="result-no-name">(no name)</span>
            }
          </h4>
          <p className="list-group-item-text">
            {formatDate(r.time)}
          </p>
        </a>
      ))}
    </div>
  }
}


export default ResultList;
