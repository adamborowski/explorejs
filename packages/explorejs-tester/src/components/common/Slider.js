import React, {Component} from 'react';
import PropTypes from 'prop-types';
import keydown from 'react-keydown';
import './Slider.scss';

let maskId = 0;

export default class extends Component {

  static displayName = 'ScoreSlider';
  static propTypes = {
    ticks: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      key: PropTypes.any.isRequired,
      color: PropTypes.string
    })).isRequired,
    value: PropTypes.any,
    width: PropTypes.number,
    height: PropTypes.number,
    barHeight: PropTypes.number,
    tickOuterRadius: PropTypes.number,
    tickInnerRadius: PropTypes.number,
    onChange: PropTypes.func,
    showLabels: PropTypes.bool,
    interactive: PropTypes.bool,
    style: PropTypes.object
  };
  static defaultProps = {
    width: 350,
    tickOuterRadius: 16,
    tickInnerRadius: 12,
    height: 36,
    barHeight: 6,
    showLabels: true,
    interactive: true
  };

  constructor(props) {
    super(props);
    this.state = {
      hoveredValue: null,
      _mask_id: maskId++
    };
  }

  onHover = (hoveredValue) => {
    this.setState({hoveredValue});
  };

  @keydown('left', 'right')
  onLeftRight(e) {

    if (!this.props.onChange) {
      return;
    }

    const index = this.props.ticks.findIndex(t => t.key === this.props.value);
    let newIndex = index;
    if (e.key === 'ArrowLeft') {
      if (index > 0) {
        newIndex -= 1;
      }
    }
    else if (e.key === 'ArrowRight') {
      if (index < this.props.ticks.length - 1) {
        newIndex += 1;
      }
    }
    this.props.onChange(this.props.ticks[newIndex].key);
  }


  render() {
    const {ticks, value, width, tickOuterRadius, tickInnerRadius, onChange, height, barHeight, showLabels, interactive, style} = this.props;
    const {hoveredValue} = this.state;

    const numTicks = ticks.length;
    const spaceBetweenTicks = (width - (numTicks * tickOuterRadius * 2)) / (numTicks - 1);
    const tickSpread = tickOuterRadius * 2 + spaceBetweenTicks;
    const tickInnerMargin = tickOuterRadius - tickInnerRadius;
    const q = tickOuterRadius / 2;

    const valueTickIndex = ticks.findIndex(s => s.key === value);
    const valueTick = ticks[valueTickIndex];
    const focusTickIndex = hoveredValue == null ? valueTickIndex : ticks.findIndex(s => s.key === hoveredValue);
    const focusTick = ticks[focusTickIndex];

    const maskId = `cp-bg${this.state._mask_id}`;

    return (
      <div className="score-slider-outer" style={style}>
        <svg width={width} className="score-slider" height={height}
             onMouseLeave={() => this.onHover(null)}
             tabIndex={0}
        >
          <clipPath id={maskId}>
            <rect x={q} y={(height - barHeight) / 2} width={width - 2 * q} height={barHeight}/>
            { ticks.map((t, index) => <circle key={index}
                                              r={tickOuterRadius}
                                              cx={index * tickSpread + tickOuterRadius}
                                              cy={height / 2}/>
            )}
          </clipPath>
          <rect x="0" y="0"
                width={width} height={height}
                className="bg" clipPath={`url(#${maskId})`}
          />
          {ticks.map((t, index) => (
              <circle
                className="hover-area"
                key={index}
                r={tickOuterRadius}
                cx={index * tickSpread + tickOuterRadius}
                cy={height / 2}
                onMouseOver={interactive && (() => this.onHover(t.key))}
                onClick={interactive && (() => onChange(t.key))}
              />
            )
          )}
          {ticks.map((t, index) => (
              <circle
                style={{fill: t.color || '#cccccc'}}
                className={`value-area ${t.key === hoveredValue ? 'hovered-area' : ''} ${t.key === value ? 'selected-area' : ''}`}
                key={index}
                r={t.key === value ? tickOuterRadius : (t.key === hoveredValue ? tickInnerRadius : tickOuterRadius / 2)}
                cx={index * tickSpread + tickOuterRadius}
                cy={height / 2}

              />
            )
          )}
        </svg>
        { showLabels && focusTick && <div
          className={`slider-caption ${hoveredValue != value && hoveredValue != null ? 'slider-caption__hovered' : ''}`}
          style={{
            color: focusTick.color,
            left: focusTickIndex * (tickSpread) - width / 2 + tickOuterRadius,
          }}>{focusTick.label}</div>
        }
      </div>
    );
  }

}
