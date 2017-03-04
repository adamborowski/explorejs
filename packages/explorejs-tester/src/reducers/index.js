import {combineReducers} from 'redux';
import fuelSavings from './fuelSavingsReducer';
import testing from './testingReducer';
import notifications from './notificationReducer';
import orm from '../orm/reducer';
import {routerReducer as routing} from 'react-router-redux';
import dialogs from '../redux/dialog/index';

const rootReducer = combineReducers({
  fuelSavings,
  notifications,
  dialogs,
  routing,
  orm,
  testing
});

export default rootReducer;
