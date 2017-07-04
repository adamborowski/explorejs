import {Component, Children} from 'react';
import PropTypes from 'prop-types';
import trans, {registerCallback, getLanguage} from './language-manager';
import types from './types';

export default class LanguageProvider extends Component {
  static childContextTypes = types;

  static propTypes = {
    children: PropTypes.node
  };

  constructor() {
    super();
    this.state = {trans, language: getLanguage()};
  }

  componentWillMount() {

    const callback = language => this.setState({language, trans: (...args) => trans(...args)}); // we need to pass new function to have different refference
    const unregister = registerCallback(callback);

    this.setState({unregister});
  }

  componentWillUnmount() {
    this.state.unregister(); // unregister from language manager
  }

  getChildContext() {
    return {trans: this.state.trans, language: this.state.language};
  }

  render() {
    return Children.only(this.props.children);
  }
}
