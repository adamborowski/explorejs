import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Menu from '../../common/Menu';
import Sidebar from '../../layout/Sidebar';
const sidebar = (props) => (
  <Sidebar><Menu {...props}/></Sidebar>
);

const mapStateToProps = (state) => ({
  items: state.testing.scenarios.map(a => ({name: a.name})),
  basePath: '/scenario/',
  header: 'Test scenarios'
});
export default connect(mapStateToProps)(sidebar);



