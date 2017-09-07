import _ from 'lodash';
import xspans from 'xspans';
import {createBin} from '../utils';

const getDumpIndex = (time, cacheDumpStats) => {

  if (cacheDumpStats.length === 0) {
    return -1;
  }

  if (time > cacheDumpStats[cacheDumpStats.length - 1].time) {
    // state after all cache, last dump is valid
    return cacheDumpStats.length - 1;
  }

  return cacheDumpStats.findIndex(dump => time <= dump.time) - 1;
};

const createInitialDump = (cacheDumpStats) => {
  const dump = {...cacheDumpStats[0]};
  dump.time = 0;
  dump.levels = dump.levels.map(l => ({...l, dataIndex: []}));
  return dump;
};


const getCacheDumpGap = (viewState, cacheDump) => {
  if (cacheDump === undefined) {
    // when initial dump
    return 1;
  }
  const expectedLevelCache = cacheDump.levels.find(c => c.level === viewState.state.currentLevelId).dataIndex;
  const viewRange = viewState.state.range;
  const gapsInView = xspans([viewRange]).sub(expectedLevelCache).toObjects('start', 'end');
  const rangeLength = viewRange.end - viewRange.start;
  const gapsLength = gapsInView.reduce((sum, range) => sum + (range.end - range.start), 0);

  return {ratio: gapsLength / rangeLength, gaps: gapsInView};
};

const getDumpsDuringGap = (viewState, initialIndex, cacheDumpStats, until = Infinity) => {
  const dumps = [];
  const maxIndex = cacheDumpStats.length - 1;
  let currentIndex = initialIndex;

  while (currentIndex < maxIndex) {
    const cacheDump = cacheDumpStats[currentIndex];

    if (cacheDump && cacheDump.time > until) {
      break;
    }
    const currentGap = getCacheDumpGap(viewState, cacheDump);
    dumps.push({dump: cacheDump, gap: currentGap});
    if (currentGap.ratio === 0) {
      break;
    }
    currentIndex += 1;
  }

  return dumps;
};

const getCacheHitForViewState = (viewState, cacheDumpStats, until = Infinity) => {

  if (cacheDumpStats.length === 0) {
    // requested for non cache system
    throw new Error('no cache dumps - did you request cache hit for non-cache preset?');
  }

  const dumpIndex = getDumpIndex(viewState.time, cacheDumpStats);

  const dumpsDuringGap = getDumpsDuringGap(viewState, dumpIndex, cacheDumpStats, Infinity); // include all gap dumps even if view state changed (otherwise we will think that every state loaded fast as changed not actualy loaded)

  // we count waiting only from dumps which occured before next view state?

  const lastDump = dumpsDuringGap[dumpsDuringGap.length - 1].dump;
  const waiting = dumpsDuringGap[0].gap === 0 ? 0 :
    Math.max(0, (lastDump ? lastDump.time : until) - viewState.time); // if hit without gaps, time can be negative as dump was before view state

  return {dumpsDuringGap, waiting}

};


export const calculateCacheHit = (viewStateStats, cacheDumpStats) => {

  return viewStateStats.map((viewStateStat, i) => ({
    ...viewStateStat,
    cacheHit: getCacheHitForViewState(viewStateStat, cacheDumpStats, viewStateStats[i + 1] ? viewStateStats[i + 1].time : Infinity)
  }));
};

export const getHistogramDataForCacheHit = (calculatedCacheHitStats) => {

  const histogram = createBin(calculatedCacheHitStats, [100, 1000, 2000, 4000], ['0s', '<=0.1s', '<=1s', '<=2s', '<=4s', '>4s'], s => s.cacheHit.waiting);

  return histogram;
}

export const normalizeHistogram = (histogram) => {

  const sum = histogram.reduce((sum, bin) => sum + bin.count, 0);

  return histogram.map(bin => ({...bin, count: bin.count / sum}));
};
