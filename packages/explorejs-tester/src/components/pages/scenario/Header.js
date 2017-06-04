import React from 'react';
import {connect} from 'react-redux';
import {availableScoreSelector} from "../../../selectors/testingSelectors";
import Stars from '../../common/Stars';
export const Header = (props) => {
  return (<div className="a-scenario-header">
    Remaining <Stars maxValue={10} value={props.remainingStars}/>
  </div>);
};

Header.propTypes = {};

const mapStateToProps = state => ({
  remainingStars: availableScoreSelector(state)
});

export default connect(mapStateToProps)(Header);
