import React from 'react';
import {loadResults} from '../services/result-service';
import ResultError from './ResultError';
import './ResultsPage.scss';
import {
  getAbsoluteScores, getDataForPercentileChart, getNormalizedHistogramForScenario,
  getScoresHistogram, getTimingHistogramForScenarios
} from '../services/summary-service';
import ScoreHistogram from './summary/ScoreHistogram';
import PercentileChart from './summary/PercentileChart';


import {scaleLog} from 'd3-scale';

const sc = scaleLog().base(Math.E);

class ResultsPage extends React.Component {

  state = {
    results: null,
    error: null,
    loading: false,
    histogram: null,
    absoluteScores: null,
    dataForPercentileChart: null,
    dataForPercentileChart2: null,
    timingHistograms: null
  };

  componentDidMount() {
    this.refresh();
  }

  async refresh() {
    try {
      this.setState({loading: true});
      const results = (await loadResults()).filter(r => !r.testing);

      const histogram = getScoresHistogram(results);
      const absoluteScores = getAbsoluteScores(results);
      const dataForPercentileChart = getDataForPercentileChart(results);
      const dataForPercentileChart2 = getDataForPercentileChart(results, undefined, [-5, -2, 0, 2, 5], (score, factor) => score + factor, s => s);
      const timingHistograms = getTimingHistogramForScenarios(results);

      this.setState({
        results,
        histogram,
        absoluteScores,
        dataForPercentileChart,
        dataForPercentileChart2,
        timingHistograms
      });
    }
    catch (e) {
      this.setState({results: [], error: `Cannot get responses: ${e.message}`});
      console.error(e);
    }
    this.setState({loading: false});
  }


  render() {
    const {results, error, loading, histogram, absoluteScores, dataForPercentileChart, dataForPercentileChart2, timingHistograms} = this.state;


    if (error) {
      return <ResultError message={error}/>;
    }
    if (loading) {
      return <div className="a-loading">...</div>;
    }
    if (results) {


      return <div className="row results-page">
        <h4>Results based on {results.length} responses</h4>
        <div className="col-md-5">
          <ScoreHistogram histograms={histogram} timingHistograms={timingHistograms}/>
        </div>
        <div className="col-md-7">
          <PercentileChart data={dataForPercentileChart} width={600} height={350}/>
          <PercentileChart data={dataForPercentileChart2} width={600} height={350} color="#ed3333"/>
        </div>
      </div>;
    }
    return <ResultError message="No data"/>

  }

}


export default ResultsPage;
