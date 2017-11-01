import EventEmitter from 'events';
import assign from 'object-assign';
import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';

// Store
var _store = {
  rolePermissions: [],
  rolePermission: [],
  rolePermissionInsertStatus: ''
};

// Set data in the store
const setRolePermissions = (rolePermissions) => {
  _store.rolePermissions = rolePermissions;
};

const setRolePermission = (rolePermission) => {
  _store.rolePermission = rolePermission;
};

var rolePermissionStore = assign({}, EventEmitter.prototype, {
  getRolePermissions() {
    return _store.rolePermissions;
  },
  getRolePermission() {
    return _store.rolePermission;
  },
  getRolePermissionInsertStatus() {
    return _store.rolePermissionInsertStatus;
  },
  rolePermissionInsert(rolePermission) {
    _store.rolePermissionInsertStatus = rolePermission.message;
    if(_store.rolePermissionInsertStatus === constants.OK)
    {
      setRolePermissions(rolePermission.data);
    }
  },
  resetStatus() {
    _store.rolePermission = [];
    _store.rolePermissionInsertStatus = '';
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

rolePermissionStore.dispatchToken = AppDispatcher.register(function (payload) {
  var action = payload;
  switch (action.actionType) {
    case appConstants.ROLEPERMISSION_GETALL:
      setRolePermissions(action.text);
      rolePermissionStore.emitChange();
    break;
    case appConstants.ROLEPERMISSION_GETBYID:
      setRolePermission(action.text);
      rolePermissionStore.emitChange();
    break;
    case appConstants.ROLEPERMISSION_INSERT:
      rolePermissionStore.rolePermissionInsert(action.text);
      rolePermissionStore.emitChange();
    break;
    default:
      return true;
  }

  return true;
});

module.exports = rolePermissionStore;