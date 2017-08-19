import React from 'react';
import PropTypes from 'prop-types';
import {Tab, Tabs} from 'react-bootstrap';
import {map} from 'lodash';

const Stats = ({sessions, ignored, scenariosById}) => {
  return <Tabs animation={false} bsStyle="pills" defaultActiveKey={0} id="stats-view">
    {
      sessions.map((session, i) => <Tab eventKey={i} key={i} title={`session ${session.session.id}`}>
        <h4 className='list-group-item-heading'>#{session.session.id}
          <small className="pull-right"> {scenariosById[session.session.scenario].name}</small>
        </h4>
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
            <td onClick={() => console.log(viewStates)}>{viewStates.length}
              <div className="histogram-bar" style={{width: 3 + viewStates.length * 300 / session.stats.numStates}}/>
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
};

Stats.propTypes = {
  sessions: PropTypes.array,
  ignored: PropTypes.array
};


export default Stats;
