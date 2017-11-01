import EventEmitter from 'events';
import assign from 'object-assign';
import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';

// Store
var _store = {
  roles: [],
  role: [],
  updateRole: false,
  rolesActive: [],
  roleInsertStatus: null,
  roleUpdateStatus: null,
  roleDeleteStatus: null
};

// Set data in the store
const setRoles = (roles) => {
  _store.roles = roles;
};

const setRole = (role) => {
  _store.role = role;
  _store.updateRole = true;
};

const setActiveRoles = (rolesActive) => {
  _store.rolesActive = rolesActive;
};

var roleStore = assign({}, EventEmitter.prototype, {
  getRoles() {
    return _store.roles;
  },
  getRole() {
    return _store.role;
  },
  getRoleStatus() {
    return _store.updateRole;
  },
  getActiveRoles() {
    return _store.rolesActive;
  },
  getRoleInsertStatus() {
    return _store.roleInsertStatus;
  },
  getRoleUpdateStatus() {
    return _store.roleUpdateStatus;
  },
  getRoleDeleteStatus() {
    return _store.roleDeleteStatus;
  },
  roleInsert(role) {
    _store.roleInsertStatus = role.message;
    if(_store.roleInsertStatus === constants.OK)
    {
      setRoles(role.data);
    }
  },
  roleUpdate(role) {
    _store.roleUpdateStatus = role.message;
    if(_store.roleUpdateStatus === constants.OK)
    {
      setRoles(role.data);
    }
  },
  roleDelete(role) {
    _store.roleDeleteStatus = role.message;
    if(_store.roleDeleteStatus === constants.OK)
    {
      setRoles(role.data);
    }
  },
  resetStatus () {
    _store.roleInsertStatus = null;
    _store.roleUpdateStatus = null;
    _store.roleDeleteStatus = null;
    _store.updateRole = false;
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

roleStore.dispatchToken = AppDispatcher.register(function (payload) {
  var action = payload;
  switch (action.actionType) {
    case appConstants.ROLE_GETALL:
      setRoles(action.text);
      roleStore.emitChange();
    break;
    case appConstants.ROLE_GETBYID:
      setRole(action.text);
      roleStore.emitChange();
    break;
    case appConstants.ROLE_ACTIVEGETALL:
      setActiveRoles(action.text);
      roleStore.emitChange();
    break;
    case appConstants.ROLE_INSERT:
      roleStore.roleInsert(action.text);
      roleStore.emitChange();
    break;
    case appConstants.ROLE_UPDATE:
      roleStore.roleUpdate(action.text);
      roleStore.emitChange();
    break;
    case appConstants.ROLE_DELETE:
      roleStore.roleDelete(action.text);
      roleStore.emitChange();
    break;
    default:
      return true;
  }

  return true;
});

module.exports = roleStore;