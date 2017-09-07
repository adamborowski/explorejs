import React from 'react';
import {loadResults} from '../services/result-service';
import ResultError from './ResultError';
import ResultList from './ResultsList';
import Toggle from 'react-toggle';
import './ResultsPage.scss';
import ResultDetailView from './ResultDetailView';
import {formatDate} from '../utils';
import trans from '../../../translations/trans';
import {scenarioSelector} from '../../../selectors/testingSelectors';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {Button} from 'react-bootstrap';
import PerfTestDialog from './perf/PerfTestDialog';

class PerftestPage extends React.Component {

  state = {results: null, error: null, loading: false, currentSession: null, showTesting: true};

  componentDidMount() {
    this.refresh();
  }

  async refresh() {
    try {
      this.setState({loading: true});
      const results = await loadResults();
      this.setState({results});
    }
    catch (e) {
      this.setState({results: [], error: `Cannot get responses: ${e.message}`});
    }
    this.setState({loading: false});
  }

  handleSwitchTesting = (showTesting) => {
    this.setState({currentResult: 0, showTesting});
  };

  render() {

    const {results, error, loading, currentSession, showTesting} = this.state;
    const {trans, dynamicTrans} = this.context;
    const {scenarios} = this.props;


    if (error) {
      return <ResultError message={error}/>;
    }
    if (loading) {
      return <div className="a-loading">...</div>;
    }
    if (results) {

      const matchedResults = results.filter(r => r.testing === showTesting);

      return <div className="row results-page">
        <div className="col-md-12">
          <div>
            <Toggle
              checked={showTesting}
              onChange={v => this.handleSwitchTesting(v.target.checked)}/>
            <label>
              show test responses
            </label>
          </div>
          <table className="table">
            <thead>
            <tr>
              <th>user</th>
              <th>time</th>
              <th>session / scenario</th>
              <th>status</th>
            </tr>
            </thead>
            <tbody>
            {matchedResults.map(r => {

              return [<tr>
                <td rowSpan={r.data.sessions.length + 1}>
                  {r.name || <span className="result-no-name">(no name)</span>}
                </td>

                <td rowSpan={r.data.sessions.length + 1}>{formatDate(r.time)}</td>
                {r.data.sessions.length === 0 && [
                  <td key="1"><span className="result-no-name">(no session)</span></td>,
                  <td key="2"><span className="result-no-name">(no session)</span></td>
                ]}
              </tr>, ...r.data.sessions.map(session => <tr key={session.start}>
                <td>{dynamicTrans(scenarios.find(s => s.id === session.scenario).name)}</td>
                <td>
                  waiting &nbsp;&nbsp;
                  <Button bsStyle="success" bsSize="xsmall" title="perform cross-preset tests on this session"
                          onClick={() => this.setState({currentSession: session})}
                  >
                    <span className="glyphicon glyphicon-signal"/>
                  </Button>
                </td>
              </tr>)
              ];
            })}
            </tbody>
          </table>
        </div>
        {currentSession != null &&
        <PerfTestDialog sessionObject={currentSession} onHide={() => this.setState({currentSession: null})}
                        title={`Performance tests of ${dynamicTrans(scenarios.find(s => s.id === currentSession.scenario).name)}`}
        />}
      </div>
    }
    return <ResultError message="No data"/>

  }

}

const mapStateToProps = state => ({
  scenarios: scenarioSelector(state)
});

export default compose(connect(mapStateToProps), trans())(PerftestPage); //fixme update blocking by connect

