import React from 'react';
import Slider from '../../../components/common/Slider';

export default ({scores, possibleAnswers})=>(
  <ul className="list-group">
    {scores.map((s, i) => (
      <li key={i} className="list-group-item">
        <Slider
          style={{padding: 5, float: 'right'}}
          showLabels={false}
          interactive={false}
          width={120}
          height={16}
          tickInnerRadius={5}
          tickOuterRadius={7}
          barHeight={5}
          ticks={possibleAnswers}
          value={s.score}
        />
        <h4 className="list-group-item-heading">
          {s.name}
        </h4>
      </li>
    ))}
  </ul>
)
