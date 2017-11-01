import EventEmitter from 'events';
import assign from 'object-assign';
import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';

// Store
var _store = {
  applications: [],
  application: [],
  updateApplication: false,
  applicationsActive: [],
  applicationInsertStatus: null,
  applicationUpdateStatus: null,
  applicationDeleteStatus: null
};

// Set data in the store
const setApplications = (applications) => {
  _store.applications = applications;
};

const setApplication = (application) => {
  _store.application = application;
  _store.updateApplication = true;
};

const setActiveApplications = (applicationsActive) => {
  _store.applicationsActive = applicationsActive;
};

var applicationStore = assign({}, EventEmitter.prototype, {
  getApplications() {
    return _store.applications;
  },
  getApplication() {
    return _store.application;
  },
  getApplicationStatus() {
    return _store.updateApplication;
  },
  getActiveApplications() {
    return _store.applicationsActive;
  },
  getApplicationInsertStatus() {
    return _store.applicationInsertStatus;
  },
  getApplicationUpdateStatus() {
    return _store.applicationUpdateStatus;
  },
  getApplicationDeleteStatus() {
    return _store.applicationDeleteStatus;
  },
  applicationInsert(application) {
    _store.applicationInsertStatus = application.message;
    if(_store.applicationInsertStatus === constants.OK)
    {
      setApplications(application.data);
    }
  },
  applicationUpdate(application) {
    _store.applicationUpdateStatus = application.message;
    if(_store.applicationUpdateStatus === constants.OK)
    {
      setApplications(application.data);
    }
  },
  applicationDelete(application) {
    _store.applicationDeleteStatus = application.message
    if(_store.applicationDeleteStatus === constants.OK)
    {
      setApplications(application.data);
    }
  },
  resetStatus () {
    _store.applicationInsertStatus = null;
    _store.applicationUpdateStatus = null;
    _store.applicationDeleteStatus = null;
    _store.updateApplication = false;
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

applicationStore.dispatchToken = AppDispatcher.register(function (payload) {
  var action = payload;
  switch (action.actionType) {
    case appConstants.APPLICATION_GETALL:
      setApplications(action.text);
      applicationStore.emitChange();
    break;
    case appConstants.APPLICATION_GETBYID:
      setApplication(action.text);
      applicationStore.emitChange();
    break;
    case appConstants.APPLICATION_ACTIVEGETALL:
      setActiveApplications(action.text);
      applicationStore.emitChange();
    break;
    case appConstants.APPLICATION_INSERT:
      applicationStore.applicationInsert(action.text);
      applicationStore.emitChange();
    break;
    case appConstants.APPLICATION_UPDATE:
      applicationStore.applicationUpdate(action.text);
      applicationStore.emitChange();
    break;
    case appConstants.APPLICATION_DELETE:
      applicationStore.applicationDelete(action.text);
      applicationStore.emitChange();
    break;
    default:
      return true;
  }

  return true;
});

module.exports = applicationStore;