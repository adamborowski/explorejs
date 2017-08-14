import React from 'react';
import Introduction from './pages/Introduction';
import {addAnalyticsEvent, finishIntroduction} from '../actions/testingActions';
import {connect} from 'react-redux';
import {INTRO_FINISH} from '../analytics';

const mapDispatchToProps = dispatch => ({
  onIntroFinish: (currentSlide, numSlides, visitedSlides, startTime) => {
    dispatch(finishIntroduction());
    dispatch(addAnalyticsEvent(INTRO_FINISH, new Date(), {currentSlide, numSlides, visitedSlides, startTime}))
  }
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
