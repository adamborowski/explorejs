import {availableScoreSelector, createSession, sessionByIdSelector} from '../selectors/testingSelectors';
import {pushNotification} from '../actions/notificationActions';
import {operations} from '../redux/dialog/index';
import {SESSION_SCORE, SESSION_CREATE} from "../constants/actionTypes";
import {push, LOCATION_CHANGE} from 'react-router-redux';

export default  store => next => action => {
  const newAction = {...action};
  const state = store.getState();

  const fixAction = (score) => {
    newAction.score = score;

    store.dispatch(pushNotification(`You don't have enough stars to assign. Scored with ${newAction.score} points.`));
  };

  switch (newAction.type) {
    case LOCATION_CHANGE:
      const {pathname} = newAction.payload;
      const matches = pathname.match(/(^.*\d+)\/session\/(\d+)$/);

      if (matches) {
        try {
          const sessionId = Number(matches[2]);

          sessionByIdSelector(state, sessionId);
        }
        catch (e) {
          console.warn(`Cannot get initial session`, e);
          store.dispatch(pushNotification(`No such session, will navigate to configuration.`));
          store.dispatch(push(matches[1]));
          return;
        }

        break;
      }
  }
  // switch (newAction.type) {
  //   case SESSION_SCORE: {
  //     const session = createSession(state);
  //     const maxAvailable = availableScoreSelector(state);
  //     const currentSession = session.Session.withId(newAction.sessionId);
  //     const currentSessionScore = currentSession.score;
  //     const currentScenario = currentSession.scenario;
  //     if (newAction.override === false) {
  //
  //       const otherScoredSessions = currentScenario.sessions.all().toModelArray().filter(a => a.id !== currentSession.id && a.score > 0);
  //
  //       if (otherScoredSessions.length === 0) {
  //         if (newAction.score - currentSessionScore > maxAvailable) {
  //           fixAction(maxAvailable + currentSessionScore);
  //         }
  //       }
  //       else {
  //         next(operations.showDialog('There is already scored session, only one can be scored at a time', [
  //           {key: 'overwrite', message: 'Overwrite', action: {...newAction, override: true}, primary: true},
  //           {key: 'discard', message: 'Discard', action: pushNotification(`You didn't score this session.`, 'info')},
  //         ]));
  //         return;
  //       }
  //       break;
  //     }
  //     else {
  //
  //       const scenarioTotalScore = currentScenario.sessions.all().toRefArray().reduce((res, s) => res + s.score, 0);
  //       if (newAction.score - scenarioTotalScore > maxAvailable) {
  //
  //         fixAction(maxAvailable + scenarioTotalScore);
  //       }
  //     }
  //   }
  // }

  next(newAction);

  switch (newAction.type) {
    case SESSION_CREATE: {
      const newItem = (state.orm.Session.meta.maxId || -1) + 1;
      // eslint-disable-next-line
      const session = createSession(state);

      let action2 = push(`/scenario/${newAction.payload.scenario}/session/${newItem}`);
      store.dispatch(action2);
      break;
    }
  }

};
