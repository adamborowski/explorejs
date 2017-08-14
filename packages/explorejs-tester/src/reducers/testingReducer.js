/* eslint-disable no-unused-vars */
import initialState from './initialState';

import {
  ADD_ANALYTICS_EVENT,
  FINISH_INTRO, SEND_COMPLETE, SEND_ERROR, SEND_STARTED, SUMMARY_QUESTION_ANSWERED,
  SWITCH_INSTRUCTIONS
} from '../constants/actionTypes';

export default function testingReducer(state = initialState.testing, action) {
  return state; // todo maybe impement something here
}

export const finalAnswersReducer = (state = initialState.finalAnswers, action) => {
  switch (action.type) {
    case SUMMARY_QUESTION_ANSWERED:
      return {
        ...state,
        [action.questionId]: action.value
      };
    default:
      return state;
  }
}


export const switchInstructionsReducer = (state = true, action) => {
  switch (action.type) {
    case SWITCH_INSTRUCTIONS:
      return !state;
  }
  return state;
};

export const introFinishedReducer = (state = false, action) => {
  switch (action.type) {
    case FINISH_INTRO:
      return true;
  }
  return state;
};

export const sendStateReducer = (state = {loading: false, completed: false, error: null}, action) => {
  switch (action.type) {
    case SEND_STARTED:
      return {loading: true, completed: false, error: null};
    case SEND_COMPLETE:
      return {loading: false, completed: true, error: null};
    case SEND_ERROR:
      return {loading: false, completed: false, error: action.message};
  }
  return state;
};


export const analyticsReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_ANALYTICS_EVENT: {
      return [...state, action.payload];
    }
  }
  return state;
};
