import * as types from './types';

let dialogSequence = 0;

/**
 * Dialog resolution object
 * @typedef {Object} DialogResolution
 * @property {string} key - key of message
 * @property {string} message - the content of the resolution like 'Apply' or 'Decline'
 * @property {string} action - the action object to be fired as a result (or thunk, it doesn't matter)
 * @property {string} [type] - the type of response, used to style buttons with CSS
 */


/**
 * Shows the dialog
 * @param message
 * @param {DialogResolution[]} resolutions the array with key and message of available resolutions
 */
export const showDialog = (message, resolutions = []) => ({
  type: types.SHOW_DIALOG,
  id: dialogSequence++,
  message,
  resolutions
});

/**
 * Hides the dialog as the result of choosing one of result
 * @param id
 * @param resolution
 */
export const hideDialog = (id, resolution = 'close') => ({
  type: types.HIDE_DIALOG,
  id,
  resolution
});
