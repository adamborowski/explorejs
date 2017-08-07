import React from 'react';
import {Link} from 'react-router';
import trans from '../translations/trans';
import Introduction from './pages/Introduction';

const HomePage = trans()((props, {trans}) => {
  return (
    <div style={{maxWidth:1000, margin:'auto'}}>
      <h1 className="page-header">ExploreJS</h1>
      <div className="well" style={{fontSize: '1.2em'}}>

        <Introduction/>
      </div>
    </div>
  );
});

export default HomePage;
