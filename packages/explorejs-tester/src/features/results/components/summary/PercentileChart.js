import React from 'react';
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

import {rgb} from 'd3-color';
import PropTypes from 'prop-types';

const PercentileChart = ({data, color, scale, domain, width, height, timingMode, lineType}) => {

  const percentiles = data[0].percentiles;
  const numPercentiles = percentiles.length;
  const middlePtile = Math.floor(numPercentiles / 2);
  const colorFactor = 0.1;


  return <AreaChart width={width} height={height} data={data}>
    <XAxis dataKey="label"/>
    <YAxis domain={['dataMin', 'dataMax']} tickFormatter={f => Math.floor(f * 100) / 100}/>
    <CartesianGrid strokeDasharray="3 3"/>
    <Tooltip itemSorter={(a, b) => parseInt(a.dataKey.substr(1)) - parseInt(b.dataKey.substr(1))}/>
    {
      [...Array(numPercentiles).keys()].map(ptile =>
        <Area key={ptile}
              type={lineType}
              dataKey={(timingMode ? 'a' : 's') + ptile} stackId={0}
              stroke={rgb(color).brighter(Math.abs(ptile - (timingMode ? 0 : numPercentiles / 2)) / numPercentiles ** colorFactor).toString()}
              fill={rgb(color).brighter(Math.abs(ptile - (timingMode ? 0 : numPercentiles / 2)) / numPercentiles ** colorFactor).toString()}
              fillOpacity={!timingMode && ptile === 0 ? 0 : 0.8}

              name={timingMode ? percentiles[ptile] : Math.floor(percentiles[ptile] * 100) + 'p'}
              formatter={(value, name, entry, i) => Math.floor(entry.payload['a' + i] * 100) / 100}
              strokeWidth={(ptile === middlePtile ) ? 3 : 1}
        />)
    }
  </AreaChart>
};

PercentileChart.propTypes = {
  data: PropTypes.array,
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  timingMode: PropTypes.bool,
  lineType: PropTypes.string
};

PercentileChart.defaultProps = {
  color: '#284b30',
  timingMode: false,
  lineType: 'basis'
};

export default PercentileChart;
