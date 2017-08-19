import {availableScoreSelector, createSession, sessionByIdSelector} from '../selectors/testingSelectors';
import {pushNotification} from '../actions/notificationActions';
import {operations} from '../redux/dialog/index';
import {SESSION_SCORE, SESSION_CREATE, SEND_SURVEY, SEND_ERROR} from '../constants/actionTypes';
import {push, LOCATION_CHANGE} from 'react-router-redux';
import {sendComplete, sendError, sendStarted} from '../actions/testingActions';
import translate from '../translations/language-manager'

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
      }
      break;
    case SEND_ERROR: {
      store.dispatch(operations.showDialog(translate('send.error', action.message), [{
        key: 'ok',
        message: 'OK',
        action: {type: '__accept_send.error'}
      }]));

    }
      break;
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
      const maxId = state.orm.Session.meta.maxId;
      const newItem = maxId === undefined ? 0 : maxId + 1;

      createSession(state);

      let action2 = push(`/scenario/${newAction.payload.scenario}/session/${newItem}`);
      store.dispatch(action2);
      break;
    }
    case SEND_SURVEY: {
      const answers = state.finalAnswers;
      const session = createSession(state);
      const sessions = session.Session.all().toRefArray();

      var _navigator = {};
      for (var i in navigator) _navigator[i] = navigator[i];


      const payload = {
        time: new Date().getTime(),
        answers,
        sessions,
        navigator: _navigator,
        analytics: state.analytics
      };

      localStorage.setItem('survey/' + new Date().toISOString(), JSON.stringify(payload));

      store.dispatch(sendStarted())

      const isTesting = localStorage.getItem('testing');

      function handleErrors(response) {
        if (!response.ok) {
          throw Error(`Server error ${response.status} - ${response.statusText}`);
        }
        return response;
      }

      fetch('/api/surveys' + (isTesting ? '?isTesting=true' : '?isTesting=false'), {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then(res => new Promise((fulfill) => setTimeout(() => fulfill(res), 1000)))
        .then(handleErrors)
        .then(res => res.json())
        .then(res => {
          store.dispatch(sendComplete())
          return console.log(res);
        })
        .catch(e => {
          store.dispatch(sendError(e.message));
        })
      ;


    }
      break;
  }

};
