import React from 'react';
import {connect} from 'react-redux';
import {scenarioSelector} from '../../../selectors/testingSelectors';
import Menu from '../../common/Menu';
import Sidebar from '../../layout/Sidebar';
const sidebar = (props) => (
  <Sidebar><Menu {...props}/></Sidebar>
);

const stars = (scenario) => {
  const sessions = scenario.sessions;
  const lastSession = sessions[sessions.length - 1];
  return lastSession ? lastSession.score : null;
};

const mapStateToProps = (state) => ({
  items: scenarioSelector(state).map(a => ({name: a.name, link: a.id, stars: stars(a)})),
  basePath: '/scenario/',
  header: 'Test configurations',
  answers: state.testing.answers
});
export default connect(mapStateToProps)(sidebar);



