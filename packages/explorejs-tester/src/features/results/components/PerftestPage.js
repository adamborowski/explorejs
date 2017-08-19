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
import {Button, Glyphicon} from 'react-bootstrap';

class PerftestPage extends React.Component {

  state = {results: null, error: null, loading: false, currentResult: 0, showTesting: true};

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

    const {results, error, loading, currentResult, showTesting} = this.state;
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
          <div className="well">
            <h4>TODO</h4>
            <ul>
              <li>load and save results to local storage</li>
              <li>every row can be run separately</li>
              <li>show some useful statistics for every run</li>
              <li>show statistics for features - which configuration/which vis library is the best</li>
              <li>variations of: preset, adapter type, throttle</li>
            </ul>

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
                  <Button bsStyle="success" bsSize="xsmall" title="perform cross-preset tests on this scenario">
                    <Glyphicon glyph="signal"/>
                  </Button>
                </td>
              </tr>)
              ];
            })}
            </tbody>
          </table>
        </div>
      </div>
    }
    return <ResultError message="No data"/>

  }

}

const mapStateToProps = state => ({
  scenarios: scenarioSelector(state)
});

export default compose(connect(mapStateToProps), trans())(PerftestPage); //fixme update blocking by connect

