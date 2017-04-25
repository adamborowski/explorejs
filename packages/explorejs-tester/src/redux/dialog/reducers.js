import * as types from './types';
export default (state = [], action) => {
  switch (action.type) {
    case types.SHOW_DIALOG:
      return [...state, {...action}];
    case types.HIDE_DIALOG:
      return state.filter(a => a.id != action.id);
  }
  return state;
};
