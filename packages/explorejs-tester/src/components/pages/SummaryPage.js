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
import Question from '../common/Question';

// Since this component is simple and static, there's no parent container for it.
const ScenarioPage = trans()((props, {trans}) => {

  const {disableForm, canSend} = props;

  return (
    <div className={'scenario-page ' + (disableForm ? 'summary-form-disabled' : '')}
         style={{margin: 'auto', width: 700}}>
      <Alert bsStyle="info">
        <strong>{trans('finalForm.header')}</strong>
        <p> { trans('finalForm.intro') }</p>
      </Alert>
      <div>
        {props.finalForm.questions.map((q, i) => <Question type={q.type}
                                                           key={i}
                                                           question={trans(`finalForm.questions.${i}.question`)}
                                                           onChange={value => props.actions.answerSummaryQuestion(i, value)}
                                                           disabled={disableForm}
                                                           colors={props.colors}
                                                           answers={q.type === 'range' ? trans(`finalForm.questions.${i}.answers`) : null}
                                                           value={props.finalAnswers[i]}/>
        )}
      </div>

      <Button bsStyle="primary" bsSize="large" disabled={!canSend}
              onClick={canSend ? () => props.actions.sendSurvey() : undefined}>{trans('finalForm.send')}</Button>
    </      div >
  );
});

ScenarioPage.propTypes = {
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

export default connect(mapStateToProps, mapActionsToProps)(ScenarioPage);
