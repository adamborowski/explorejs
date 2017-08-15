import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import trans from '../../../translations/trans';
import {formatDate} from '../utils';
import {scenarioSelector} from '../../../selectors/testingSelectors';
import {compose} from 'redux';
import Slider from '../../../components/common/Slider';


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


    return (
      <div className="results-detail-view">
        <div className="page-header">
          <h3>Response from {result.name || <span className="result-no-name">unknown person</span>}
            <small> {formatDate(result.time)}</small>
          </h3>
        </div>
        <div>
          <h5 className="page-header">Scores</h5>
          <ul className="list-group">
            {scenarios.map((s, i) => (
              <li key={i} className="list-group-item">
                <Slider
                  style={{padding: 5, float: 'right'}}
                  showLabels={false}
                  interactive={false}
                  width={120}
                  height={16}
                  tickInnerRadius={5}
                  tickOuterRadius={7}
                  barHeight={5}
                  ticks={possibleAnswers}
                  value={getScenarioScore(s.id)}
                />
                <h4 className="list-group-item-heading">
                  {dynamicTrans(s.name)}
                </h4>
              </li>
            ))}
          </ul>
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
