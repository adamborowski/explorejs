import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';
import * as actions from '../../../actions/testingActions';
import Stars from '../../common/Stars';
import {getFirstWhichHasToBeScored, scenarioByIdSelector, scenarioSelector} from '../../../selectors/testingSelectors';
import dateformat from 'dateformat';
import {push} from 'react-router-redux';
import Slider from '../../common/Slider';
import './ScenarioPage.scss';
import nextPrevHelper from '../../../utils/next-prev-helper.js';
import trans from '../../../translations/trans';

// Since this component is simple and static, there's no parent container for it.
const ScenarioPage = trans()((props, {trans, dynamicTrans}) => {

  const {scenario, scenarios, scenarioToScore} = props;

  const sessions = scenario.sessions.toRefArray();

  const answers = scenario.answers;
  const question = scenario.question;

  const session = sessions[sessions.length - 1];
  const score = sessions.length ? session.score : null;

  const DATE_FORMAT = 'yyyy-mm-dd HH:MM:ss';

  const iconStyle = {marginLeft: '5px', fontSize: '0.9em'};

  const navHandler = nextPrevHelper(scenarios, scenario, (sc) => props.navigate(`/scenario/${sc.id}`), s => s.id === scenario.ref.id);

  return (
    <div className="scenario-page">
      <div className="jumbotron">
        <h2 className="page-header">

          {trans('general.configuration')} &raquo; &nbsp;
          <small>{dynamicTrans(scenario.name)}</small>
        </h2>
        { scenario.description && scenario.description() }

      </div>

      {
        sessions.length > 0 && <div>
          <p style={{textAlign: 'center', fontSize: '1.5em'}}>
            {dynamicTrans(question)}
          </p>
          <Slider style={{minHeight: 140}} width={400} height={80}
                  ticks={answers.map(a => ({...a, label: dynamicTrans(a.label)}))} value={score}
                  onChange={(newScore) => props.actions.scoreSession(scenario.id, session.id, false, Number(newScore))}
          />
          <div className="text-center">

            { score === null && <div className="alert alert-warning" role="alert" style={{display: 'inline-block'}}>
              <p>
                {trans('scenario.pleasePutScore')}
              </p>

            </div>


            }
            <br/>
            <div className="btn-group" role="group" aria-label="...">
              <a onClick={navHandler.handlePrev} disabled={!navHandler.canPrev()} className="btn btn-default"
                 type="submit">
                <span className="glyphicon glyphicon-menu-left" aria-hidden="true" style={{fontSize: '0.9em'}}/>
                {trans('scenario.back')}
              </a>
              <a onClick={() => props.actions.createSession(scenario.id)} className="btn btn-default"
                 type="submit">
                {trans('scenario.again')}
                <span className="glyphicon glyphicon-repeat" aria-hidden="true" style={iconStyle}/>
              </a>
              <a onClick={navHandler.handleNext} disabled={!navHandler.canNext()} className="btn btn-primary"
                 type="submit">
                {trans('scenario.next')}
                <span className="glyphicon glyphicon-menu-right" aria-hidden="true" style={iconStyle}/>
              </a>
            </div>
          </div>
        </div>

      }
      {
        sessions.length === 0 ? (
          <div className="text-center">
            {scenarioToScore && scenarioToScore.id !== scenario.id ? (
              <div className="alert alert-danger text-center" role="alert" style={{display: 'inline-block'}}>
                <strong>{trans('session.wrongOrderWarningHeader')}</strong>
                {trans('session.wrongOrderWarning', dynamicTrans(scenarioToScore.name))}
              </div>
            ) :
              (<p>Click button below to experience visual exploration of large dataset with this configuration, then
                score
                it.</p>)
            }
            <br/>
            <a onClick={() => props.actions.createSession(scenario.id)} className="btn btn-success btn-lg"
               type="submit">Start!</a>
          </div>
        ) : null

      }

      <div className="list-group">
        {
          props.adminMode && scenario.sessions.toRefArray().map((session) =>
            (<Link key={session.id} href="#" className="list-group-item"
                   to={`/scenario/${scenario.id}/session/${session.id}`}>
              <h4 className="list-group-item-heading">{`${dateformat(session.start, DATE_FORMAT)}`}</h4>
              <Stars small={true} maxValue={10}
                     value={session.score}/>
            </Link>)
          )
        }

      </div>


      {props.children}

    </div>
  );
});

ScenarioPage.propTypes = {
  actions: React.PropTypes.object,
  adminMode: React.PropTypes.bool
};

const mapStateToProps = (state, ownProps) => ({
  scenario: ownProps.params.scenarioId == null ? null : scenarioByIdSelector(state, ownProps.params.scenarioId),
  scenarios: scenarioSelector(state),
  adminMode: state.testing.adminMode,
  scenarioToScore: getFirstWhichHasToBeScored(state)
});

const mapActionsToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  navigate: (route) => dispatch(push(route))
});

export default connect(mapStateToProps, mapActionsToProps)(ScenarioPage);
