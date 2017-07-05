import  React from 'react';
import {connect} from 'react-redux';
import {scenarioSelector} from '../../../selectors/testingSelectors';
import {Link} from 'react-router';
import trans from '../../../translations/trans';
export const ScenarioListPage = trans()((props, {trans, dynamicTrans}) => {
  return (
    <div>
      <h1 className="page-header">{trans('general.testConfigurations')}</h1>
      <p>
        TODO: show diagram of general problem - server aggregations, how much data we want do visualize, choosing proper level
      </p>
      <div className="list-group">
        {
          props.scenarios.map((scenario) =>
            (<Link key={scenario.id} href="#" className="list-group-item" to={`/scenario/${scenario.id}`}>
              <span className="badge">{scenario.sessions.length}</span>
              <h4 className="list-group-item-heading">{dynamicTrans(scenario.name)}</h4>
            </Link>)
          )
        }

      </div>

    </div>
  );
});

ScenarioListPage.propTypes = {
  scenarios: React.PropTypes.array
};


export const mapStateToProps = (state) => ({
  scenarios: scenarioSelector(state),
  adminMode: state.testing.adminMode
});
export default connect(mapStateToProps)(ScenarioListPage);
