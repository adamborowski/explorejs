import {ORM} from 'redux-orm';
import Scenario from './ScenarioModel';
import Session from './SessionModel';

const schema = new ORM();
schema.register(Scenario, Session);

export default schema;
