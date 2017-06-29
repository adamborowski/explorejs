import React from 'react';
import {Link} from 'react-router';
import NavLink from './NavLink';
import Stars from "./Stars";
import Slider from './Slider';

export default (props) => (
  <div>
    <Link to={props.basePath}><h4>{props.header}</h4></Link>
    <ul
      className="nav nav-sidebar">
      {props.items.map((item, index) =>
        <NavLink key={item.name} to={`${props.basePath}${item.link}`} activeClassName="active">
          {item.name}
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
    </ul>
  </div>
);
