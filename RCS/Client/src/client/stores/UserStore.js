import EventEmitter from 'events';
import assign from 'object-assign';
import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';

// Store
var _store = {
  users: [],
  user: [],
  updateUser: false,
  usersActive: [],
  userInsertStatus: null,
  userUpdateStatus: null,
  userDeleteStatus: null,
  permissions: []
};

// Set data in the store
const setUsers = (users) => {
  _store.users = users;
};

const setUser = (user) => {
  _store.user = user;
  _store.updateUser = true;
};

const setActiveUsers = (usersActive) => {
  _store.usersActive = usersActive;
};

const setPermissions = (permissions) => {
  _store.permissions = permissions;
};

var userStore = assign({}, EventEmitter.prototype, {
  getUsers() {
    return _store.users;
  },
  getUser() {
    return _store.user;
  },
  getUserStatus() {
    return _store.updateUser;
  },
  getActiveUsers() {
    return _store.usersActive;
  },
  getUserInsertStatus() {
    return _store.userInsertStatus;
  },
  getUserUpdateStatus() {
    return _store.userUpdateStatus;
  },
  getUserDeleteStatus() {
    return _store.userDeleteStatus;
  },
  userInsert(user) {
    _store.userInsertStatus = user.message;
    if(_store.userInsertStatus === constants.OK) {
      setUsers(user.data);
    }
  },
  userUpdate(user) {
    _store.userUpdateStatus = user.message;
    if(_store.userUpdateStatus === constants.OK) {
      setUsers(user.data);
    }
  },
  userDelete(user) {
    _store.userDeleteStatus = user.message
    if(_store.userDeleteStatus === constants.OK) {
      setUsers(user.data);
    }
  },
  getPermissions() {
    return _store.permissions;
  },
  resetStatus () {
    _store.userInsertStatus = null;
    _store.userUpdateStatus = null;
    _store.userDeleteStatus = null;
    _store.updateUser = false;
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

userStore.dispatchToken = AppDispatcher.register(function (payload) {
  var action = payload;
  switch (action.actionType) {
    case appConstants.USER_GETALL:
      setUsers(action.text);
      userStore.emitChange();
    break;
    case appConstants.USER_GETBYID:
      setUser(action.text);
      userStore.emitChange();
    break;
    case appConstants.USER_ACTIVEGETALL:
      setActiveUsers(action.text);
      userStore.emitChange();
    break;
    case appConstants.USER_INSERT:
      userStore.userInsert(action.text);
      userStore.emitChange();
    break;
    case appConstants.USER_UPDATE:
      userStore.userUpdate(action.text);
      userStore.emitChange();
    break;
    case appConstants.USER_DELETE:
      userStore.userDelete(action.text);
      userStore.emitChange();
    break;
    case appConstants.PERMISSIONS_GETBYID:
      setPermissions(action.text);
      userStore.emitChange();
    break;
    default:
      return true;
  }

  return true;
});

module.exports = userStore;