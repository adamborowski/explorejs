import schema from '../orm/schema';
import {createSelector} from 'reselect';
import {createSelector as ormCreateSelector} from 'redux-orm';

export const ormSelector = state => state.orm;

export const availableScoreSelector = (state) => state.testing.totalScore - sessionSelector(state).reduce((sum, session) => sum + session.score, 0);

export const scenarioSelector = createSelector(
  ormSelector,
  ormCreateSelector(schema, session => session.Scenario.all().toModelArray().map(scenario => ({
    ...scenario.ref,
    sessions: scenario.sessions.all().toRefArray(),
  }))));

export const sessionSelector = createSelector(
  ormSelector,
  ormCreateSelector(schema, session => session.Session.all().toModelArray().map(session => ({
    ...session.ref,
    scenario: session.scenario.ref,
  }))));

export const scenarioByIdSelector = (state, id) => schema.session(ormSelector(state)).Scenario.withId(id);
export const sessionByIdSelector = (state, id) => schema.session(ormSelector(state)).Session.withId(id);
