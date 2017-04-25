import {Model, many, fk, attr, Schema} from 'redux-orm';

export default class ScenarioModel extends Model {
  static fields = {
    name: attr(),//todo use proptype
    // sessions: fk('Session', '')
  };
  static modelName = 'Scenario';

  static reducer(state, action) {

  }

}
