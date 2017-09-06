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

const PERF_TEST = 'perf-test';
const chartTypes = ['dygraphs', 'visjs', 'flot', 'highcharts', 'jqplot', 'plotly'];
const presetNames = ['basic', '+cache', '+projection', '+predition', '+optimization']
const presetConfig = [preset(), preset(true), preset(true, true), preset(true, true, true), preset(true, true, true, true)]
const testCases = presetNames.map((presetName, presetIndex) => chartTypes.map(chartType => ({
  chartType,
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

    const sessionCases = _.mapKeys(_.omitBy(readItems(PERF_TEST), function (value, key) {
      const split = key.split('@');
      return !split[0] === props.sessionObject.start && split[1].length > 0;
    }), (value, key) => key.split('@')[1]);


    this.state = {
      testStats: sessionCases || {},
      currentTestCase: null,
      isCurrentTestCaseRecording: false
    }
  }

  saveStats(stats, testCaseIndex) {
    saveItem(PERF_TEST, this.props.sessionObject.start + '@' + testCaseIndex, stats);
    this.setState({testStats: {...this.state.testStats, [testCaseIndex]: stats}})
  }

  render() {
    const {sessionObject, title, scenario} = this.props;
    const {currentTestCase, testStats, isCurrentTestCaseRecording} = this.state;


    return (
      <Modal show dialogClassName="perftest-dialog">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-3" style={{height: 'calc(100vh - 229px)', overflow: 'auto'}}>
              <Button bsStyle="danger" bsSize="xsmall" title="clear local storage"
                      onClick={() => {
                        clearItems(PERF_TEST);
                        this.setState({testStats: {}});
                      }}
              >
                              <span
                                className={`glyphicon glyphicon-remove`}/>
              </Button>
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
                                 currentTestCase: testCaseIndex
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
                    onStats={stats => this.saveStats(stats, currentTestCase)}
                    preset={testCases[currentTestCase].preset}
                    onFinish={() => this.setState({isCurrentTestCaseRecording: false})}
                    viewStateStats={sessionObject.stats.viewState.slice(0, 20)}/*temporary cut*/
                  />

                </div>
              }
              {
                currentTestCase != null && !isCurrentTestCaseRecording && testStats[currentTestCase] && <div>
                  <RecordingInfo stats={testStats[currentTestCase]} sessionObject={sessionObject}
                                 name={testCases[currentTestCase].name + ' on ' + testCases[currentTestCase].chartType}/>
                </div>
              }
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <pre>
          </pre>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
