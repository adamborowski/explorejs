import initialState from './initialState';
import {CHANGE_ADAPTER} from '../constants/actionTypes';

export default function adapterReducer(state = initialState.adapter, action) {
  switch (action.type) {
    case CHANGE_ADAPTER:
      return action.adapterType;
  }
  return state;
}
