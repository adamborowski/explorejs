import  React from 'react';
import {connect} from 'react-redux';
import {scenarioSelector} from '../../../selectors/testingSelectors';
import trans from '../../../translations/trans';
import {push} from 'react-router-redux';

export const ScenarioListPage = trans()((props, {trans, dynamicTrans}) => {
  return (
    <div>
      <h2>{trans('general.testConfigurations')}</h2>
      <p className="well">
        {trans('general.scenarioIntro', props.scenarios.length)}
      </p>
      <p className="text-center">
        <a onClick={() => props.navigate('/scenario/0')} className="btn btn-primary btn-lg"
           type="submit">
          {trans('general.goToBase')}
        </a>

      </p>

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
