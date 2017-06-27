import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Slider.scss';

export default class extends Component {

  static displayName = 'ScoreSlider';
  static propTypes = {
    ticks: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired
    })).isRequired,
    value: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    barHeight: PropTypes.number,
    tickOuterRadius: PropTypes.number,
    tickInnerRadius: PropTypes.number,
    onChange: PropTypes.func
  };
  static defaultProps = {
    width: 400,
    tickOuterRadius: 11,
    tickInnerRadius: 7,
    height: 30,
    barHeight: 9
  };

  constructor(props) {
    super(props);
    this.state = {
      hoveredValue: null
    };
  }

  onHover = (value) => {
    this.setState({value});
  };

  render() {
    const {ticks, value, width, tickOuterRadius, tickInnerRadius, onChange, height, barHeight} = this.props;
    const {hoveredValue} = this.state;

    const numTicks = ticks.length;
    const spaceBetweenTicks = (width - (numTicks * tickOuterRadius * 2)) / (numTicks - 1);
    const tickSpread = tickOuterRadius * 2 + spaceBetweenTicks;
    const tickInnerMargin = tickOuterRadius - tickInnerRadius;
    const q = tickOuterRadius / 2;

    const createBgPath = () => {
      const d = `M 0 ${q}`;

      const top = ticks.map((tick, index) => `c 0 ${-q} ${q * 2} ${-q} ${q * 2} 0 ` + (index < ticks.length - 1 ? `l ${spaceBetweenTicks} 0` : ''));
      const bottom = ticks.reverse().map((tick, index) => `c 0 ${q} ${-q * 2} ${q} ${-q * 2} 0 ` + (index < ticks.length - 1 ? `l ${-spaceBetweenTicks} 0` : ''));

      return [d, ...top, 'l 0 10', ...bottom, 'z'].join(' ');
    };

    return (
      <svg width={width} className="score-slider">
        <clipPath id="cp-bg">
          <rect x={q} y={(height - barHeight) / 2} width={width - 2 * q} height={barHeight}/>
          {ticks.map((t, index) => <circle key={index}
                                           r={tickOuterRadius}
                                           cx={index * tickSpread + tickOuterRadius}
                                           cy={height / 2}/>)}
        </clipPath>
        <rect x="0" y="0"
              width={width} height={height}
              className="bg" clipPath="url(#cp-bg)"
        />
      </svg>
    );
  }

}
