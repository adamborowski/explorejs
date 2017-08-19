import React from 'react';
import PropTypes from 'prop-types';
import {Button, Modal} from 'react-bootstrap';
import playbackService from '../services/playback-service'
import compose from 'compose-function';

export default class SimulationModal extends React.Component {

  static propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func,
    sessionObject: PropTypes.object,
    sessionStats: PropTypes.object,
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
    const {onHide, show, sessionStats, sessionObject, title} = this.props;
    const {currentViewState, finished} = this.state;


    return (
      <Modal show={show} onHide={onHide} onShow={this.onShow} dialogClassName="simulation-dialog">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Text in a modal</h4>
          <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
          <hr/>

          <h4>Overflowing text to show scroll behavior</h4>
          <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget
            quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue
            laoreet rutrum faucibus dolor auctor.</p>
          <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl
            consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
          <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget
            quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue
            laoreet rutrum faucibus dolor auctor.</p>
          <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl
            consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
          <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget
            quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue
            laoreet rutrum faucibus dolor auctor.</p>
          <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl
            consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
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
