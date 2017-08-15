import React from 'react';
import PropTypes from 'prop-types';
import {formatDate} from '../utils';

const Analytics = ({analytics, finishTime}) => {
  if (analytics === undefined) {
    return <p>Analytics were not collected</p>
  }
  return <ul className="list-group">
    {
      [...analytics, {key: 'finish', time: finishTime}].map((an, i) => {
        return <li className="list-group-item" key={i}>
          <h4 className='list-group-item-heading'>#{an.key}
            <small className="pull-right"> {formatDate(an.time)}</small>
          </h4>
          {an.parameters && <pre className="list-group-item-text">
          {JSON.stringify(an.parameters, null, 2)}
          </pre>}
        </li>
      })
    }
  </ul>
};

Analytics.propTypes = {
  analytics: PropTypes.array,
  finishTime: PropTypes.any
};


export default Analytics;
