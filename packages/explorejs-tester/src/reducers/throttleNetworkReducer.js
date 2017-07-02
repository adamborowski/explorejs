import initialState from './initialState';
import {CHANGE_THROTTLE_NETWORK} from '../constants/actionTypes';

export default function throttleNetworkReducer(state = initialState.throttleNetwork, action) {
  switch (action.type) {
    case CHANGE_THROTTLE_NETWORK:
      return action.throttleNetwork;
  }
  return state;
}
