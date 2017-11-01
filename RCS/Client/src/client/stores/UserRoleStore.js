import EventEmitter from 'events';
import assign from 'object-assign';
import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';

// Store
var _store = {
  userRoles: [],
  userRole: [],
  userRoleInsertStatus: ''
};

// Set data in the store
const setUserRoles = (userRoles) => {
  _store.userRoles = userRoles;
};

const setUserRole = (userRole) => {
  _store.userRole = userRole;
};

var userRoleStore = assign({}, EventEmitter.prototype, {
  getUserRole() {
    return _store.userRole;
  },
  getUserRoleInsertStatus() {
    return _store.userRoleInsertStatus;
  },
  userRoleInsert(userRole) {
    _store.userRoleInsertStatus = userRole.message;
    if(_store.userRoleInsertStatus === constants.OK)
    {
      setUserRoles(userRole.data);
    }
  },
  resetStatus() {
    _store.userRole = [];
    _store.userRoleInsertStatus = '';
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

userRoleStore.dispatchToken = AppDispatcher.register(function (payload) {
  var action = payload;
  switch (action.actionType) {
    case appConstants.USERROLE_GETBYID:
      setUserRole(action.text);
      userRoleStore.emitChange();
    break;
    case appConstants.USERROLE_INSERT:
      userRoleStore.userRoleInsert(action.text);
      userRoleStore.emitChange();
    break;
    default:
      return true;
  }

  return true;
});

module.exports = userRoleStore;