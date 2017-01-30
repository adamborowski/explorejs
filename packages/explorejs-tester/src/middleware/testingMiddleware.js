import {availableScoreSelector, sessionByIdSelector} from '../selectors/testingSelectors.js';
import {SESSION_SCORE} from "../constants/actionTypes";

export default  store => next => action => {
  const state = store.getState();
  switch (action.type) {
    case SESSION_SCORE:
      const maxAvailable = availableScoreSelector(state);
      const currentSessionScore = sessionByIdSelector(state, action.sessionId).score;

      if (action.score - currentSessionScore > maxAvailable) {
        action.score = maxAvailable + currentSessionScore;
      }
      //todo refuse if another session of this scenario is present - maybe put to some generic confirmation queue
      break;
  }

  next(action);

};
