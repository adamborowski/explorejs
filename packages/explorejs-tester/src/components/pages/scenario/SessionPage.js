import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../../../actions/testingActions';
import NavButtons from './NavButtons';
import {scenarioByIdSelector, sessionByIdSelector} from '../../../selectors/testingSelectors';
import dateformat from 'dateformat';
import {push} from 'react-router-redux';
import {adapterTypes, Chart, LocalBinding} from 'explorejs-react';
import './SessionPage.scss';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import {DropdownButton, MenuItem, Fade} from 'react-bootstrap';
import trans from '../../../translations/trans';

const DATE_FORMAT = 'yyyy-mm-dd HH:MM:ss';


export const ScenarioSessionPage = trans()((props, {trans, dynamicTrans}) => {
  const {scenario, session, answers, adminMode} = props;

  return (
    <div className="session-page text-center">
      { adminMode && <NavButtons collection={scenario.sessions.all().toRefArray()} currentItem={session.ref}
                                 callback={item => props.navigate(`/scenario/${scenario.id}/session/${item.id}`)}/>
      }


      { adminMode &&
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
      }
      <h1>{trans('general.configuration')} &raquo;&nbsp;
        <small>{dynamicTrans(scenario.name)}</small>
      </h1>

      <div style={{minHeight: 310, maxWidth: 1000, margin: 'auto'}}>
        <LocalBinding batch="/api/batch" manifest="/api/manifest" series={['0']} preset={scenario.preset}
                      throttleNetwork={props.throttleNetwork ? props.networkSpeed * 1024 : null}
                      onStats={stats => props.actions.addStats(session.id, stats)}
        >
          <Chart serieId="0" adapter={props.adapter}
                 prediction={scenario.preset.usePrediction ? ['basic', 'wider-context'] : ['basic']}/>
        </LocalBinding>
      </div>

      <label>
        <span style={{
          margin: '7px 15px',
          display: 'inline-block',
          verticalAlign: 'bottom'
        }}>{trans('session.simulate')}</span>
        <Toggle
          checked={props.throttleNetwork}
          className="custom-classname"
          onChange={v => props.actions.changeThrottleNetwork(v.target.checked)}/>
      </label>
      <Fade in={!props.throttleNetwork}>
        <div style={{marginTop: 5}}>
          {trans('session.noThrottleWarning')}
        </div>
      </Fade>
      <Fade in={props.throttleNetwork}>
        <div style={{marginTop: 5}}>
          <label>
            <span style={{
              margin: '7px 15px',
              display: 'inline-block',
              verticalAlign: 'bottom'
            }}>{trans('session.speed')}</span>
            <DropdownButton title={props.networkSpeed + ' kB/s'} key={props.networkSpeed}
                            id={`dropdown-throttle`}
                            onSelect={(key) => props.actions.changeNetworkSpeed(key)}
            >
              {props.availableNetworkSpeed.map(a => <MenuItem key={a} eventKey={a}>{a}kB/s</MenuItem>)}
            </DropdownButton>
          </label>
        </div>
      </Fade>
      <div className="text-center">
        <a onClick={() => props.navigate(`/scenario/${scenario.id}`)} className="btn btn-primary btn-lg"
           style={{marginTop: 40}}
           type="submit">{trans('session.finish')}</a>
      </div>
    </div>
  );
});
ScenarioSessionPage.propTypes = {
  scenario: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
  navigate: PropTypes.func.isRequired,
  actions: PropTypes.object,
  adapter: PropTypes.oneOf(adapterTypes),
  answers: PropTypes.array,
  throttleNetwork: PropTypes.bool,
  networkSpeed: PropTypes.number,
  availableNetworkSpeed: PropTypes.arrayOf(PropTypes.number)
};


const mapStateToProps = (state, ownProps) => ({
  scenario: scenarioByIdSelector(state, ownProps.params.scenarioId),
  session: sessionByIdSelector(state, ownProps.params.sessionId),
  adapter: state.adapter,
  answers: state.testing.answers,
  adminMode: state.testing.adminMode,
  throttleNetwork: state.throttleNetwork,
  networkSpeed: state.networkSpeed,
  availableNetworkSpeed: state.testing.availableNetworkSpeed
});

const mapActionsToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  navigate: (route) => dispatch(push(route))
});

export default connect(mapStateToProps, mapActionsToProps)(ScenarioSessionPage);
