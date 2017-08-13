import React from 'react';
import Introduction from './pages/Introduction';
import {finishIntroduction} from '../actions/testingActions';
import {connect} from 'react-redux';

const mapDispatchToProps = dispatch => ({
  onIntroFinish: () => dispatch(finishIntroduction())
});

const HomePage = connect(null, mapDispatchToProps)((props) => {
  return (
    <div style={{maxWidth:1000, margin:'auto'}}>
      <h1 className="page-header">ExploreJS</h1>
      <div className="well" style={{fontSize: '1.3em'}}>

        <Introduction onFinish={props.onIntroFinish}/>
      </div>
    </div>
  );
});

export default HomePage;
