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

/**
 * Get a translated value which can be a final string or translating function
 * @param path if object - it is a dynamic translation with keys as supported languages, it returns a proper value of object
 * if string - it tries to get value from current locale otherwise it tries to get from fallback locale, if still not found - returns the path itself
 * @returns {*}
 */
export const getTranslatable = (path) => {
  if (typeof path === 'object') {
    const translatable = path[language];
    if (translatable === undefined) {
      const fallbackTranslatable = path[fallbackLanguage];
      if (fallbackTranslatable === undefined) {
        console.warn(`dynamic translation does not support current and fallback languages`);
        return path[Object.keys(path)[0]]; // returning first available translation
      }
      return fallbackTranslatable;
    }
    return translatable;
  }
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

const translate = (path, params) => {
  const translatable = getTranslatable(path);
  if (typeof translatable === 'string') {
    return translatable;
  }
  else return translatable(params);
};

export default translate;

export const getLanguage = () => language;

export const registerCallback = (callback) => {
  callbacks.push(callback);
  return () => {
    callback.splice(callback.findIndex(callback), 1);
  };
};
