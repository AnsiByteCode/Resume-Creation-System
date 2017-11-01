import EventEmitter from 'events';
import assign from 'object-assign';
import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';

// Store
var _store = {
  frameworks: [],
  framework: [],
  updateFramework: false,
  frameworksActive: [],
  frameworkInsertStatus: null,
  frameworkUpdateStatus: null,
  frameworkDeleteStatus: null
};

// Set data in the store
const setFrameworks = (frameworks) => {
  _store.frameworks = frameworks;
};

const setFramework = (framework) => {
  _store.framework = framework;
  _store.updateFramework = true;
};

const setActiveFrameworks = (frameworksActive) => {
  _store.frameworksActive = frameworksActive;
};

var frameworkStore = assign({}, EventEmitter.prototype, {
  getFrameworks() {
    return _store.frameworks;
  },
  getFramework() {
    return _store.framework;
  },
  getFrameworkStatus() {
    return _store.updateFramework;
  },
  getActiveFrameworks() {
    return _store.frameworksActive;
  },
  getFrameworkInsertStatus() {
    return _store.frameworkInsertStatus;
  },
  getFrameworkUpdateStatus() {
    return _store.frameworkUpdateStatus;
  },
  getFrameworkDeleteStatus() {
    return _store.frameworkDeleteStatus;
  },
  frameworkInsert(framework) {
    _store.frameworkInsertStatus = framework.message;
    if(_store.frameworkInsertStatus === constants.OK)
    {
      setFrameworks(framework.data);
    }
  },
  frameworkUpdate(framework) {
    _store.frameworkUpdateStatus = framework.message;
    if(_store.frameworkUpdateStatus === constants.OK)
    {
      setFrameworks(framework.data);
    }
  },
  frameworkDelete(framework) {
    _store.frameworkDeleteStatus = framework.message
    if(_store.frameworkDeleteStatus === constants.OK)
    {
      setFrameworks(framework.data);
    }
  },
  resetStatus () {
    _store.frameworkInsertStatus = null;
    _store.frameworkUpdateStatus = null;
    _store.frameworkDeleteStatus = null;
    _store.updateFramework = false;
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

frameworkStore.dispatchToken = AppDispatcher.register(function (payload) {
  var action = payload;
  switch (action.actionType) {
    case appConstants.FRAMEWORK_GETALL:
      setFrameworks(action.text);
      frameworkStore.emitChange();
    break;
    case appConstants.FRAMEWORK_GETBYID:
      setFramework(action.text);
      frameworkStore.emitChange();
    break;
    case appConstants.FRAMEWORK_ACTIVEGETALL:
      setActiveFrameworks(action.text);
      frameworkStore.emitChange();
    break;
    case appConstants.FRAMEWORK_INSERT:
      frameworkStore.frameworkInsert(action.text);
      frameworkStore.emitChange();
    break;
    case appConstants.FRAMEWORK_UPDATE:
      frameworkStore.frameworkUpdate(action.text);
      frameworkStore.emitChange();
    break;
    case appConstants.FRAMEWORK_DELETE:
      frameworkStore.frameworkDelete(action.text);
      frameworkStore.emitChange();
    break;
    default:
      return true;
  }

  return true;
});

module.exports = frameworkStore;