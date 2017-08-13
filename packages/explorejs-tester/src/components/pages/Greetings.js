import React from 'react';
import trans from '../../translations/trans';
import './Greetings.scss';

export default trans()((props, {trans}) => (
  <div className="greetings">

    <div className="jumbotron">
      <h1>{trans('greetings.header')}</h1>
      <p>{trans('greetings.body')}</p>
    </div>
  </div>
));
