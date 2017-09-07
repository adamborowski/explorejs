import React from 'react';
import PropTypes from 'prop-types';
import {bins, calculateSessionStats} from '../../services/result-service';
import Histogram from '../summary/Historgram';
import {createBin} from '../../utils';

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


    const renderingHistogram = createBin(props.stats.dataSource, [10, 25, 50, 100, 200, 350, 600, 1000, 2000, 4000, 8000], undefined, r => r.span);

    this.state = {
      calculatedStats,
      histogram,
      renderingHistogram
    }
  }

  render() {
    const {sessionObject, name, stats} = this.props;
    const {histogram, calculatedStats, renderingHistogram} = this.state;

    return <div>
      <h4>Recording info: {name}</h4>

      <table className="table" style={{width: 'auto'}}>
        <tbody>
        <tr>
          <th>number of updates:</th>
          <td>{stats.dataSource && stats.dataSource.length}</td>
        </tr>
        <tr>
          <th>number of requests:</th>
          <td>{stats.requestManager.length}</td>
        </tr>
        <tr>
          <th>number of actions:</th>
          <td>{stats.viewState && stats.viewState.length}</td>
        </tr>
        <tr>
          <th>download size:</th>
          <td>{calculatedStats.totalDataSize}</td>
        </tr>
        </tbody>
      </table>
      <h5>User wait time histogram</h5>
      <Histogram data={histogram}/>
      <h5>Chart update time histogram</h5>
      <Histogram data={renderingHistogram} barSpace={20}/>
    </div>
  }

}
