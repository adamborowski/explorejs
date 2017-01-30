import React from 'react';
import {connect} from 'react-redux';
import {scenarioSelector} from '../../../selectors/testingSelectors.js';
import Stars from '../../common/Stars.js';
import {Link} from 'react-router';
export const ScenarioListPage = (props) => {
  return (
    <div>
      <h1 className="page-header">Testing scenarios</h1>
      <div className="list-group">
        {
          props.scenarios.map((scenario, index) =>
            <Link key={scenario.id} href="#" className="list-group-item" to={`/scenario/${scenario.id}`}>
              <span className="badge">{scenario.sessions.length}</span>
              <h4 className="list-group-item-heading">{scenario.name}</h4>
              <Stars small={true} maxValue={10}
                     value={scenario.sessions.reduce((score, session) => Math.max(session.score, score), 0)}/>
            </Link>
          )
        }

      </div>

    </div>
  )
};


export const mapStateToProps = (state) => ({
  scenarios: scenarioSelector(state)
});
export default connect(mapStateToProps)(ScenarioListPage);
