import React from 'react';
import browserLocale from 'browser-locale';
import deep from 'getsetdeep';
import en_US from './en_US';
import pl_PL from './pl_PL';


const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE';
const stores = [];
const callbacks = [];
const supportedLanguages = {en_US, pl_PL};
const fallbackLanguage = 'en_US';

const getSupportedLanguage = language => supportedLanguages.hasOwnProperty(language) ? language : fallbackLanguage;

let language = getSupportedLanguage(browserLocale().replace('-', '_'));


export const setLanguage = (newLanguage) => {
  language = getSupportedLanguage(newLanguage);
  stores.forEach(s => s.dispatch({type: CHANGE_LANGUAGE, language: newLanguage}));
  callbacks.forEach(c => c(newLanguage));
};

export const getSupportedLanguages = () => Object.keys(supportedLanguages);

export const createReducer = () => {
  return (state = language, action) => {
    if (action.type === CHANGE_LANGUAGE) {
      return action.language;
    }
    return state;
  };
};

export const syncLanguageWithStore = store => stores.push(store);

const getTranslatable = (path) => {
  const translatable = deep.getDeep(supportedLanguages[language], path);
  if (translatable === undefined) {
    const fallbackTranslatable = deep.getDeep(supportedLanguages[fallbackLanguage], path);
    if (fallbackTranslatable === undefined) {
      console.warn(`no translatable found for language path ${path}`);
      return path;
    }
    return fallbackTranslatable;
  }
  return translatable;
};

const getDynamicTranslatable = (source) => {

  if (typeof source !== 'object' || React.isValidElement(source)) {
    return source; // data object not configured for translation, just return as is
  }

  const translatable = source[language];
  if (translatable === undefined) {
    const fallbackTranslatable = source[fallbackLanguage];
    if (fallbackTranslatable === undefined) {
      console.warn(`dynamic translation does not support current and fallback languages`);
      return source[Object.keys(source)[0]]; // returning first available translation
    }
    return fallbackTranslatable;
  }
  return translatable;
};

const evaluateTranslatable = (translatable, params) => {
  if (typeof translatable === 'function') {
    return translatable(params);
  }
  else return translatable;
};


const translate = (path, params) => evaluateTranslatable(getTranslatable(path), params);
export default translate;

export const translateDynamic = (source, params) => evaluateTranslatable(getDynamicTranslatable(source), params);

export const getLanguage = () => language;

export const registerCallback = (callback) => {
  callbacks.push(callback);
  return () => {
    callback.splice(callback.findIndex(callback), 1);
  };
};
