import React from 'react';
import NavLink from './common/NavLink';
import {MenuItem, NavDropdown} from 'react-bootstrap';
import tr, {getSupportedLanguages, setLanguage} from '../translations/language-manager';
import trans from '../translations/trans';


export default trans()(function (props, {trans, language}) {
  return (
    <nav className="navbar navbar-inverse navbar-fixed-top">
      <div className="container-fluid">
        <div className="navbar-header">
          <a className="navbar-brand" href="#">{trans('general.title')}</a>
        </div>

        <div id="navbar" className="navbar-collapse collapse">
          <ul className="nav navbar-nav navbar-right">
            <NavLink onlyActiveOnIndex={true} to="/" activeClassName="active">{trans('menu.home')}</NavLink>
            <NavLink to="/scenario" activeClassName="active">{trans('menu.survey')}</NavLink>
            <NavLink to="/about" activeClassName="active">About</NavLink>
            <NavDropdown style={{width: 90}} eventKey={3} title={tr(`languages.${language}`)}
                         id="basic-nav-dropdown"
                         onSelect={setLanguage}
            >
              {
                getSupportedLanguages().map(s => <MenuItem key={s} disabled={s === language}
                                                           eventKey={s}>{tr(`languages.${s}`)}</MenuItem>)
              }
            </NavDropdown>
          </ul>
        </div>
      </div>
    </nav>
  );
});
