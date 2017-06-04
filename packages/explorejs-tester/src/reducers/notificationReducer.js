import initialState from './initialState';
import {PUSH_NOTIFICATION, CLOSE_NOTIFICATION} from '../constants/actionTypes';

export default function notificationReducer(state = initialState.notifications, action) {
  switch (action.type) {
    case PUSH_NOTIFICATION:
      return [...state, {type: action.messageType, message: action.message, id: action.id}];
    case CLOSE_NOTIFICATION:
      return [...state.filter((m) => m.id != action.id)];
  }
  return state; // todo maybe impement something here
}
