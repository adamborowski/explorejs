import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/testingActions';
import {push} from 'react-router-redux';
// import './ScenarioPage.scss';
import trans from '../../translations/trans';
import Slider from '../common/Slider';
import {Alert, Button} from 'react-bootstrap';

// Since this component is simple and static, there's no parent container for it.
const ScenarioPage = trans()((props, {trans}) => {


  return (
    <div className="scenario-page" style={{margin: 'auto', width: 700}}>
      <Alert bsStyle="info">
        <strong>{trans('finalForm.header')}</strong>
        <p> { trans('finalForm.intro') }</p>
      </Alert>
      <div>
        {props.finalForm.questions.map((q, i) => {
          const type = q.type;
          const question = trans(`finalForm.questions.${i}.question`);
          const header = <p>{question}</p>;

          let answer;

          if (type === 'range') {
            const answers = trans(`finalForm.questions.${i}.answers`);
            answer = <div style={{width: 410}}>
              <Slider width={(answers.length - 1) * 100}
                      height={32}
                      tickInnerRadius={12}
                      tickOuterRadius={15}
                      barHeight={8}
                      value={props.finalAnswers[i]}
                      ticks={answers.map((answer, i) => ({
                        key: i,
                        label: answer,
                        color: props.colors[i]
                      }))}
                      style={{overflow:'visible'}}
                      onChange={e => props.actions.answerSummaryQuestion(i, e)}
              />
            </div>
          }
          else if (type === 'text') {
            answer =
              <input className="form-control"
                     type="text"
                     value={props.finalAnswers[i] || ''}
                     placeholder={trans('finalForm.placeholder')}
                     onChange={(a) => props.actions.answerSummaryQuestion(i, a.currentTarget.value)}
              />
          }

          return <div key={i}>
            {header}
            <div style={{height: 60}}>
              {answer}
            </div>
          </div>
        })}
      </div>

      <Button bsStyle="primary" bsSize="large"
              onClick={() => props.actions.sendSurvey()}>{trans('finalForm.send')}</Button>
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
  finalAnswers: state.finalAnswers
});

const mapActionsToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  navigate: (route) => dispatch(push(route))
});

export default connect(mapStateToProps, mapActionsToProps)(ScenarioPage);
