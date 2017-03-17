import {availableScoreSelector, createSession} from "../selectors/testingSelectors.js";
import {pushNotification} from '../actions/notificationActions.js';
import {operations} from '../redux/dialog/index';
import {SESSION_SCORE, SESSION_CREATE} from "../constants/actionTypes";
import {push} from 'react-router-redux';

export default  store => next => action => {
  const state = store.getState();
  switch (action.type) {
    case SESSION_SCORE:
      if (action.override == false) {

        const session = createSession(state);
        const maxAvailable = availableScoreSelector(state);
        const currentSession = session.Session.withId(action.sessionId);
        const currentSessionScore = currentSession.score;
        const currentScenario = currentSession.scenario;
        const otherScoredSessions = currentScenario.sessions.all().toModelArray().filter(a => a.id !== currentSession.id && a.score > 0);

        if (otherScoredSessions.length === 0) {
          if (action.score - currentSessionScore > maxAvailable) {

            action.score = maxAvailable + currentSessionScore;

            store.dispatch(pushNotification(`You don't have enough stars to assign. Scored with ${action.score} points.`));
          }
        }
        else {
          next(operations.showDialog('There is already scored session, only one can be scored at a time', [
            {key: 'overwrite', message: 'Overwrite', action: {...action, override: true}, primary: true},
            {key: 'discard', message: 'Discard', action: pushNotification(`You didn't score this session.`, 'info')},
          ]));
          return;
        }
        break;
      }
  }

  next(action);

  switch (action.type) {
    case SESSION_CREATE:
      const newItem = state.orm.Session.meta.maxId + 1;
      const session = createSession(state);

      let action2 = push(`/scenario/${action.payload.scenario}/session/${newItem}`);
      store.dispatch(action2);
      break;
  }

};
