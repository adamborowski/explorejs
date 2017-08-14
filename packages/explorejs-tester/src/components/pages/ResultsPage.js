import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/testingActions';
import {push} from 'react-router-redux';
// import './ScenarioPage.scss';
import trans from '../../translations/trans';
import Slider from '../common/Slider';
import {Alert, Button} from 'react-bootstrap';
import {canSurveyBeSent, isSurveySentInProgress} from '../../selectors/testingSelectors';

// Since this component is simple and static, there's no parent container for it.
const ResultsPage = (props) => {

  const {disableForm, canSend} = props;

  return (
    <div className="results-page"
         style={{margin: 'auto', width: 700}}>
      <Alert bsStyle="info">
        <p> here is results page</p>
      </Alert>
    </div>
  );
};

ResultsPage.propTypes = {
  actions: React.PropTypes.object,
  adminMode: React.PropTypes.bool
};

const mapStateToProps = (state) => ({
  finalForm: state.testing.finalForm,
  colors: state.testing.answers.map(a => a.color),
  finalAnswers: state.finalAnswers,
  disableForm: isSurveySentInProgress(state),
  canSend: canSurveyBeSent(state)
});

const mapActionsToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  navigate: (route) => dispatch(push(route))
});

export default connect(mapStateToProps, mapActionsToProps)(ResultsPage);
