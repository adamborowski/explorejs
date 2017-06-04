import React from 'react';
import {Link} from 'react-router';
import {ContextSubscriber} from 'react-router/lib/ContextUtils';


const NavLink = React.createClass({

  mixins: [ContextSubscriber('router')],
  contextTypes: {
    router: React.PropTypes.object
  },
  render() {
    const isActive = this.context.router.isActive(this.props.to, this.props.onlyActiveOnIndex);
    let className = isActive ? "active" : "";

    return (
      <li className={className}>
        <Link {...this.props}/>
      </li>
    );
  }
});


export default NavLink;
