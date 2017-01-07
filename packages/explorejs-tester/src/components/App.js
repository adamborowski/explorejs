import React, { PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import {propTypes} from "react-props-decorators";

// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.
@propTypes({children: PropTypes.element})
class App extends React.Component {
  render() {
    return (
      <div>
        <IndexLink to="/">Home</IndexLink>
        {' | '}
        <Link to="/fuel-savings">Demo App</Link>
        {' | '}
        <Link to="/about">About</Link>
        <br/>
        {this.props.children}
      </div>
    );
  }
}

export default App;
