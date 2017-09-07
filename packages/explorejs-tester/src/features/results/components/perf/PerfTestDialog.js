import React from 'react';
import PropTypes from 'prop-types';
import {Button, Modal} from 'react-bootstrap';
import {Chart, LocalBinding} from 'explorejs-react';
import {preset} from '../../../../orm/bootstrap';
import ChartTestCase from '../../../../components/common/ChartTestCase';
import ChartPlayback from '../ChartPlayback';
import {clearItems, readItems, saveItem} from '../../services/storage-service';
import _ from 'lodash';
import RecordingInfo from './RecordingInfo';
import Toggle from 'react-toggle';
import {arrayToObject} from '../../utils';
import SummaryInfo from './SummaryInfo';

const PERF_TEST = 'perf-test';
export const chartTypes = ['dygraphs', 'visjs', 'flot', 'highcharts', 'jqplot', 'plotly'];
export const presetNames = ['basic', '+cache', '+projection', '+prediction', '+optimization']
export const presetConfig = [preset(), preset(true), preset(true, true), preset(true, true, true), preset(true, true, true, true)]
export const testCases = presetNames.map((presetName, presetIndex) => chartTypes.map((chartType, i) => ({
  chartType,
  id: presetIndex * chartTypes.length + i,
  name: presetNames[presetIndex],
  preset: presetConfig[presetIndex]
}))).reduce((current, inner) => [...current, ...inner], []);


export default class PerfTestDialog extends React.Component {

  /**
   * configurations:
   *
   * for all - no throttle
   *
   *
   */

  static propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func,
    sessionObject: PropTypes.object,
    sessionStats: PropTypes.object,
    scenario: PropTypes.object,
    title: PropTypes.node
  };

  constructor(props) {
    super(props);


    this.state = {
      testStats: {},
      currentTestCase: null,
      isCurrentTestCaseRecording: false,
      autoPlay: false
    }
  }

  async componentDidMount() {
    const itemsFromDb = await readItems(PERF_TEST, this.props.sessionObject.start);
    const testStats = arrayToObject(itemsFromDb, s => s.planId, s => ({
      ...s.session,
      planId: s.planId,
      responseId: s.responseId,
      testCase: testCases[s.planId]
    }));


    this.setState({testStats});
  }

  async saveStats(stats, testCaseIndex) {
    await saveItem(PERF_TEST, this.props.sessionObject.start, testCaseIndex, stats);
    this.setState({testStats: {...this.state.testStats, [testCaseIndex]: stats}})
  }

  onPlaybackFinish = (stats) => {
    const testCaseIndex = this.state.currentTestCase;
    this.saveStats(stats, testCaseIndex);
    this.setState({isCurrentTestCaseRecording: false});
    if (this.state.autoPlay && testCaseIndex + 1 < testCases.length) {
      this.setState({currentTestCase: testCaseIndex + 1, isCurrentTestCaseRecording: true});
    }

  };

  render() {
    const {sessionObject, title, scenario} = this.props;
    const {currentTestCase, testStats, isCurrentTestCaseRecording, autoPlay} = this.state;


    return (
      <Modal show dialogClassName="perftest-dialog" onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-3" style={{height: 'calc(100vh - 180px)', overflow: 'auto'}}>
              {/*<Button bsStyle="danger" bsSize="xsmall" title="clear local storage"*/}
                      {/*onClick={() => {*/}
                        {/*clearItems(PERF_TEST, sessionObject.start);*/}
                        {/*this.setState({testStats: {}});*/}
                      {/*}}*/}
              {/*>*/}
                              {/*<span*/}
                                {/*className={`glyphicon glyphicon-remove`}/>*/}
              {/*</Button>*/}
              <Toggle value={autoPlay} onChange={(e) => this.setState({autoPlay: e.target.checked})}/>
              <table className="table">
                <thead>
                <tr>
                  <th>preset</th>
                  <th>stats</th>
                  <th>actions</th>
                </tr>
                </thead>
                <tbody>
                {
                  testCases.map((testCase, testCaseIndex) => {
                    const isCurrent = currentTestCase === testCaseIndex;
                    return <tr key={testCaseIndex}
                               style={{backgroundColor: isCurrent ? '#dedede' : undefined}}
                               onClick={() => this.setState({
                                 isCurrentTestCaseRecording: false,
                                 currentTestCase: this.state.currentTestCase === testCaseIndex ? null : testCaseIndex
                               })}
                    >
                      <th>{testCase.name} / {testCase.chartType}</th>
                      <td>{(isCurrent && isCurrentTestCaseRecording ? 'running' : testStats[testCaseIndex] === undefined ? 'pending' : 'executed')}</td>
                      <td>
                        {
                          isCurrent && isCurrentTestCaseRecording ?
                            <Button bsStyle="danger" bsSize="xsmall" title="stop test"
                                    onClick={() => this.setState({isCurrentTestCaseRecording: false})}
                            >
                              <span className="glyphicon glyphicon-stop"/>
                            </Button>
                            :
                            <Button bsStyle="success" bsSize="xsmall" title="perform cross-preset tests on this session"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      return this.setState({
                                        currentTestCase: testCaseIndex,
                                        isCurrentTestCaseRecording: true
                                      });
                                    }}
                            >
                              <span
                                className={`glyphicon glyphicon-${testStats[testCaseIndex] === undefined ? 'play' : 'refresh'}`}/>
                            </Button>
                        }
                      </td>
                    </tr>
                  })
                }
                </tbody>
              </table>
            </div>
            <div className="col-md-9">
              {
                currentTestCase != null && isCurrentTestCaseRecording && <div>
                  <h3>Running your test</h3>
                  <ChartPlayback
                    key={currentTestCase}
                    adapter={testCases[currentTestCase].chartType}
                    preset={testCases[currentTestCase].preset}
                    onFinish={this.onPlaybackFinish}
                    throttle={1024 * 350}
                    viewStateStats={sessionObject.stats.viewState}/* TODO FIXME temporary cut*/
                  />

                </div>
              }
              {
                currentTestCase != null && !isCurrentTestCaseRecording && testStats[currentTestCase] && <div>
                  <RecordingInfo
                    key={currentTestCase} /*reinitialize every time */
                    stats={testStats[currentTestCase]} sessionObject={sessionObject}
                    preset={testCases[currentTestCase].preset}
                    name={testCases[currentTestCase].name + ' on ' + testCases[currentTestCase].chartType}/>
                </div>
              }

              {
                currentTestCase == null && Object.keys(testStats).length > 0 &&
                <SummaryInfo testCases={testCases} testCasesStats={testStats}/>
              }
            </div>
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}
