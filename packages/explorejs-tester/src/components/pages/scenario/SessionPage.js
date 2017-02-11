import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../../../actions/testingActions';
import Stars from '../../common/Stars';
import {scenarioByIdSelector, sessionByIdSelector} from "../../../selectors/testingSelectors";
import dateformat from "dateformat";

const DATE_FORMAT = 'yyyy-mm-dd HH:MM:ss';


export const ScenarioSessionPage = (props) => {
  const {scenario, session} = props;
  return (
    <div>
      <h1>{scenario.name}&nbsp;
        <small>Session started at {dateformat(session.start, DATE_FORMAT)}</small>
      </h1>

      <Stars maxValue={10} value={session.score || 0}
             onChange={(numStars) => props.actions.scoreSession(scenario.id, session.id, false, numStars)}/>
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
