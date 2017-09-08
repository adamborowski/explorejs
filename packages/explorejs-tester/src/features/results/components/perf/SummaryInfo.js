import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {arrayToObject, createBin, objectToArray, sumBins} from '../../utils';
import {chartTypes} from './PerfTestDialog';
import Histogram from '../summary/Historgram';
import {Tabs, Tab} from 'react-bootstrap';
import {bins, calculateSessionStats} from '../../services/result-service';
import {calculateCacheHit, getHistogramDataForCacheHit, normalizeHistogram} from '../../services/session-stat-service';
import PercentileChart from '../summary/PercentileChart';
import {getDataForTimingChart} from '../../services/summary-service';
import {CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Legend, Bar} from 'recharts';

export default class SummaryInfo extends React.Component {
  static propTypes = {
    testCases: PropTypes.array,
    testCasesStats: PropTypes.array
  };

  constructor(props) {
    super();

    const getSessionStatsUsingCache = (stats) => {
      const hits = calculateCacheHit(stats.viewState, stats.cacheDump)
      const histogramDataForCacheHit = getHistogramDataForCacheHit(hits);

      return histogramDataForCacheHit;
    };

    const getSessionStatsWithoutCache = (stats) => {
      const object = calculateSessionStats(stats, true).histogram;
      const histogram = bins.map((bin, i) => ({value: bin, count: (object[bin] || []).length}));
      return histogram
    };


    const casesWithStats = props.testCases.map((testCase) => ({
      case: testCase,
      stats: props.testCasesStats[testCase.id]
    }))
      .map(item => ({
        ...item,
        waitingHistogram: item.case.name === 'basic' ?
          getSessionStatsWithoutCache(item.stats)
          : getSessionStatsUsingCache(item.stats)
        ,
        cacheHistogram: objectToArray(item.stats.cache, (value, key) => ({value: key, count: value})),
        histogram: createBin(item.stats.dataSource, [10, 25, 50, 100, 200, 350, 600, 1000], undefined, r => r.span)
      }));

    const casesByChart = _.groupBy(casesWithStats, s => s.case.chartType);

    const casesByPreset = _.groupBy(casesWithStats, s => s.case.name);


    this.state = {casesByChart, casesByPreset, casesWithStats}

  }

