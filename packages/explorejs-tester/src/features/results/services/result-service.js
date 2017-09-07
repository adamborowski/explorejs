import {Range} from 'explorejs-common';
import {groupBy} from 'lodash';

export const loadResults = async () => {

  const result = await fetch('/api/surveys');
  const json = await result.json();

  json.sort((a, b) => -(a.time || '').localeCompare(b.time || ''));

  return fixResults(json);

};

const fixResults = async (json) => json.map(j => {
  if (j.data.sessions.length < 2) {
    return j; // no second session - nothing to fix
  }

  const [sess1, sess2, ...restSessions] = j.data.sessions;
  if (sess2 && sess2.stats === undefined) {
    sess2.stats = sess1.stats;
    delete sess1.stats;
  }

  return ({
    ...j, data: {
      ...j.data, sessions: [sess1, sess2, ...restSessions]
    }
  });
});

class TimeMachine {
  items;
  getter;
  currentItem = 0;

  constructor(items, getter = i => i.time) {
    this.items = items;
    this.getter = getter;
  }

  getIndex(time) {
    let currentItem = this.currentItem;
    const {getter, items} = this;
    while (currentItem < items.length - 1 && getter(items[currentItem]) < time) {
      currentItem += 1;
    }
    while (currentItem > 0 && getter(items[currentItem]) > time) {
      currentItem -= 1;
    }

    return currentItem;
  }

  getState(time) {
    return this.items[this.getIndex(time)];
  }

}

class RequestQuery {
  constructor(items, startGetter = s => s.startTime, endGetter = s => s.finishTime) {
    this.items = items;
    this.startGetter = startGetter;
    this.endGetter = endGetter;
  }

  during(start, end) {
    const {startGetter, endGetter} = this;
    return new RequestQuery(this.items.filter(i => Range.leftClosed(startGetter(i), endGetter(i)).hasCommon(Range.leftClosed(start, end))), startGetter, endGetter);
  }

  /**
   * Returns only those items with requests overlapping with given params on given level
   * (useful when we want to know if there was any request of viewState's parameters for some time?)
   * so for every viewState change - we query for all requests during that time range (x, x + 500ms delay)
   * and filter out batch requests which do not contain the viewState requests of viewState id, overlapping with viewState range
   * @param level
   * @param start
   * @param end
   * @returns {RequestQuery}
   */
  containingRange(level, start, end) {

    const {startGetter, endGetter} = this;
    return new RequestQuery(this.items.filter(i => {
      const requests = i.requests
        .filter(r => r.level === level)
        .filter(r => Range.leftClosed(start, end).hasCommon(Range.leftClosed(r.openTime, r.closeTime)));
      return requests.length > 0;
    }), startGetter, endGetter);
  }

}

export const bins = ['0s', '<=0.1s', '<=1s', '<=2s', '<=4s', '>4s']

const getTimeBin = time => {
  if (time <= 0) {
    return bins[0];
  }
  if (time <= 100) {
    return bins[1]
  }
  if (time <= 1000) {
    return bins[2];
  }
  if (time <= 2000) {
    return bins[3];
  }
  if (time <= 4000) {
    return bins[4];
  }
  return bins[5];
};


export const calculateSessionStats = (stats, treatNoRequestsAsImpossible = false) => {

  const viewStateMachine = new TimeMachine(stats.viewState.slice(1)); // we ignore fist!


  const allRequests = new RequestQuery(stats.requestManager);

  const fixedStart = new Date('1969-12-31 22:00').getTime();
  const fixedEnd = new Date('2017-06-08 05:55:50').getTime();

  const requestsCausedByViewState = stats.viewState
    .map((vs, i) => ({...vs, timeEnd: stats.viewState[i + 1] ? stats.viewState[i + 1].time : vs.time + 1000}))
    .filter(vs => vs.state.currentLevelId !== 'raw') // truncate playing with too little data or when zoomed out too much
    .filter(vs => vs.state.currentLevelId !== '1y')
    .filter(vs => vs.state.scale < 904067979)
    .filter(vs => vs.state.range.end > fixedStart && vs.state.range.start < fixedEnd)
    .map(vs => ({
      viewState: vs,
      requests: allRequests.during(vs.time, vs.time + 2000).containingRange(vs.state.currentLevelId, vs.state.range.start, vs.state.range.end).items
    }))
    .map(state => ({
      ...state,
      sumSize: state.requests.reduce((sum, req) => sum + req.size, 0),
      waitTime: state.requests.map(r => r.finishTime - r.startTime).reduce((max, time) => Math.max(max, time), 0)
    }))
    .filter(s => !treatNoRequestsAsImpossible || s.waitTime > 0)

  ;

  const histogram = groupBy(requestsCausedByViewState, r => getTimeBin(r.waitTime));

  const sumOfWaiting = requestsCausedByViewState.reduce((waitTime, state) => waitTime + state.waitTime, 0)
  const numRequests = allRequests.items.length;
  const numStates = stats.viewState.length;
  const waitPerState = sumOfWaiting / numStates;
  const totalDataSize = stats.requestManager.reduce((sum, request) => request.size + sum, 0);
  return {
    totalDataSize,
    mock: requestsCausedByViewState,
    numRequests,
    sumOfWaiting,
    numStates,
    waitPerState,
    histogram
  };

};
