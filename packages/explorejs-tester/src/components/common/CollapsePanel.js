import React from 'react';
import PropTypes from 'prop-types';

export default class CollapsePanel extends React.Component {

  static propTypes = {
    forceExpand: PropTypes.bool,
    expandLabel: PropTypes.string,
    collapseLabel: PropTypes.string
  };

  state = {
    open: false
  };

  handleClick = () => this.setState({open: !this.state.open});

  render() {

    const {forceExpand, children, expandLabel, collapseLabel} = this.props;
    const {open} = this.state;

    return <div>
      {!forceExpand && <button onClick={this.handleClick} className="btn">{open ? collapseLabel : expandLabel}</button>}
      {(forceExpand || open) && children}
    </div>

  }

}
