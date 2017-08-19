import React from 'react';
import PropTypes from 'prop-types';
import {Button, Glyphicon, Modal, Tab, Tabs} from 'react-bootstrap';
import {map} from 'lodash';
import SimulationModal from './SimulationModal';

export default class Stats extends React.Component {
  static propTypes = {
    sessions: PropTypes.array,
    ignored: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {
      simulationOpen: false
    }
  }

  onHide = () => this.setState({simulationOpen: false});
  onShow = (index) => this.setState({simulationOpen: index});

  render() {
    const {sessions, ignored, scenariosById} = this.props;
    return <Tabs animation={false} bsStyle="pills" defaultActiveKey={0} id="stats-view">
      {
        sessions.map((session, i) => <Tab eventKey={i} key={i} title={`session ${session.session.id}`}>


          <div className="pull-right" style={{marginLeft: 20, position: 'relative', top: -70}}>
            <Button bsStyle="success" onClick={() => this.onShow(i)} title="open simulation window">
              <Glyphicon glyph="play"/>
            </Button>
          </div>
          <h4 className='list-group-item-heading'>#{session.session.id}
            <small className="pull-right"> {scenariosById[session.session.scenario].name}</small>
          </h4>
          {this.state.simulationOpen === i && <SimulationModal show={true}
                                                               onHide={this.onHide}
                                                               sessionObject={session.session}
                                                               sessionStats={session.stats}
                                                               title={
                                                                 <span>Session of sccenario
                               <em>{scenariosById[session.session.scenario].name}</em>.
                             </span>}
          />
          }
          <table className="table stats-table">
            <tbody>
            {map({
              numRequests: 'num requests',
              numStates: 'num of states',
              sumOfWaiting: 'sum of waiting',
              waitPerState: 'wait per state change'
            }, (label, variable) => <tr key={variable}>
              <th>{label}</th>
              <td>{session.stats[variable]}</td>
            </tr>)}
            {map({
              ...{
                '0s': [],
                '<=0.1s': [],
                '<=1s': [],
                '<=2s': [],
                '<=10s': [],
                '>10s': []
              }, ...session.stats.histogram
            }, (viewStates, binType) => <tr key={binType}>
              <th>{binType}</th>
              <td onClick={() => console.log(viewStates)}>
                <div style={{display: 'inline-block', width: 40}}>{viewStates.length}</div>
                <div className="histogram-bar"
                     style={{width: 3 + viewStates.length * 300 / session.stats.numStates}}/>
              </td>
            </tr>)}
            </tbody>
          </table>
          <pre>
          {JSON.stringify(session.stats, null, 2)}
        </pre>
        </Tab>)
      }
    </Tabs>
  }
}
