import React from 'react';
import {loadResults} from '../services/result-service';
import ResultError from './ResultError';
import './ResultsPage.scss';
import {
  getAbsoluteScores, getDataForPercentileChart, getDataForTimingChart, getNormalizedHistogramForScenario,
  getScoresHistogram, getTimingHistogramForScenarios
} from '../services/summary-service';
import ScoreHistogram from './summary/ScoreHistogram';
import PercentileChart from './summary/PercentileChart';


import {scaleLog} from 'd3-scale';
import {createCategoryBin} from '../utils';
import Histogram from './summary/Historgram';
import {Tab, Tabs} from 'react-bootstrap';

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
    timingHistograms: null,
    timingChartData: null
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
      // const dataForPercentileChart2 = getDataForPercentileChart(results, undefined, [-5, -2, 0, 2, 5], (score, factor) => score + factor, s => s);
      const dataForPercentileChart = getDataForPercentileChart(results, undefined, undefined, undefined, s => s);
      const dataForPercentileChart2 = getDataForPercentileChart(results);
      const timingHistograms = getTimingHistogramForScenarios(results);
      const timingChartData = getDataForTimingChart(timingHistograms);

      const responseStats = {

        liking: createCategoryBin(results, [0, 1, 2, 3, 4], [-2, -1, 0, 1, 2], r => r.data.answers[0]),
        seriousProblem: createCategoryBin(results, [0, 1, 2, 3, 4], [-2, -1, 0, 1, 2], r => r.data.answers[3]),
        mapSimilarity: createCategoryBin(results, [0, 1, 2, 3, 4], [-2, -1, 0, 1, 2], r => r.data.answers[5]),
        metBefore: createCategoryBin(results, [0, 1, 2, 3, 4], [-2, -1, 0, 1, 2], r => r.data.answers[6]),
        metFuture: createCategoryBin(results, [0, 1, 2, 3, 4], [-2, -1, 0, 1, 2], r => r.data.answers[7]),
        willUse: createCategoryBin(results, [0, 1, 2, 3, 4], [-2, -1, 0, 1, 2], r => r.data.answers[8]),
      };

      this.setState({
        results,
        histogram,
        absoluteScores,
        dataForPercentileChart,
        dataForPercentileChart2,
        timingHistograms,
        timingChartData,
        responseStats
      });
    }
    catch (e) {
      this.setState({results: [], error: `Cannot get responses: ${e.message}`});
      console.error(e);
    }
    this.setState({loading: false});
  }


  render() {
    const {results, responseStats, error, loading, histogram, absoluteScores, dataForPercentileChart, dataForPercentileChart2, timingHistograms, timingChartData} = this.state;


    if (error) {
      return <ResultError message={error}/>;
    }
    if (loading) {
      return <div className="a-loading">...</div>;
    }
    if (results) {

      const chartHeight = 230;
      const chartWidth = 600;

      return <div className="row results-page">
        <h4>Results based on {results.length} responses</h4>
        <Tabs id="uncontrolled-tab-example">
          <Tab eventKey={0} title="Survey">
            <div className="row">
              <div className="col-md-3">
                <h5>Survey like</h5>
                <Histogram data={responseStats.liking}/>
              </div>
              <div className="col-md-3">
                <h5>Serious problem</h5>
                <Histogram data={responseStats.seriousProblem}/>
              </div>
              <div className="col-md-3">
                <h5>Similarity to Maps</h5>
                <Histogram data={responseStats.mapSimilarity}/>
              </div>
              <div className="col-md-3">
                <h5>Met before</h5>
                <Histogram data={responseStats.metBefore}/>
              </div>
              <div className="col-md-3">
                <h5>Meet future</h5>
                <Histogram data={responseStats.metFuture}/>
              </div>
              <div className="col-md-3">
                <h5>Will use</h5>
                <Histogram data={responseStats.willUse}/>
              </div>
            </div>
          </Tab>
          <Tab eventKey={1} title="Interaction">
            <div className="col-md-5">
              <ScoreHistogram histograms={histogram} timingHistograms={timingHistograms}/>
            </div>
            <div className="col-md-7">
              <h5>Distribution of absolute scores (linear scale)</h5>
              <PercentileChart data={dataForPercentileChart} width={chartWidth} height={chartHeight}/>
              <h5>Distribution of absolute scores (log scale)</h5>
              <PercentileChart data={dataForPercentileChart2} width={chartWidth} height={chartHeight} color="#ed3333"/>
              <h5>Distribution of waiting time spans</h5>
              <PercentileChart data={timingChartData} width={chartWidth} height={chartHeight} color="#3333ed" timingMode
                               lineType="monotone"/>
            </div>
          </Tab>
        </Tabs>
      </div>;
    }
    return <ResultError message="No data"/>

  }

}


export default ResultsPage;
