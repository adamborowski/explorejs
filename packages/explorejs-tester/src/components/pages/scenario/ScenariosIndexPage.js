import  React from 'react';
import {connect} from 'react-redux';
import {scenarioSelector} from '../../../selectors/testingSelectors';
import trans from '../../../translations/trans';
import {push} from 'react-router-redux';

export const ScenarioListPage = trans()((props, {trans, dynamicTrans}) => {
  return (
    <div>
      <h1 className="page-header">{trans('general.testConfigurations')}</h1>
      <p>
        {trans('general.scenarioIntro', props.scenarios.length)}
      </p>
      <div>
        <a onClick={() => props.navigate('/scenario/0')} className="btn btn-primary"
           type="submit">
          {trans('general.goToBase')}
        </a>

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

const mapActionsToProps = (dispatch) => ({
  navigate: (route) => dispatch(push(route))
});
export default connect(mapStateToProps, mapActionsToProps)(ScenarioListPage);
