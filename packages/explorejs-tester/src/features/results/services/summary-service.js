import {accumulateMap, arrayToObject} from '../utils';
import _ from 'lodash';
import {percentile} from 'stats-lite';
import {bins, calculateSessionStats} from './result-service';

function getScores(results) {
  return results.map(response => arrayToObject(response.data.sessions.filter(s => s.score != null), s => s.scenario, s => s.score));
}

function getScoresByScenario(results) {
  const scores = getScores(results);
  return [0, 1, 2, 3, 4].map(i => scores.map(s => s[i]));
}

export const getScoresHistogram = results => {


  const scoresByScenario = getScoresByScenario(results);

  return scoresByScenario.map(scenarioScores => [-2, -1, 0, 1, 2].map(value => ({
    value,
    count: scenarioScores.filter(s => s === value).length
  })));
};
/**
 * returns sorted absolute scores from every response for every scenario
 * @param results
 * @param factors
 * @param modifier
 * @returns {Array} scenario=>sorted list of absolute scores
 */
export const getAbsoluteScores = (results, factors = [1/3,1/1.2,1,1.2,3], modifier = (s, f) => s * f, scoreMap = s => Math.log(s)) => {

  const getFactor = relativeScore => factors[relativeScore + 2];

  const relativeScores = getScores(results);
  const absoluteScores = relativeScores.map(scores => {
    let currentScore = 1;

    const absScores = [0, 1, 2, 3, 4].map(scenarioIndex => {
      currentScore = modifier(currentScore, getFactor(scores[scenarioIndex]));
      return currentScore;
    });

    return absScores.map(scoreMap);
  });

  return [0, 1, 2, 3, 4].map(scenario => absoluteScores.map(as => as[scenario]));
};

const defaultPercentiles = [.1, .2, .3, .4, .5, .6, .7, .8, .9];
const labels = ['basic', '+cache', '+projection', '+prediction', '+optimization'];
// const defaultPercentiles = [.1, .5, .9];
/**
 * for each scenario returns list of specified percentiles of absolute scores from responses
 * @param {Array} scenario=> percentiles array
 */
export const getDataForPercentileChart = (results, percentiles = defaultPercentiles, factors, modifier, scoreMap) => {

  const absoluteScores = getAbsoluteScores(results, factors, modifier, scoreMap);


  const map = absoluteScores.map((as, i) => {

    const absolutePercentiles = percentiles.map(ptile => percentile(as, ptile));
    const stackedPercentiles = accumulateMap(absolutePercentiles, (item, i, acc) => item - acc, (item, i, acc) => item, 0);

    return {
      ...arrayToObject(absolutePercentiles, (v, i) => 'a' + i),
      ...arrayToObject(stackedPercentiles, (v, i) => 's' + i),
      label: labels[i],
      percentiles
    };
  });
  return map;
};

export const getNormalizedHistogramForScenario = (results, scenarioId) => {

  // for every response get right session
  const sessions = results
    .map(r => {
      const scenarioSessions = r.data.sessions.filter(s => s.scenario === scenarioId);

      const havingScoreAndStats = _.last(scenarioSessions.filter(s => s.stats != null && s.score != null));
      const havingStats = _.last(scenarioSessions.filter(s => s.stats != null));

      return havingScoreAndStats || havingStats;
    })
    .filter(s => s !== undefined);

  const denormalizedHistograms = sessions.map(session => calculateSessionStats(session.stats, session.scenario === 0).histogram);


  const normalizedHistograms = denormalizedHistograms.map(histogram => {
    const countHistogram = [];
    let sum = 0;
    bins.forEach(bin => {
      countHistogram[bin] = histogram.hasOwnProperty(bin) ? histogram[bin].length : 0;
      sum += countHistogram[bin];
    });
    bins.forEach(bin => {
      countHistogram[bin] /= sum;
    })
    return countHistogram;
  });

  return normalizedHistograms;
};

export const accumulateHistograms = histograms => {

  const accHistogram = {};
  let sum = 0;

  histograms.forEach(histogram => {
    Object.keys(histogram).forEach(binName => {
      if (!accHistogram.hasOwnProperty(binName)) {
        accHistogram[binName] = 0;
      }
      accHistogram[binName] += histogram[binName];
    })
  });

  Object.keys(accHistogram).forEach(bin => sum += accHistogram[bin]);

  const normalized = _.mapValues(accHistogram, value => value / sum);

  return normalized;
};



export const getTimingHistogramForScenarios = (results) => {
  const histograms = [0, 1, 2, 3, 4].map(scenario => getNormalizedHistogramForScenario(results, scenario));

  const acc = histograms
    .map(responsesHistograms => accumulateHistograms(responsesHistograms))
    .map(histogram => _.map(histogram, (value, key) => {
      return {
        value: key,
        count: value
      }
    }));

  return acc;
}

export const getDataForTimingChart = (timingHistograms) => {


  const map = timingHistograms
    .map((th, i) => {
      const absoluteValues = bins.map((bin, serie) => th[serie] && th[serie].count);
      const stackedPercentiles = accumulateMap(absoluteValues, (item, i, acc) => item - acc, (item, i, acc) => item, 0);
      return {
        ...arrayToObject(absoluteValues, (v, i) => 'a' + i),
        ...arrayToObject(stackedPercentiles, (v, i) => 's' + i),
        label: labels[i],
        percentiles: bins,
      };
    });
  return map;
};
