import React from 'react';
import PropTypes from 'prop-types';
import {bins, calculateSessionStats} from '../../services/result-service';
import Histogram from '../summary/Historgram';
import {createBin, objectToArray} from '../../utils';
import _ from 'lodash';
import {calculateCacheHit, getHistogramDataForCacheHit} from '../../services/session-stat-service';

export default class RecordingInfo extends React.Component {

  static propTypes = {
    sessionObject: PropTypes.object,
    stats: PropTypes.object,
    cacheHitStats: PropTypes.object,
    name: PropTypes.string,
    preset: PropTypes.object
  };

  constructor(props) {
    super();
    const calculatedStats = calculateSessionStats(props.stats, props.preset.useCache === false);

    const cacheHitStats = props.preset.useCache && calculateCacheHit(props.stats.viewState, props.stats.cacheDump);
    const cacheHitHistogram = props.preset.useCache && getHistogramDataForCacheHit(cacheHitStats);

    const histogram = bins.map((bin, i) => ({value: bin, count: (calculatedStats.histogram[bin] || []).length}));


    const renderingHistogram = createBin(props.stats.dataSource, [10, 25, 50, 100, 200, 350, 600, 1000, 2000, 4000, 8000], undefined, r => r.span);

    this.state = {
      calculatedStats,
      histogram,
      renderingHistogram,
      cacheHitStats,
      cacheHitHistogram
    }
  }


  render() {
    const {sessionObject, name, stats} = this.props;
    const {histogram, calculatedStats, renderingHistogram, cacheHitStats, cacheHitHistogram} = this.state;

    const getSessionDuration = () => {
      const start = stats.viewState[0].time;
      const end = stats.viewState[stats.viewState.length - 1].time;
      return Math.floor(end - start) / 1000;
    };

    return <div>
      <h4>Recording info: {name} (session took {getSessionDuration()}s)</h4>

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
        <tr>
          <th>cache size:</th>
          <td>{_.toArray(calculatedStats.cacheFill).reduce((sum, c) => sum + c, 0)}</td>
        </tr>
        </tbody>
      </table>
      <h5>User wait time histogram</h5>
      {
        !cacheHitHistogram && <Histogram data={histogram}/>
      }
      {
        cacheHitHistogram && <Histogram data={cacheHitHistogram}/>
      }
      <h5 onMouseOver={() => console.log(stats)}>Chart update time histogram</h5>
      <Histogram data={renderingHistogram} barSpace={20}/>
      <h5>Cache content histogram</h5>
      <Histogram data={objectToArray(calculatedStats.cacheFill, (value, key) => ({value: key, count: value}))}/>
    </div>
  }

}
