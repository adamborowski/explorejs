import React from 'react';
import PropTypes from 'prop-types';

export default class RecordingInfo extends React.Component {

  static propTypes = {
    sessionObject: PropTypes.object,
    stats: PropTypes.object,
    name: PropTypes.string
  };

  render() {
    const {sessionObject, name, stats} = this.props;

    return <div>
      <h4>Recording info: {name}</h4>
      <pre>
        {JSON.stringify(stats.viewState)}
      </pre>
    </div>
  }

}
