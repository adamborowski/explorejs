import React from 'react';
import {connect} from 'react-redux';
import {scenarioSelector} from '../../../selectors/testingSelectors';
import Menu from '../../common/Menu';
import Sidebar from '../../layout/Sidebar';
import trans from '../../../translations/trans';
const sidebar = trans()((props, {trans}) => (
  <Sidebar><Menu {...props} header={trans('general.testConfigurations')}/></Sidebar>
));

const stars = (scenario) => {
  const sessions = scenario.sessions;
  const lastSession = sessions[sessions.length - 1];
  return lastSession ? lastSession.score : null;
};

const mapStateToProps = (state) => ({
  items: scenarioSelector(state).map(a => ({name: a.name, link: a.id, stars: stars(a)})),
  basePath: '/scenario/',
  answers: state.testing.answers
});
export default connect(mapStateToProps)(sidebar);



