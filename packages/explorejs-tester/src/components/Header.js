import React from 'react';
import NavLink from './common/NavLink';
import {MenuItem, NavDropdown} from 'react-bootstrap';
import tr, {getSupportedLanguages, setLanguage} from '../translations/language-manager';
import trans from '../translations/trans';


export default trans()(function (props, context) {
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
          <a className="navbar-brand" href="#">{context.trans('general.title')}</a>
        </div>

        <div id="navbar" className="navbar-collapse collapse">
          <ul className="nav navbar-nav navbar-right">
            <NavLink onlyActiveOnIndex={true} to="/" activeClassName="active">Home</NavLink>
            <NavLink to="/scenario" activeClassName="active">Scenarios</NavLink>
            <NavLink to="/fuel-savings" activeClassName="active">Demo</NavLink>
            <NavLink to="/about" activeClassName="active">About</NavLink>
            <NavDropdown style={{width: 90}} eventKey={3} title={tr(`languages.${context.language}`)}
                         id="basic-nav-dropdown"
                         onSelect={setLanguage}
            >
              {
                getSupportedLanguages().map(s => <MenuItem key={s} disabled={s === context.language}
                                                           eventKey={s}>{tr(`languages.${s}`)}</MenuItem>)
              }
            </NavDropdown>
          </ul>
          <form className="navbar-form navbar-right">
            <input type="text" className="form-control" placeholder="Search..."/>
          </form>
        </div>
      </div>
    </nav>
  );
});
