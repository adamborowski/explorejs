import {Model, attr} from 'redux-orm';

export default class ScenarioModel extends Model {
  static fields = {
    name: attr(),//todo use proptype
    description: attr(),
    question: attr(),
    answers: attr(),
    // sessions: fk('Session', '')
  };
  static modelName = 'Scenario';

  // eslint-disable-next-line
  static reducer(state, action) {

  }

}
