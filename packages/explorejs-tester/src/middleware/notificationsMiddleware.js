import {closeNotification} from '../actions/notificationActions';
import {PUSH_NOTIFICATION} from '../constants/actionTypes';

export default  store => next => action => {
  switch (action.type) {
    case PUSH_NOTIFICATION:
      if (action.timeout > 0) {
        setTimeout(() => {
          store.dispatch(closeNotification(action.id));
        }, action.timeout);
      }
  }

  next(action);

};
