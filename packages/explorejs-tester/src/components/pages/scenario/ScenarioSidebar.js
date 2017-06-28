import React from 'react';
import {connect} from 'react-redux';
import {scenarioSelector} from '../../../selectors/testingSelectors';
import Menu from '../../common/Menu';
import Sidebar from '../../layout/Sidebar';
const sidebar = (props) => (
  <Sidebar><Menu {...props}/></Sidebar>
);

const stars = (scenario) => {
  const score = scenario.sessions.filter(s => s.score > 0);
  return score.length ? score[0].score : 0;
};

const mapStateToProps = (state) => ({
  items: scenarioSelector(state).map(a => ({name: a.name, link: a.id, stars: stars(a)})),
  basePath: '/scenario/',
  header: 'Test configurations',
  answers: state.testing.answers
});
export default connect(mapStateToProps)(sidebar);



