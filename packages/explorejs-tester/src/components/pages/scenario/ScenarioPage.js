import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';
import * as actions from '../../../actions/testingActions';
import Stars from '../../common/Stars';
import {availableScoreSelector, scenarioByIdSelector} from '../../../selectors/testingSelectors';
import dateformat from "dateformat";

// Since this component is simple and static, there's no parent container for it.
const ScenarioPage = (props) => {

  const {scenario} = props;
  const DATE_FORMAT = 'yyyy-mm-dd HH:MM:ss';

  return (
    <div>
      <h2 className="page-header">
        Configuration: &nbsp;
        <small>{scenario.name}</small>

      </h2>
      { scenario.description && scenario.description() }
      <div className="list-group">
        {
          scenario.sessions.toRefArray().map((session) =>
            (<Link key={session.id} href="#" className="list-group-item" to={`/scenario/${scenario.id}/session/${session.id}`}>
              <h4 className="list-group-item-heading">{`${dateformat(session.start,DATE_FORMAT)}`}</h4>
              <Stars small={true} maxValue={10}
                     value={session.score}/>
            </Link>)
          )
        }

      </div>

      <a onClick={() => props.actions.createSession(scenario.id)} className="btn btn-default" type="submit">New
        session</a>


      {props.children}

    </div>
  );
};

ScenarioPage.propTypes = {
  actions: React.PropTypes.object
};

const mapStateToProps = (state, ownProps) => ({
  scenario: ownProps.params.scenarioId == null ? null : scenarioByIdSelector(state, ownProps.params.scenarioId),
  remainingScore: availableScoreSelector(state)
});

const mapActionsToProps = (dispatch) => ({actions: bindActionCreators(actions, dispatch)});

export default connect(mapStateToProps, mapActionsToProps)(ScenarioPage);
