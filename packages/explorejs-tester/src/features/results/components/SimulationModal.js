import React from 'react';
import PropTypes from 'prop-types';
import {Button, Modal} from 'react-bootstrap';
import playbackService from '../services/playback-service'
import {LocalBinding, Chart} from 'explorejs-react';
import compose from 'compose-function';

export default class SimulationModal extends React.Component {

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
      currentViewState: null,
      finished: false
    }
  }

  onShow = () => {
    this.playbackService = playbackService(this.props.sessionObject.stats.viewState, 100 * 1024, this.onTick, this.onFinish)
    this.playbackService.play();
    this.setState({finished: false})
  };


  componentWillUnmount() {
    this.playbackService.stop();
  }

  onTick = (viewState) => {
    this.setState({currentViewState: viewState})
  };

  onFinish = () => {
    this.setState({finished: true})
  };

  render() {
    const {onHide, show, sessionStats, sessionObject, title, scenario} = this.props;
    const {currentViewState, finished} = this.state;


    const currentStats = currentViewState && sessionStats.mock.find(m => m.viewState.time === currentViewState.time);

    const currentSpeed = (currentStats && currentStats.requests[0] !== undefined ) ? currentStats.requests[0].speedOfTask : 100 * 1024;
    console.log(currentSpeed);

    return (
      <Modal show={show} onHide={onHide} onShow={this.onShow} dialogClassName="simulation-dialog">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{minHeight: 310, maxWidth: 1000, margin: 'auto'}}>
            <LocalBinding batch="/api/batch" manifest="/api/manifest" series={['0']} preset={scenario.preset}
                          throttleNetwork={currentSpeed}
                          onStats={stats => console.log('added stats', stats)}
            >
              <Chart serieId="0" adapter={'flot'}
                     controlledViewState={currentViewState && currentViewState.state}
                     prediction={scenario.preset.usePrediction ? ['basic', 'wider-context'] : ['basic']}/>
            </LocalBinding>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <pre>
            {JSON.stringify(currentViewState)}
          </pre>
          {finished && <span className="label label-pill label-success">finished</span>}
          {!finished && <span className="label label-pill label-warning">playing...</span>}
          &nbsp;&nbsp;&nbsp;
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
