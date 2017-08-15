import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import trans from '../../../translations/trans';
import {formatDate} from '../utils';


@connect(mapStateToProps)
class ResultDetailView extends React.Component {

  static propTypes = {
    scenarios: PropTypes.array,
    result: PropTypes.object
  };

  render() {

    const {trans} = this.context;
    const {scenarios, result} = this.props;

    return (
      <div className="results-detail-view">
        <div className="page-header">
          <h3>Response from {result.name || <span className="result-no-name">unknown person</span>}
            <small> {formatDate(result.time)}</small>
          </h3>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  scenarios: PropTypes.array
});

export default trans()(ResultDetailView);
