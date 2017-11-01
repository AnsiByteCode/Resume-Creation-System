import EventEmitter from 'events';
import assign from 'object-assign';
import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';

// Store
var _store = {
  languages: [],
  language: [],
  updateLanguage: false,
  languagesActive: [],
  languageInsertStatus: null,
  languageUpdateStatus: null,
  languageDeleteStatus: null
};

// Set data in the store
const setLanguages = (languages) => {
  _store.languages = languages;
};

const setLanguage = (language) => {
  _store.language = language;
  _store.updateLanguage = true;
};

const setActiveLanguages = (languagesActive) => {
  _store.languagesActive = languagesActive;
};

var languageStore = assign({}, EventEmitter.prototype, {
  getLanguages() {
    return _store.languages;
  },
  getLanguage() {
    return _store.language;
  },
  getLanguageStatus() {
    return _store.updateLanguage;
  },
  getActiveLanguages() {
    return _store.languagesActive;
  },
  getLanguageInsertStatus() {
    return _store.languageInsertStatus;
  },
  getLanguageUpdateStatus() {
    return _store.languageUpdateStatus;
  },
  getLanguageDeleteStatus() {
      return _store.languageDeleteStatus;
  },
  languageInsert(language) {
    _store.languageInsertStatus = language.message;
    if(_store.languageInsertStatus === constants.OK)
    {
      setLanguages(language.data);
    }
  },
  languageUpdate(language) {
    _store.languageUpdateStatus = language.message;
    if(_store.languageUpdateStatus === constants.OK)
    {
      setLanguages(language.data);
    }
  },
  languageDelete(language) {
    _store.languageDeleteStatus = language.message
    if(_store.languageDeleteStatus === constants.OK)
    {
      setLanguages(language.data);
    }
  },
  resetStatus () {
    _store.languageInsertStatus = null;
    _store.languageUpdateStatus = null;
    _store.languageDeleteStatus = null;
    _store.updateLanguage = false;
  },
  emitChange() {
    this.emit('change');
  },
  addChangeListener(callback) {
    this.on('change', callback);
  },
  removeChangeListener(callback) {
    this.removeListener('change', callback);
  }
});

languageStore.dispatchToken = AppDispatcher.register(function (payload) {
  var action = payload;
  switch (action.actionType) {
    case appConstants.LANGUAGE_GETALL:
      setLanguages(action.text);
      languageStore.emitChange();
    break;
    case appConstants.LANGUAGE_GETBYID:
      setLanguage(action.text);
      languageStore.emitChange();
    break;
    case appConstants.LANGUAGE_ACTIVEGETALL:
      setActiveLanguages(action.text);
      languageStore.emitChange();
    break;
    case appConstants.LANGUAGE_INSERT:
      languageStore.languageInsert(action.text);
      languageStore.emitChange();
    break;
    case appConstants.LANGUAGE_UPDATE:
      languageStore.languageUpdate(action.text);
      languageStore.emitChange();
    break;
    case appConstants.LANGUAGE_DELETE:
      languageStore.languageDelete(action.text);
      languageStore.emitChange();
    break;
    default:
      return true;
  }

  return true;
});

module.exports = languageStore;