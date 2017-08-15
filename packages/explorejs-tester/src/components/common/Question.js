import React from 'react';
import PropTypes from 'prop-types';
import Slider from './Slider';

const Question = ({type, question, answers, value, onChange, disabled, colors}) => {
  const header = <p>{question}</p>;

  let answer;

  if (type === 'range') {
    answer = <div style={{width: 410, margin: 'auto'}}>
      <Slider width={(answers.length - 1) * 100}
              height={32}
              tickInnerRadius={12}
              tickOuterRadius={15}
              barHeight={8}
              value={value}
              interactive={onChange !== undefined}
              ticks={answers.map((answer, i) => ({
                key: i,
                label: answer,
                color: colors[i]
              }))}
              style={{overflow: 'visible'}}
              onChange={e => onChange(e)}
      />
    </div>
  }
  else if (type === 'text') {
    answer =
      <input className="form-control"
             type="text"
             value={value || ''}
             placeholder={question}
             disabled={disabled}
             onChange={a => onChange(a.currentTarget.value)}
      />
  }

  return <div>
    {header}
    <div style={{height: 60}}>
      {answer}
    </div>
  </div>
};

Question.propTypes = {
  type: PropTypes.oneOf(['range', 'text']).isRequired,
  question: PropTypes.string.isRequired,
  answers: PropTypes.array,
  value: PropTypes.any,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  colors: PropTypes.array
};

Question.defaultProps = {
  disabled: false
};

export default Question;
