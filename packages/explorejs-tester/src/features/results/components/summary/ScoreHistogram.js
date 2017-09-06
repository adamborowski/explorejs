import React from 'react';
import PropTypes from 'prop-types';
import Histogram from './Historgram';

const types = ['Basic', '+Cache', '+Projection', '+Predition', '+Optimization'];

export default ({histograms, timingHistograms}) => <div>
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
        <Histogram data={timingHistograms[i]}/>
      </td>
    </tr>)}
    </tbody>
  </table>
</div>
