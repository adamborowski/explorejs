import React from 'react';
import {APP_TITLE} from '../constants/labels';
import NavLink from './common/NavLink';

export default function () {
  return (
    <nav className="navbar navbar-inverse navbar-fixed-top">
      <div className="container-fluid">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar"
                  aria-expanded="false" aria-controls="navbar">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"/>
            <span className="icon-bar"/>
            <span className="icon-bar"/>
          </button>
          <a className="navbar-brand" href="#">{APP_TITLE}</a>
        </div>
        <div id="navbar" className="navbar-collapse collapse">
          <ul className="nav navbar-nav navbar-right">
            <NavLink onlyActiveOnIndex={true} to="/" activeClassName="active">Home</NavLink>
            <NavLink to="/scenario" activeClassName="active">Scenarios</NavLink>
            <NavLink to="/fuel-savings" activeClassName="active">Demo</NavLink>
            <NavLink to="/about" activeClassName="active">About</NavLink>
          </ul>
          <form className="navbar-form navbar-right">
            <input type="text" className="form-control" placeholder="Search..."/>
          </form>
        </div>
      </div>
    </nav>
  );
}
