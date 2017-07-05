import React from 'react';
import {Link} from 'react-router';
import trans from '../translations/trans';

const HomePage = trans()((props, {trans}) => {
  return (
    <div>
      <h1 className="page-header">ExploreJS</h1>
      <div className="jumbotron" style={{fontSize: '1.2em'}}>

        {trans('general.intro')}
        <p>
          <Link className="btn btn-primary btn-lg" to="/scenario/">{trans('general.beginSurvey')}</Link>
        </p>
      </div>
    </div>
  );
});

export default HomePage;
