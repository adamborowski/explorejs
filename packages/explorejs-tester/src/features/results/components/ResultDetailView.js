import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import trans from '../../../translations/trans';
import {formatDate} from '../utils';
import {scenarioSelector} from '../../../selectors/testingSelectors';
import {compose} from 'redux';
import ScoresView from './ScoresView';


class ResultDetailView extends React.Component {

  static propTypes = {
    scenarios: PropTypes.array,
    result: PropTypes.object
  };

  render() {

    const {trans, dynamicTrans} = this.context;
    const {scenarios, answers: possibleAnswers, result} = this.props;

    const getScoredSession = scenarioId => result.data.sessions.find(s => s.scenario === scenarioId && s.score !== null)

    const getScenarioScore = scenarioId => {
      const session = getScoredSession(scenarioId);
      return session ? session.score : null;
    };

    const scores = scenarios.map(s => ({name: dynamicTrans(s.name), score: getScenarioScore(s.id)}));


    return (
      <div className="results-detail-view">
        <div className="page-header">
          <h3>Response from {result.name || <span className="result-no-name">unknown person</span>}
            <small> {formatDate(result.time)}</small>
          </h3>
        </div>
        <div>

          <h5 className="page-header">Scores</h5>
          <ScoresView scores={scores} possibleAnswers={possibleAnswers}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  scenarios: scenarioSelector(state),
  answers: state.testing.answers
});

export default compose(connect(mapStateToProps), trans())(ResultDetailView); //fixme update blocking by connect
