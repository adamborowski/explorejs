import * as types from '../constants/actionTypes';

/**
 * Initializes the application with the main data: scenarios. Some reducer should shuffle it and then put into the state
 */
export const pushNotification = (message, messageType = 'danger') => ({
  type: types.PUSH_NOTIFICATION,
  messageType,
  message,
  id: new Date().getTime()
});

export const closeNotification = (messageId) => ({
  type: types.CLOSE_NOTIFICATION,
  id: messageId
});

