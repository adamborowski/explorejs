import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import trans from '../../../translations/trans';
import {formatDate} from '../utils';
import {scenarioSelector} from '../../../selectors/testingSelectors';
import {compose} from 'redux';
import ScoresView from './ScoresView';
import QuestionsView from './QuestionsView';
import {Tab, Tabs} from 'react-bootstrap';


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
        <h3>Response from {result.name || <span className="result-no-name">unknown person</span>}
          <small> {formatDate(result.time)}</small>
        </h3>
        <div>
          <Tabs defaultActiveKey={2} id="uncontrolled-tab-example">
            <Tab eventKey={1} title="Scores">
              <ScoresView scores={scores} possibleAnswers={possibleAnswers}/>
            </Tab>
            <Tab eventKey={2} title="Summary">
              <QuestionsView
                questions={result.data.questions}
                answers={result.data.answers}
              />
            </Tab>
            <Tab eventKey={3} title="Tab 3" disabled>Tab 3 content</Tab>
          </Tabs>
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
