import React, {PropTypes} from 'react';
import {propTypes} from 'react-props-decorators';
import Header from './Header';
@propTypes({
  children: PropTypes.element,
  sidebar: PropTypes.element
})
class App extends React.Component {
  render() {
    return (
      <div>
        <Header/>
        <div className="container-fluid">
          <div className="row">
            {this.props.sidebar}
            <div
              className={`${this.props.sidebar != null && 'col-sm-offset-3 col-md-offset-2 col-sm-9 col-md-10 '} main`}>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
