export const availableScoreSelector = (testing) => testing.totalScore - testing.scenarios.reduce((sum, scenario) => scenario.sessions.reduce((sum, session) => sum + session.score, 0), 0);
