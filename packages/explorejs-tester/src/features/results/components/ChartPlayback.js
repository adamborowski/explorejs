import React from 'react';
import PropTypes from 'prop-types';
import ChartTestCase from '../../../components/common/ChartTestCase';
import playbackService from '../services/playback-service'
import {ProgressBar} from 'react-bootstrap';
import _ from 'lodash';

export default class ChartPlayback extends React.Component {
  static propTypes = {
    preset: PropTypes.object,
    adapter: PropTypes.string,
    onStats: PropTypes.func,
    viewStateStats: PropTypes.array,
    onFinish: PropTypes.func
  };

  state = {};

  componentDidMount = () => {
    this.playbackService = playbackService(this.props.viewStateStats, null, this.onTick, this.onFinish)
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
    setTimeout(() => this.props.onFinish && this.props.onFinish(), 2000);
  };

  render() {

    const {preset, onStats, adapter} = this.props;
    const {currentViewState} = this.state;

    const startTime = this.props.viewStateStats[0].time;
    const endTime = _.last(this.props.viewStateStats).time;
    const duration = endTime - startTime;
    const currentProgress = currentViewState == null ? 0 : (currentViewState.time - startTime) / duration * 100;

    return <div>
      <ChartTestCase
        preset={preset}
        throttleNetwork={null}
        onStats={onStats}
        adapter={adapter}
        controlledViewState={currentViewState && currentViewState.state}
      />
      <ProgressBar striped bsStyle="success" now={currentProgress} style={{marginTop: 10}}/>
    </div>
  }
}
