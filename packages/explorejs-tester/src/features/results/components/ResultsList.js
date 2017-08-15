import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {formatDate} from '../utils';


const format = 'YYYY-MM-DD HH:mm';

const ResultList = ({results, currentResult, onResultClick}) => {


  return <div className="list-group">
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
};

ResultList.propTypes = {
  results: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentResult: PropTypes.number,
  onResultClick: PropTypes.func
};

export default ResultList;
