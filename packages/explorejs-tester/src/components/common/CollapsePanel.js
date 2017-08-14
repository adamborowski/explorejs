import React from 'react';
import PropTypes from 'prop-types';

export default class CollapsePanel extends React.Component {

  static propTypes = {
    forceExpand: PropTypes.bool,
    expandLabel: PropTypes.string,
    collapseLabel: PropTypes.string,
    onTrigger: PropTypes.func
  };

  state = {
    open: false
  };

  handleClick = () => {
    const open = !this.state.open;
    this.setState({open});
    if (this.props.onTrigger) {
      this.props.onTrigger(open);
    }
  };

  render() {

    const {forceExpand, children, expandLabel, collapseLabel} = this.props;
    const {open} = this.state;

    return <div>
      {!forceExpand && <button onClick={this.handleClick} className="btn">{open ? collapseLabel : expandLabel}</button>}
      {(forceExpand || open) && children}
    </div>

  }

}
