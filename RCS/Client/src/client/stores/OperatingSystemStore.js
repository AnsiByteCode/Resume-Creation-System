import EventEmitter from 'events';
import assign from 'object-assign';
import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';

// Store
var _store = {
  operatingSystems: [],
  operatingSystem: [],
  updateOperatingSystem: false,
  operatingSystemsActive: [],
  operatingSystemInsertStatus: null,
  operatingSystemUpdateStatus: null,
  operatingSystemDeleteStatus: null
};

// Set data in the store
const setOperatingSystems = (operatingSystems) => {
  _store.operatingSystems = operatingSystems;
};

const setOperatingSystem = (operatingSystem) => {
  _store.operatingSystem = operatingSystem;
  _store.updateOperatingSystem = true;
};

const setActiveOperatingSystems = (operatingSystemsActive) => {
  _store.operatingSystemsActive = operatingSystemsActive;
};

var operatingSystemStore = assign({}, EventEmitter.prototype, {
  getOperatingSystems() {
    return _store.operatingSystems;
  },
  getOperatingSystem() {
    return _store.operatingSystem;
  },
  getOperatingSystemStatus() {
    return _store.updateOperatingSystem;
  },
  getActiveOperatingSystems() {
    return _store.operatingSystemsActive;
  },
  getOperatingSystemInsertStatus() {
    return _store.operatingSystemInsertStatus;
  },
  getOperatingSystemUpdateStatus() {
    return _store.operatingSystemUpdateStatus;
  },
  getOperatingSystemDeleteStatus() {
    return _store.operatingSystemDeleteStatus;
  },
  operatingSystemInsert(operatingSystem) {
    _store.operatingSystemInsertStatus = operatingSystem.message;
    if(_store.operatingSystemInsertStatus === constants.OK)
    {
      setOperatingSystems(operatingSystem.data);
    }
  },
  operatingSystemUpdate(operatingSystem) {
    _store.operatingSystemUpdateStatus = operatingSystem.message;
    if(_store.operatingSystemUpdateStatus === constants.OK)
    {
      setOperatingSystems(operatingSystem.data);
    }
  },
  operatingSystemDelete(operatingSystem) {
    _store.operatingSystemDeleteStatus = operatingSystem.message
    if(_store.operatingSystemDeleteStatus === constants.OK)
    {
      setOperatingSystems(operatingSystem.data);
    }
  },
  resetStatus () {
    _store.operatingSystemInsertStatus = null;
    _store.operatingSystemUpdateStatus = null;
    _store.operatingSystemDeleteStatus = null;
    _store.updateOperatingSystem = false;
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

operatingSystemStore.dispatchToken = AppDispatcher.register(function (payload) {
  var action = payload;
  switch (action.actionType) {
    case appConstants.OPERATINGSYSTEM_GETALL:
      setOperatingSystems(action.text);
      operatingSystemStore.emitChange();
    break;
    case appConstants.OPERATINGSYSTEM_GETBYID:
      setOperatingSystem(action.text);
      operatingSystemStore.emitChange();
    break;
    case appConstants.OPERATINGSYSTEM_ACTIVEGETALL:
      setActiveOperatingSystems(action.text);
      operatingSystemStore.emitChange();
    break;
    case appConstants.OPERATINGSYSTEM_INSERT:
      operatingSystemStore.operatingSystemInsert(action.text);
      operatingSystemStore.emitChange();
    break;
    case appConstants.OPERATINGSYSTEM_UPDATE:
      operatingSystemStore.operatingSystemUpdate(action.text);
      operatingSystemStore.emitChange();
    break;
    case appConstants.OPERATINGSYSTEM_DELETE:
      operatingSystemStore.operatingSystemDelete(action.text);
      operatingSystemStore.emitChange();
    break;
    default:
      return true;
  }

  return true;
});

module.exports = operatingSystemStore;