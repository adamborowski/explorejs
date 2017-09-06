import React from 'react';
import PropTypes from 'prop-types';
import {bins, calculateSessionStats} from '../../services/result-service';
import Histogram from '../summary/Historgram';

export default class RecordingInfo extends React.Component {

  static propTypes = {
    sessionObject: PropTypes.object,
    stats: PropTypes.object,
    name: PropTypes.string
  };

  constructor(props) {
    super();
    const calculatedStats = calculateSessionStats(props.stats, props.sessionObject.scenario === 0); //todo można poprawić liczenie statystyk - rejestrować udpate cache (same indeksy), potem to można wykorzystać zamiast requests parując z viewstate
    const histogram = bins.map((bin, i) => ({value: bin, count: (calculatedStats.histogram[bin] || []).length}));

    this.state = {
      calculatedStats,
      histogram
    }
  }

  render() {
    const {sessionObject, name, stats} = this.props;
    const {histogram, calculatedStats} = this.state;

    return <div>
      <h4>Recording info: {name}</h4>
      <Histogram data={histogram}/>
    </div>
  }

}
