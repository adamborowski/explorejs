import moment from 'moment';
import _ from 'lodash';

const format = 'YYYY-MM-DD HH:mm';

export const formatDate = date => moment(date).format(format);


export const arrayToObject = (array, getKey = (v, i) => i, getValue = v => v) => {

  const obj = {};

  for (let i = 0; i < array.length; i += 1) {
    obj[getKey(array[i], i)] = getValue(array[i], i);
  }
  return obj;
};

export const objectToArray = (object, mapFn) => Object.keys(object).map(key => mapFn(object[key], key))

export const accumulateMap = (array, mapFn, accFn, initAcc) => {
  let acc = initAcc;
  return array.map((item, i) => {
    const mapped = mapFn(item, i, acc);
    acc = accFn(item, i, acc);
    return mapped;
  })
};


export const createBin = (values = [], bins = [0.1, 1, 10], labels = undefined, valueAccessor = v => v) => {
  if (labels === undefined) {
    labels = [...bins.map(l => '<=' + l), '>' + bins[bins.length - 1]]
  }
  const counters = {};
  values.forEach(v => {
    const value = valueAccessor(v);
    let binIndex = bins.length;
    for (let i = 0; i < bins.length; i++) {
      const binEdge = bins[i];

      if (value <= binEdge) {
        binIndex = i;
        break;
      }
    }
    if (!counters[binIndex]) {
      counters[binIndex] = 0
    }
    counters[binIndex]++;
  });

  return labels.map((bin, index) => ({value: labels[index], count: counters[index] || 0}));
};

export const sumBins = (bins) => {


  const firstBin = bins.find(b => b.length > 0);
  if (firstBin === undefined) {
    return []; // empty
  }

  const rest = bins.filter(b => b !== firstBin);

  const histogram = _.cloneDeep(firstBin);

  rest.forEach(bin => bin.forEach(point => histogram.find(h => h.value === point.value).count += point.count))
  return histogram;
};
