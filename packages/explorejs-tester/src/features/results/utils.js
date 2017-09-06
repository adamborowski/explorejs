import moment from 'moment';

const format = 'YYYY-MM-DD HH:mm';

export const formatDate = date => moment(date).format(format);


export const arrayToObject = (array, getKey = (v, i) => i, getValue = v => v) => {

  const obj = {};

  for (let i = 0; i < array.length; i += 1) {
    obj[getKey(array[i], i)] = getValue(array[i], i);
  }
  return obj;
};


export const accumulateMap = (array, mapFn, accFn, initAcc) => {
  let acc = initAcc;
  return array.map((item, i) => {
    const mapped = mapFn(item, i, acc);
    acc = accFn(item, i, acc);
    return mapped;
  })
};
