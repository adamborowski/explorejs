import React from 'react';
import {loadResults} from '../services/result-service';
import ResultError from './ResultError';
import ResultList from './ResultsList';
import Toggle from 'react-toggle';
import './ResultsPage.scss';
import ResultDetailView from './ResultDetailView';

class ResultsPage extends React.Component {

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


    if (error) {
      return <ResultError message={error}/>;
    }
    if (loading) {
      return <div className="a-loading">...</div>;
    }
    if (results) {

      const matchedResults = results.filter(r => r.testing === showTesting);

      return <div className="row results-page">
        <div className="col-md-4">
          <div>
            <Toggle
              checked={showTesting}
              onChange={v => this.handleSwitchTesting(v.target.checked)}/>
            <label>
              showing  {showTesting?'testing':'research'} responses ({matchedResults.length})
            </label>
          </div>
          <ResultList results={matchedResults}
                      currentResult={currentResult}
                      onResultClick={i => this.setState({currentResult: i})}
          />
        </div>
        <div className="col-md-8">
          {matchedResults[currentResult] && <ResultDetailView result={matchedResults[currentResult]}/>}
        </div>
      </div>
    }
    return <ResultError message="No data"/>

  }

}


export default ResultsPage;
