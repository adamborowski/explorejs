import React from 'react';
import {Link} from 'react-router';
import NavLink from './NavLink';

export default (props) => (
  <div>
    <Link to={props.basePath}><h4>{props.header}</h4></Link>
    <ul
      className="nav nav-sidebar">
      {props.items.map((item, index) =>
        (<NavLink key={item.name} to={`${props.basePath}${item.link}`} activeClassName="active">
          Scenario {index + 1}
        </NavLink>)
      )}
    </ul>
  </div>
);
