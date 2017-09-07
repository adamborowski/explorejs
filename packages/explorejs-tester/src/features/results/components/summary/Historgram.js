import React from 'react';
import PropTypes from 'prop-types';

const types = ['Basic', '+Cache', '+Projection', '+Predition', '+Optimization'];

const Histogram = (props) => {

  const {vSpace, marginTop, barSpace, barWidth, data, maxValue} = props;
  const maxCount = maxValue === undefined ? data.reduce((tmp, {count}) => Math.max(count, tmp), 0) : maxValue;


  return <svg width={data.length * (barWidth + barSpace) + barSpace} height={vSpace + marginTop}>
    {
      data.map(({value, count}, i) => {
        const height = Math.max(1, count * vSpace / maxCount);
        return <g key={value} transform={`translate(${i * (barWidth + barSpace) + barSpace},0)`}>
          <text x={barWidth / 2} y={vSpace + marginTop} fontFamily="Verdana" fontSize="12" width={barWidth}
                textAnchor="middle">
            {/*histogram label*/}
            {value}
          </text>
          <text x={barWidth / 2} y={vSpace - 12 - height + marginTop} fontFamily="Verdana" fontSize="12"
                width={barWidth + vSpace}
                textAnchor="middle">
            {/*value over bar*/}
            {Math.floor(count * 100) / 100}
          </text>
          <rect fill="#ffcc33" x="0" y={vSpace - 10 - height + marginTop} height={height} width={barWidth}/>

        </g>;
      })
    }
  </svg>
}

Histogram.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.any,
    count: PropTypes.number
  })),
  marginTop: PropTypes.number,
  vSpace: PropTypes.number,
  barWidth: PropTypes.number,
  barSpace: PropTypes.number,
  maxValue: PropTypes.number
};

Histogram.defaultProps = {
  marginTop: 20,
  vSpace: 80,
  barWidth: 20,
  barSpace: 10
};
export default Histogram;
