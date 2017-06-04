import {availableScoreSelector, createSession} from '../selectors/testingSelectors';
import {pushNotification} from '../actions/notificationActions';
import {operations} from '../redux/dialog/index';
import {SESSION_SCORE, SESSION_CREATE} from "../constants/actionTypes";
import {push} from 'react-router-redux';

export default  store => next => action => {
  const newAction = {...action};
  const state = store.getState();

  const fixAction = (score) => {
    newAction.score = score;

    store.dispatch(pushNotification(`You don't have enough stars to assign. Scored with ${newAction.score} points.`));
  };


  switch (newAction.type) {
    case SESSION_SCORE: {
      const session = createSession(state);
      const maxAvailable = availableScoreSelector(state);
      const currentSession = session.Session.withId(newAction.sessionId);
      const currentSessionScore = currentSession.score;
      const currentScenario = currentSession.scenario;
      if (newAction.override === false) {

        const otherScoredSessions = currentScenario.sessions.all().toModelArray().filter(a => a.id !== currentSession.id && a.score > 0);

        if (otherScoredSessions.length === 0) {
          if (newAction.score - currentSessionScore > maxAvailable) {
            fixAction(maxAvailable + currentSessionScore);
          }
        }
        else {
          next(operations.showDialog('There is already scored session, only one can be scored at a time', [
            {key: 'overwrite', message: 'Overwrite', action: {...newAction, override: true}, primary: true},
            {key: 'discard', message: 'Discard', action: pushNotification(`You didn't score this session.`, 'info')},
          ]));
          return;
        }
        break;
      }
      else {

        const scenarioTotalScore = currentScenario.sessions.all().toRefArray().reduce((res, s) => res + s.score, 0);
        if (newAction.score - scenarioTotalScore > maxAvailable) {

          fixAction(maxAvailable + scenarioTotalScore);
        }
      }
    }
  }

  next(newAction);

  switch (newAction.type) {
    case SESSION_CREATE: {
      const newItem = state.orm.Session.meta.maxId + 1;
      // eslint-disable-next-line
      const session = createSession(state);

      let action2 = push(`/scenario/${newAction.payload.scenario}/session/${newItem}`);
      store.dispatch(action2);
      break;
    }
  }

};
