import React from 'react';
import PropTypes from 'prop-types';

const ResultError = ({message}) => (
  <div className="alert alert-danger" role="alert">
    <span className="glyphicon glyphicon-exclamation-sign" aria-hidden={true} style={{marginRight:10}}/>

    <span className="sr-only">Error:</span>
    {message}
  </div>
);

ResultError.propTypes = {
  message: PropTypes.string.isRequired
};

export default ResultError;
