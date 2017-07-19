import {Model, fk, attr} from 'redux-orm';

export default class SessionModel extends Model {
  static fields = {
    name: attr(),//todo use propTypes - https://github.com/tommikaikkonen/redux-orm-primer/tree/migrate_to_0_9
    start: attr(),
    end: attr(),
    score: attr(),
    stats: attr(),
    scenario: fk('Scenario', 'sessions')
  };
  static modelName = 'Session';

  // eslint-disable-next-line
  static reducer(state, action) {
    //todo move here
  }

}
