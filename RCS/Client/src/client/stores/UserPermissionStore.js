import EventEmitter from 'events';
import assign from 'object-assign';
import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';

// Store
var _store = {
  userPermissions: [],
  userPermission: [],
  userPermissionInsertStatus: ''
};

// Set data in the store
const setUserPermissions = (userPermissions) => {
  _store.userPermissions = userPermissions;
};

const setUserPermission = (userPermission) => {
  _store.userPermission = userPermission;
};

var userPermissionStore = assign({}, EventEmitter.prototype, {
  getUserPermissions() {
    return _store.userPermissions;
  },
  getUserPermission() {
    return _store.userPermission;
  },
  getUserPermissionInsertStatus() {
    return _store.userPermissionInsertStatus;
  },
  userPermissionInsert(userPermission) {
    _store.userPermissionInsertStatus = userPermission.message;
    if(_store.userPermissionInsertStatus === constants.OK)
    {
      setUserPermissions(userPermission.data);
    }
  },
  resetStatus() {
    _store.userPermission = [];
    _store.userPermissionInsertStatus = '';
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

userPermissionStore.dispatchToken = AppDispatcher.register(function (payload) {
  var action = payload;
  switch (action.actionType) {
    case appConstants.USERPERMISSION_GETALL:
      setUserPermissions(action.text);
      userPermissionStore.emitChange();
    break;
    case appConstants.USERPERMISSION_GETBYID:
      setUserPermission(action.text);
      userPermissionStore.emitChange();
    break;
    case appConstants.USERPERMISSION_INSERT:
      userPermissionStore.userPermissionInsert(action.text);
      userPermissionStore.emitChange();
    break;
    default:
      return true;
  }

  return true;
});

module.exports = userPermissionStore;