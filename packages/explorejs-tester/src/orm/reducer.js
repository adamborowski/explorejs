import schema from './schema';
import * as types from '../constants/actionTypes';
import initialState from './bootstrap';

export default function ormReducer(dbState = initialState(schema), action) {
  const session = schema.session(dbState);

  // Session-specific Models are available
  // as properties on the Session instance.
  const {Scenario, Session} = session;

  switch (action.type) {
    case types.SESSION_SCORE:
      if (action.override) {
        Scenario.withId(action.scenarioId).sessions.all().toModelArray().forEach(a => a.update({score: 0}));
      }
      Session.withId(action.sessionId).update({score: action.score});
      break;
    case types.SESSION_CREATE:
      Session.create({...action.payload});
      break;
    // case 'CREATE_BOOK':
    //   Book.create(action.payload);
    //   break;
    // case 'UPDATE_BOOK':
    //   Book.withId(action.payload.id).update(action.payload);
    //   break;
    // case 'REMOVE_BOOK':
    //   Book.withId(action.payload.id).delete();
    //   break;
    // case 'ADD_AUTHOR_TO_BOOK':
    //   Book.withId(action.payload.bookId).authors.add(action.payload.author);
    //   break;
    // case 'REMOVE_AUTHOR_FROM_BOOK':
    //   Book.withId(action.payload.bookId).authors.remove(action.payload.authorId);
    //   break;
    // case 'ASSIGN_PUBLISHER':
    //   Book.withId(action.payload.bookId).publisher = action.payload.publisherId;
    //   break;
  }

  // the state property of Session always points to the current database.
  // Updates don't mutate the original state, so this reference is not
  // equal to `dbState` that was an argument to this reducer.
  return session.state;
}
