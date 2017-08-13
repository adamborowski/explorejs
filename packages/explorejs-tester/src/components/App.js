import React, {PropTypes} from 'react';
import {propTypes} from 'react-props-decorators';
import Header from './Header';
import Notifications from './common/NotificationContainer';
import Dialog from '../view/dialog/dialog';
import {isSurveySent} from '../selectors/testingSelectors';
import {connect} from 'react-redux';
import Greetings from './pages/Greetings';
@propTypes({
  children: PropTypes.element,
  sidebar: PropTypes.element,
  completed: PropTypes.bool
})
@connect(state => ({completed: isSurveySent(state)}))
class App extends React.Component {
  render() {
    const {completed} = this.props;
    return completed ?
      <div className="container-fluid">
        <Greetings/>
      </div> :
      (
      <div>
        <Header/>
        <div className="container-fluid">
          <div className="row">
            {this.props.sidebar}
            <div
              className={`${this.props.sidebar != null && 'col-sm-offset-3 col-md-offset-2 col-sm-9 col-md-10 '} main`}>
              {this.props.pageHeader}
              {this.props.children}
            </div>
          </div>
        </div>
        <Notifications notifications={[{type: 'danger', message: 'dupa'}]}/>
        <Dialog/>
      </div>
    );
  }
}

export default App;
