import React from 'react';
import PropTypes from 'prop-types';
import {Button, Modal} from 'react-bootstrap';
import {Chart, LocalBinding} from 'explorejs-react';
import {preset} from '../../../../orm/bootstrap';
import ChartTestCase from '../../../../components/common/ChartTestCase';

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
    this.state = {
      testStats: {},
      currentTestCase: null
    }
  }


  render() {
    const {sessionStats, sessionObject, title, scenario} = this.props;
    const {currentTestCase, testStats} = this.state;


    return (
      <Modal show dialogClassName="perftest-dialog">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-3" style={{height: 'calc(100vh - 229px)', overflow: 'auto'}}>
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
                  testCases.map((testCase, presetIndex) => {
                    const isCurrent = currentTestCase === presetIndex;
                    return <tr key={presetIndex}
                               style={{backgroundColor: isCurrent ? '#dedede' : undefined}}>
                      <th>{testCase.name} / {testCase.chartType}</th>
                      <td>{(isCurrent ? 'running' : testStats[presetIndex] === undefined ? 'pending' : 'executed')}</td>
                      <td>
                        {
                          isCurrent ?
                            <Button bsStyle="danger" bsSize="xsmall" title="stop test"
                                    onClick={() => this.setState({currentTestCase: null})}
                            >
                              <span className="glyphicon glyphicon-stop"/>
                            </Button>
                            :
                            <Button bsStyle="success" bsSize="xsmall" title="perform cross-preset tests on this session"
                                    onClick={() => this.setState({currentTestCase: presetIndex})}
                            >
                              <span className="glyphicon glyphicon-play"/>
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
                currentTestCase != null && <div>
                  <h3>Running your test</h3>
                  <ChartTestCase adapter={testCases[currentTestCase].chartType} throttleNetwork={null}
                                 key={currentTestCase}
                                 onStats={stats => this.setState({
                                   testStats: {
                                     ...this.state.testStats,
                                     [currentTestCase]: stats
                                   }
                                 })}
                                 preset={testCases[currentTestCase].preset}/>{/*todo tests for each adapter*/}/*todo add playback for test*/
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
