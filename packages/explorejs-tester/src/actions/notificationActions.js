import * as types from '../constants/actionTypes';

/**
 * Initializes the application with the main data: scenarios. Some reducer should shuffle it and then put into the state
 */
export const pushNotification = (message, messageType = 'danger', timeout = 3000) => ({
  type: types.PUSH_NOTIFICATION,
  messageType,
  message,
  id: new Date().getTime(),
  timeout
});

export const closeNotification = (messageId) => ({
  type: types.CLOSE_NOTIFICATION,
  id: messageId
});