  render() {

    const {testCasesStats, testCases} = this.props;
    const {casesByChart, casesByPreset, casesWithStats} = this.state;

    const values = _.toArray(casesByChart).map(byChartCase => [byChartCase[0], byChartCase[byChartCase.length - 1]].map(h => h.histogram.map(h => h.count)));

    const maxValue = _.max(_.flattenDeep(values));

    const timingByPresetData = _.map(casesByPreset, (presetCases, i) => {
      const myHistogram = sumBins(presetCases.map(p => p.waitingHistogram));
      return {
        case: presetCases[0],
        name: presetCases[0].case.name,
        histogram: myHistogram,
        maxValue: _.max(myHistogram.map(s => s.count))
      };
    })

    const cacheByPresetData = _.compact(_.map(casesByPreset, (presetCases, i) => {
      if (presetCases[0].case.name === 'basic') {
        return null;
      }
      const cacheHistograms = presetCases.map(p => p.cacheHistogram);
      const sumHistogram = sumBins(cacheHistograms);
      return {
        case: presetCases[0],
        name: presetCases[0].case.name,
        cacheHistograms: cacheHistograms,
        histogram: sumHistogram,
        maxValue: _.max(sumHistogram.map(s => s.count))
      };

    }));

    const basicInfoByPresetData = _.map(casesByPreset, presetCases => {
      const totalChartUpdates = presetCases.reduce((sum, aCase) => sum + aCase.stats.dataSource.length, 0);
      const totalRequests = presetCases.reduce((sum, aCase) => sum + aCase.stats.requestManager.length, 0);
      const sumRequestSize = presetCases.reduce((sum, aCase) => sum + aCase.stats.requestManager.reduce((sum, r) => sum + r.size, 0), 0);
      return {
        case: presetCases[0],
        name: presetCases[0].case.name,
        totalChartUpdates,
        totalRequests,
        sumRequestSize
      }
    });

    const maxTimingValue = _.max(timingByPresetData.map(s => s.maxValue));

    const maxCacheValue = _.max(cacheByPresetData.map(s => s.maxValue));


    const getSessionDuration = (stats) => {
      const start = stats.viewState[0].time;
      const end = stats.viewState[stats.viewState.length - 1].time;
      return end - start;
    };

    const totalDuration = Math.floor(_.toArray(testCasesStats).reduce((sum, stat) => sum + getSessionDuration(stat), 0) / 1000);


    return <div>

      <Tabs defaultActiveKey={0} id="uncontrolled-tab-example"
            style={{height: 'calc(100vh - 179px)', overflowY: 'auto', overflowX:'hidden'}}>
        <Tab eventKey={0} title="Basic info">
          <p>Total time: {totalDuration}s</p>
          <BarChart width={600} height={300} data={basicInfoByPresetData} margin={{left:30, top:20}}>
            <XAxis dataKey="name"/>
            <YAxis/>
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip/>
            <Legend/>
            <Bar dataKey="totalChartUpdates" fill="#8884d8" name="Total chart update count"/>
            <Bar dataKey="totalRequests" fill="#82ca9d" name="Total request count"/>
          </BarChart>
          <BarChart width={600} height={300} data={basicInfoByPresetData} margin={{left:30}}>
            <XAxis dataKey="name"/>
            <YAxis/>
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip/>
            <Legend/>
            <Bar dataKey="sumRequestSize" fill="#ca849d" name="Total sum of requests size"/>
          </BarChart>
        </Tab>
        <Tab eventKey={1} title="Chart update">

          {
            _.map(casesByChart, (chartGroupCase, i) => <div key={i}>
              <h3>{chartGroupCase[0].case.chartType}</h3>
              <div className="row">
                <div className="col-md-4">
                  <h6>basic &mdash; updating time</h6>
                  <Histogram data={chartGroupCase[0].histogram} barSpace={20}/>{/*no maxValue - distribution matters*/}
                </div>
                <div className="col-md-4">
                  <h6>optimized &mdash; updating time</h6>
                  <Histogram data={_.last(chartGroupCase).histogram} barSpace={20}/> {/*no maxValue - distribution matters*/}
                </div>
              </div>
            </div>)
          }
        </Tab>
        <Tab eventKey={2} title="Wait time">
          <div style={{display: 'flex', flexDirection: 'row'}}>
            {timingByPresetData.map((data, i) => {
              const myHistogram = data.histogram;
              return <div key={i} style={{flexGrow: 1}}>
                <h3>{data.name}</h3>
                <h6>sum of histograms of each chart type</h6>
                <Histogram data={myHistogram} barSpace={10} maxValue={maxTimingValue} vSpace={150}/>

              </div>;
            })
            }

          </div>
          <div style={{marginTop: 40, marginLeft:50}}>
            <PercentileChart
              data={getDataForTimingChart(_.toArray(casesByPreset).map(presetCases => {
                return normalizeHistogram(sumBins(presetCases.map(p => p.waitingHistogram)));
              }))}
              width={600}
              lineType="monotone"
              height={300} color="#3333ed" timingMode/>
          </div>
        </Tab>
        <Tab eventKey={3} title="Cache fill">
          <div className="row">
            {
              cacheByPresetData.map((data, i) => <div key={i} className="col-md-6">
                <h3>{data.case.case.name}</h3>
                <h6>sum of histograms of each chart type</h6>
                <Histogram data={data.histogram} barSpace={20} maxValue={maxCacheValue} vSpace={150}/>

              </div>)
            }
          </div>

        </Tab>

      </Tabs>

    </div>
  }

}
