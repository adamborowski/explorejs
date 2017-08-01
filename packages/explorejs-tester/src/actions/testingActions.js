import * as types from '../constants/actionTypes';

/**
 * Initializes the application with the main data: scenarios. Some reducer should shuffle it and then put into the state
 * @param scenarios {Array} array of scenarios
 */
export const initialize = (scenarios) => ({
  type: types.TESTING_INIT,
  scenarios: scenarios
});

/**
 * Assign score for given testing session
 * @param sessionId {Number}
 * @param override {Boolean} if true, drop the score for an already existing session for the same scenario
 * @param score {number} number of points
 * otherwise, this action will be put into the queue of confirmation
 */
export const scoreSession = (scenarioId, sessionId, override, score) => ({
  type: types.SESSION_SCORE,
  scenarioId,
  sessionId,
  override,
  score
});
/**
 *
 * @param scenario {number} id of owning scenario
 * @param score {number} the initial score for session
 * @param start {Date} the time of session start
 */
export const createSession = (scenario, navigate = true, score = null, start = new Date()) => ({
  type: types.SESSION_CREATE,
  payload: {
    scenario: scenario,
    score,
    start
  }
});

/**
 * Record a snapshot of explorejs interaction state (ie. when he zooms-in or resizes the browser,
 * basically everytime explorejs view is updated)
 * @param sessionId {Number}
 * @param snapshot {Object} part of explorejs view state including viewport window
 */
export const recordSnapshot = (sessionId, snapshot) => ({
  type: types.RECORD_SNAPSHOT,
  sessionId,
  snapshot
});


export const changeAdapter = adapterType => ({type: types.CHANGE_ADAPTER, adapterType});
export const changeThrottleNetwork = throttleNetwork => ({type: types.CHANGE_THROTTLE_NETWORK, throttleNetwork});
export const changeNetworkSpeed = speed => ({type: types.CHANGE_NETWORK_SPEED, speed});
export const addStats = (sessionId, stats) => ({type: types.ADD_STATS, stats, sessionId});
export const answerSummaryQuestion = (questionId, value) => ({
  type: types.SUMMARY_QUESTION_ANSWERED,
  questionId,
  value
});
export const sendSurvey = () => ({type: types.SEND_SURVEY});
