import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../../../actions/testingActions';
import Stars from '../../common/Stars';
import {scenarioByIdSelector, sessionByIdSelector} from "../../../selectors/testingSelectors";


export const ScenarioSessionPage = (props) => {
  const {scenario, session} = props;
  return (
    <div>

      <p>Session... rate...</p>
      <Stars maxValue={10} value={session.score || 0}
             onChange={(numStars) => props.actions.scoreSession(scenario.id, session.id, false, numStars)}/>
      ... end of session page
    </div>
  )
};
ScenarioSessionPage.propTypes = {
  scenario: PropTypes.object.isRequired
};


const mapStateToProps = (state, ownProps) => ({
  scenario: scenarioByIdSelector(state, ownProps.params.scenarioId),
  session: sessionByIdSelector(state, ownProps.params.sessionId),
});

const mapActionsToProps = (dispatch) => ({actions: bindActionCreators(actions, dispatch)});

export default connect(mapStateToProps, mapActionsToProps)(ScenarioSessionPage);
