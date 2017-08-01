import React from 'react';
import {Link} from 'react-router';
import NavLink from './NavLink';
import Slider from './Slider';
import trans from '../../translations/trans';

export default trans()((props, {dynamicTrans, trans}) => {
  const {allScored} = props;
  return (
    <div>
      <Link to={props.basePath}><h4>{props.header}</h4></Link>
      <ul
        className="nav nav-sidebar">
        {props.items.map((item, index) =>
          <NavLink key={item.link} to={`${props.basePath}${item.link}`} activeClassName="active">
            {dynamicTrans(item.name)}
            {item.stars !== null && <span className="glyphicon glyphicon-ok" aria-hidden="true"
                                          style={{color: 'rgb(125, 185, 51)', marginLeft: '5px'}}/>}
            <Slider
              showLabels={false}
              interactive={false}
              width={120}
              height={16}
              tickInnerRadius={5}
              tickOuterRadius={7}
              barHeight={5}
              ticks={props.answers}
              value={item.stars}
            />
          </NavLink>
        )}
        {allScored ? <NavLink to="/summary"><strong>{trans('finalForm.summarize')}</strong></NavLink> : null}
      </ul>
    </div>
  );
});
