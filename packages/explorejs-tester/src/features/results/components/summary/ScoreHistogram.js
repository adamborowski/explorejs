import React from 'react';
import PropTypes from 'prop-types';
import Histogram from './Historgram';

const types = ['Basic', '+Cache', '+Projection', '+Prediction', '+Optimization'];

export default ({histograms, timingHistograms}) => {

  const maxHistogramValue = timingHistograms.reduce((max, histogram) => Math.max(max, histogram.reduce((max, point) => Math.max(max, point.count), 0)), 0);

  return <div>
    <table className="table">
      <thead>
      <tr>
        <th>version</th>
        <th>scores relative to previous</th>
        <th>timing histogram</th>
      </tr>
      </thead>
      <tbody>
      {histograms.map((h, i) => <tr key={i}>
        <th>{types[i]}</th>
        <td>
          <Histogram data={h}/>
        </td>
        <td>
          <Histogram data={timingHistograms[i]} maxValue={maxHistogramValue}/>
        </td>
      </tr>)}
      </tbody>
    </table>
  </div>;
}
