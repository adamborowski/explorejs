import  React from 'react';
import {connect} from 'react-redux';
import {scenarioSelector} from '../../../selectors/testingSelectors';
import {Link} from 'react-router';
export const ScenarioListPage = (props) => {
  return (
    <div>
      <h1 className="page-header">Testing scenarios</h1>
      <p>
        TODO: show diagram of general problem - server aggregations, how much data we want do visualize, choosing proper level
      </p>
      <div className="list-group">
        {
          props.scenarios.map((scenario) =>
            (<Link key={scenario.id} href="#" className="list-group-item" to={`/scenario/${scenario.id}`}>
              <span className="badge">{scenario.sessions.length}</span>
              <h4 className="list-group-item-heading">{scenario.name}</h4>
            </Link>)
          )
        }

      </div>

    </div>
  );
};

ScenarioListPage.propTypes = {
  scenarios: React.PropTypes.array
};


export const mapStateToProps = (state) => ({
  scenarios: scenarioSelector(state),
  adminMode: state.testing.adminMode
});
export default connect(mapStateToProps)(ScenarioListPage);
