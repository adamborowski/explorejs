import React, {Component} from 'react';
import {Link, IndexLink} from 'react-router';
import {ContextSubscriber} from 'react-router/lib/ContextUtils';


const NavLink = React.createClass({

  mixins: [ContextSubscriber('router')],
  contextTypes: {
    router: React.PropTypes.object
  },
  render() {
    const isActive = this.context.router.isActive(this.props.to, true);
    let className = isActive ? "active" : "";

    return (
      <li className={className}>
        {this.props.onlyActiveOnIndex == null ? <Link {...this.props}/> : <IndexLink {...this.props}/>}
      </li>
    );
  }
});


export default NavLink;
