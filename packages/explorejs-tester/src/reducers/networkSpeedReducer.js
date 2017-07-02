import initialState from './initialState';
import {CHANGE_NETWORK_SPEED} from '../constants/actionTypes';

export default function throttleNetworkReducer(state = initialState.networkSpeed, action) {
  switch (action.type) {
    case CHANGE_NETWORK_SPEED:
      return action.speed;
  }
  return state;
}
