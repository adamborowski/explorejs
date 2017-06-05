import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../../../actions/testingActions';
import Stars from '../../common/Stars';
import NavButtons from './NavButtons';
import {scenarioByIdSelector, sessionByIdSelector} from '../../../selectors/testingSelectors';
import dateformat from 'dateformat';
import {push} from 'react-router-redux';
import {Chart, LocalBinding} from 'explorejs-react';

const DATE_FORMAT = 'yyyy-mm-dd HH:MM:ss';


export const ScenarioSessionPage = (props) => {
  const {scenario, session} = props;

  return (
    <div>
      <NavButtons collection={scenario.sessions.all().toRefArray()} currentItem={session.ref}
                  callback={item => props.navigate(`/scenario/${scenario.id}/session/${item.id}`)}/>
      <h1>{scenario.name}&nbsp;
        <small>Session started at {dateformat(session.start, DATE_FORMAT)}</small>
      </h1>

      <Stars maxValue={10} value={session.score || 0}
             onChange={(numStars) => props.actions.scoreSession(scenario.id, session.id, false, numStars)}/>

      <select className="form-control">
        <option>Dygraphs</option>
        <option>VisJS</option>
        <option>HighCharts</option>
        <option>JqPlot</option>
        <option>flot</option>
        <option>plotly</option>
        {/*TODO on change - change chart type and reinitialize, then fix all adapters, then think about optimizations flags in explorejs*/}
      </select>
      <LocalBinding batch="/api/batch" manifest="/api/manifest" series={['s001']}>
        <Chart serieId="s001" adapter="plotly" prediction={['basic', 'wider-context']}/>
      </LocalBinding>
    </div>
  );
};
ScenarioSessionPage.propTypes = {
  scenario: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
  navigate: PropTypes.func.isRequired,
  actions: PropTypes.object
};


const mapStateToProps = (state, ownProps) => ({
  scenario: scenarioByIdSelector(state, ownProps.params.scenarioId),
  session: sessionByIdSelector(state, ownProps.params.sessionId),
});

const mapActionsToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  navigate: (route) => dispatch(push(route))
});

export default connect(mapStateToProps, mapActionsToProps)(ScenarioSessionPage);
