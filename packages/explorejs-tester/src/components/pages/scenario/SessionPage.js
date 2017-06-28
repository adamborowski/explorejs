import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../../../actions/testingActions';
import Stars from '../../common/Stars';
import NavButtons from './NavButtons';
import {scenarioByIdSelector, sessionByIdSelector} from '../../../selectors/testingSelectors';
import dateformat from 'dateformat';
import {push} from 'react-router-redux';
import {Chart, LocalBinding, adapterTypes} from 'explorejs-react';
import Slider from '../../common/Slider';
import './SessionPage.scss';


const DATE_FORMAT = 'yyyy-mm-dd HH:MM:ss';


export const ScenarioSessionPage = (props) => {
  const {scenario, session} = props;

  const ticks = [
    {color: '#980400', key: '-2', label: 'much worse'},//todo add color prop
    {color: '#aa891f', key: '-1', label: 'a little worse'},
    {color: '#6e6d67', key: '0', label: 'no difference / hard to say'},
    {color: '#4fcc21', key: '1', label: 'slightly better'},
    {color: '#00a13b', key: '2', label: 'incomparably better'},
  ];

  return (
    <div className="session-page">
      <NavButtons collection={scenario.sessions.all().toRefArray()} currentItem={session.ref}
                  callback={item => props.navigate(`/scenario/${scenario.id}/session/${item.id}`)}/>


      <div className="form-inline pull-right">
        <div className="form-group">
          <label htmlFor="adapter-type" style={{padding: '0 10px '}}>Choose chart library:</label>
          <select value={props.adapter} id="adapter-type"
                  className="form-control"
                  onChange={event => props.actions.changeAdapter(event.target.options[event.target.selectedIndex].value)}>
            <option value="dygraphs">Dygraphs</option>
            <option value="visjs">VisJS</option>
            <option value="highcharts">HighCharts</option>
            <option value="jqplot">JqPlot</option>
            <option value="flot">flot</option>
            <option value="plotly">plotly</option>
            {/*TODO on change - change chart type and reinitialize, then fix all adapters, then think about optimizations flags in explorejs*/}
          </select>
        </div>
      </div>
      <h1>{scenario.name}&nbsp;
        <small>Session started at {dateformat(session.start, DATE_FORMAT)}</small>
      </h1>

      <Stars maxValue={10} value={session.score || 0}
             onChange={(numStars) => props.actions.scoreSession(scenario.id, session.id, false, numStars)}/>

      <p>
        How you compare this configuration to previous?
      </p>

      <Slider width="400" ticks={ticks} value={session.score.toString() || '0'}
              onChange={(numStars) => props.actions.scoreSession(scenario.id, session.id, false, Number(numStars))}
      />

      <LocalBinding batch="/api/batch" manifest="/api/manifest" series={['0']} preset={scenario.preset}>
        <Chart serieId="0" adapter={props.adapter}
               prediction={scenario.preset.usePrediction ? ['basic', 'wider-context'] : ['basic']}/>
      </LocalBinding>
    </div>
  );
};
ScenarioSessionPage.propTypes = {
  scenario: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
  navigate: PropTypes.func.isRequired,
  actions: PropTypes.object,
  adapter: PropTypes.oneOf(adapterTypes)
};


const mapStateToProps = (state, ownProps) => ({
  scenario: scenarioByIdSelector(state, ownProps.params.scenarioId),
  session: sessionByIdSelector(state, ownProps.params.sessionId),
  adapter: state.adapter
});

const mapActionsToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  navigate: (route) => dispatch(push(route))
});

export default connect(mapStateToProps, mapActionsToProps)(ScenarioSessionPage);
