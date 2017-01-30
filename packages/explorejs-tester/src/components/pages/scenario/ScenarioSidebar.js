import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {scenarioSelector} from '../../../selectors/testingSelectors';
import Menu from '../../common/Menu';
import Sidebar from '../../layout/Sidebar';
const sidebar = (props) => (
  <Sidebar><Menu {...props}/></Sidebar>
);

const mapStateToProps = (state) => ({
  items: scenarioSelector(state).map(a => ({name: a.name, link: a.id})),
  basePath: '/scenario/',
  header: 'Test scenarios'
});
export default connect(mapStateToProps)(sidebar);



