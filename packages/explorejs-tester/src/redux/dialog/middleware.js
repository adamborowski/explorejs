import * as types from './types';
import {getDialogById} from './selectors';

export default store => next => action => {
  const state = store.getState();
  switch (action.type) {
    case types.HIDE_DIALOG: {
      const resultAction = getDialogById(state, action.id);
      const result = resultAction.resolutions.find(r => r.key === action.resolution);

      store.dispatch(result.action);
    }
      break;
  }

  next(action);

};
