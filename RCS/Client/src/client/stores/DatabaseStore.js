import EventEmitter from 'events';
import assign from 'object-assign';
import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';

// Store
var _store = {
  databases: [],
  database: [],
  updateDatabase: false,
  databasesActive: [],
  databaseInsertStatus: null,
  databaseUpdateStatus: null,
  databaseDeleteStatus: null
};

// Set data in the store
const setDatabases = (databases) => {
  _store.databases = databases;
};

const setDatabase = (database) => {
  _store.database = database;
  _store.updateDatabase = true;
};

const setActiveDatabases = (databasesActive) => {
  _store.databasesActive = databasesActive;
};

var databaseStore = assign({}, EventEmitter.prototype, {
  getDatabases() {
    return _store.databases;
  },
  getDatabase() {
    return _store.database;
  },
  getDatabaseStatus() {
    return _store.updateDatabase;
  },
  getActiveDatabases() {
    return _store.databasesActive;
  },
  getDatabaseInsertStatus() {
      return _store.databaseInsertStatus;
  },
  getDatabaseUpdateStatus() {
    return _store.databaseUpdateStatus;
  },
  getDatabaseDeleteStatus() {
    return _store.databaseDeleteStatus;
  },
  databaseInsert(database) {
    _store.databaseInsertStatus = database.message;
    if(_store.databaseInsertStatus === constants.OK) {
      setDatabases(database.data);
    }
  },
  databaseUpdate(database) {
      _store.databaseUpdateStatus = database.message;
      if(_store.databaseUpdateStatus === constants.OK) {
          setDatabases(database.data);
      }
  },
  databaseDelete(database) {
    _store.databaseDeleteStatus = database.message
    if(_store.databaseDeleteStatus === constants.OK) {
      setDatabases(database.data);
    }
  },
  resetStatus () {
    _store.databaseInsertStatus = null;
    _store.databaseUpdateStatus = null;
    _store.databaseDeleteStatus = null;
    _store.updateDatabase = false;
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

databaseStore.dispatchToken = AppDispatcher.register(function (payload) {
  var action = payload;
  switch (action.actionType) {
    case appConstants.DATABASE_GETALL:
      setDatabases(action.text);
      databaseStore.emitChange();
    break;
    case appConstants.DATABASE_GETBYID:
      setDatabase(action.text);
      databaseStore.emitChange();
    break;
    case appConstants.DATABASE_ACTIVEGETALL:
      setActiveDatabases(action.text);
      databaseStore.emitChange();
    break;
    case appConstants.DATABASE_INSERT:
      databaseStore.databaseInsert(action.text);
      databaseStore.emitChange();
    break;
    case appConstants.DATABASE_UPDATE:
      databaseStore.databaseUpdate(action.text);
      databaseStore.emitChange();
    break;
    case appConstants.DATABASE_DELETE:
      databaseStore.databaseDelete(action.text);
      databaseStore.emitChange();
    break;
    default:
      return true;
  }

  return true;
});

module.exports = databaseStore;