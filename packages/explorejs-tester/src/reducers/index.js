import { combineReducers } from 'redux';
import fuelSavings from './fuelSavingsReducer';
import testing from './testingReducer';
import {routerReducer} from 'react-router-redux';

const rootReducer = combineReducers({
  fuelSavings,
  routing: routerReducer,
  testing
});

export default rootReducer;
