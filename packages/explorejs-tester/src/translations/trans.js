import types from './types';

export default function trans() {
  return function (target) {
    target.contextTypes = {...target.contextTypes, ...types};
    return target;
  };
}
