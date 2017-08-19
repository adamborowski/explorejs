import {Range} from 'explorejs-common';

export const loadResults = async()=>{

  const result = await fetch('/api/surveys');

  return fixResults(await result.json());

};

const fixResults = async (json) => json.map(j => {

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


export const calculateSessionStats = (stats) => {

  const viewStateMachine = new TimeMachine(stats.viewState);


  const allRequests = new RequestQuery(stats.requestManager);

  const requestsCausedByViewState = stats.viewState.map(vs => ({
    viewState: vs,
    requests: allRequests.during(vs.time, vs.time + 2000).containingRange(vs.state.currentLevelId, vs.state.range.start, vs.state.range.end).items
  }));

};
