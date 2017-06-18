import React, {PropTypes} from 'react';
import './Stars.scss';

export const Star = (props) => {
  const numbers = [];
  for (let i = 0; i < props.maxValue; i++) {
    numbers.push(i);
  }
  return (
    <div
      className={`a-stars ${props.onChange ? 'a-editable' : ''} ${props.small && 'a-small'} ${props.tiny && 'a-tiny'}`}
      style={{color: props.color}}>
      {numbers.map((num, i) =>
        <span key={i}
              className={`glyphicon glyphicon-star${i >= props.value ? '-empty' : ''}`}
              aria-hidden="true"
              onClick={() => props.onChange && props.onChange(props.value === i + 1 ? 0 : i + 1)}/>
      )}
    </div>
  )
};

Star.propTypes = {
  maxValue: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  small: PropTypes.bool,
  tiny: PropTypes.bool,
  color: PropTypes.string
};
Star.defaultProps = {
  small: false,
  tiny: false,
};

export default Star;



