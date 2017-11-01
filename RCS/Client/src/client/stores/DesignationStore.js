import EventEmitter from 'events';
import assign from 'object-assign';
import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';

// Store
var _store = {
  designations: [],
  designation: [],
  updateDesignation: false,
  designationsActive: [],
  designationInsertStatus: null,
  designationUpdateStatus: null,
  designationDeleteStatus: null
};

// Set data in the store
const setDesignations = (designations) => {
  _store.designations = designations;
};

const setDesignation = (designation) => {
  _store.designation = designation;
  _store.updateDesignation = true;
};

const setActiveDesignations = (designationsActive) => {
  _store.designationsActive = designationsActive;
};

var designationStore = assign({}, EventEmitter.prototype, {
  getDesignations() {
    return _store.designations;
  },
  getDesignation() {
    return _store.designation;
  },
  getDesignationStatus() {
    return _store.updateDesignation;
  },
  getActiveDesignations() {
      return _store.designationsActive;
  },
  getDesignationInsertStatus() {
    return _store.designationInsertStatus;
  },
  getDesignationUpdateStatus() {
    return _store.designationUpdateStatus;
  },
  getDesignationDeleteStatus() {
    return _store.designationDeleteStatus;
  },
  designationInsert(designation) {
    _store.designationInsertStatus = designation.message;
    if(_store.designationInsertStatus === constants.OK) {
      setDesignations(designation.data);
    }
  },
  designationUpdate(designation) {
    _store.designationUpdateStatus = designation.message;
    if(_store.designationUpdateStatus === constants.OK) {
      setDesignations(designation.data);
    }
  },
  designationDelete(designation) {
    _store.designationDeleteStatus = designation.message
    if(_store.designationDeleteStatus === constants.OK) {
      setDesignations(designation.data);
    }
  },
  resetStatus () {
    _store.designationInsertStatus = null;
    _store.designationUpdateStatus = null;
    _store.designationDeleteStatus = null;
    _store.updateDesignation = false;
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

designationStore.dispatchToken = AppDispatcher.register(function (payload) {
  var action = payload;
  switch (action.actionType) {
    case appConstants.DESIGNATION_GETALL:
      setDesignations(action.text);
      designationStore.emitChange();
    break;
    case appConstants.DESIGNATION_GETBYID:
      setDesignation(action.text);
      designationStore.emitChange();
    break;
    case appConstants.DESIGNATION_ACTIVEGETALL:
      setActiveDesignations(action.text);
      designationStore.emitChange();
    break;
    case appConstants.DESIGNATION_INSERT:
      designationStore.designationInsert(action.text);
      designationStore.emitChange();
    break;
    case appConstants.DESIGNATION_UPDATE:
      designationStore.designationUpdate(action.text);
      designationStore.emitChange();
    break;
    case appConstants.DESIGNATION_DELETE:
      designationStore.designationDelete(action.text);
      designationStore.emitChange();
    break;
    default:
      return true;
  }

  return true;
});

module.exports = designationStore;