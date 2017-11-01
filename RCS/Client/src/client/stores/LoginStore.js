import EventEmitter from 'events';
import assign from 'object-assign';
import AppDispatcher from '../dispatcher/AppDispatcher';
var constants = require('../constants/Constants');

// Store
var _store = {
  changePasswordStatus: [],
  forgotPasswordStatus: []
};

// Set data in the store
const setChangePasswordStatus = (changePasswordStatus) => {
  _store.changePasswordStatus = changePasswordStatus;
};

const setforgotPasswordStatus = (forgotPasswordStatus) => {
  _store.forgotPasswordStatus = forgotPasswordStatus;
};

var loginStore = assign({}, EventEmitter.prototype, {
  constructor() {
    this._loginStatus = null;
    this._jwt = null;
  },
  getUserData() {
    return _store.userData;
  },
  loginConfirmation() {
    return this._loginStatus;
  },
  jwt() {
    return this._jwt;
  },
  changePaswordConfirmation() {
    return _store.changePasswordStatus;
  },
  forogotPaswordConfirmation() {
    return _store.forgotPasswordStatus;
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

loginStore.dispatchToken = AppDispatcher.register(function (payload) {
  var action = payload;
  switch (action.actionType) {
    case constants.LOGIN_SUCCESS:
      loginStore._loginStatus = action.message;
      localStorage.setItem('ls_userSession', action.text.Email);
      localStorage.setItem('ls_userId', action.text._id);
      localStorage.setItem('ls_userName', action.text.FullName);
      localStorage.setItem('userData', JSON.stringify(action.text));
      this._error = null;
      this._jwt = action.jwt;
      localStorage.setItem('jwt', action.jwt);
      _store.userData = action.text;
      loginStore.emitChange();
    break;
    case constants.LOGIN_ERROR:
      loginStore._loginStatus = action.message;
      loginStore.emitChange();
    break;
    case constants.LOGOFF_ERROR:
      loginStore._loginStatus = null;
      localStorage.removeItem('ls_userSession');
      localStorage.removeItem('ls_userName');
      localStorage.removeItem('ls_userId');
      localStorage.removeItem('userData');
      this._error = null;
      this._jwt = null;
      _store.userData = [];
      localStorage.removeItem('jwt');
      loginStore.emitChange();
    break;
    case constants.CHANGEPASSWORD_SUCCESS:
      setChangePasswordStatus(action.text.message);
      loginStore.emitChange();
    break;
    case constants.CHANGEPASSWORD_ERROR:
      setChangePasswordStatus(action.text.message);
      loginStore.emitChange();
    break;
    case constants.FORGOTPASSWORD_SUCCESS:
      setforgotPasswordStatus(action.text.message);
      loginStore.emitChange();
    break;
    case constants.FORGOTPASSWORD_ERROR:
      setforgotPasswordStatus(action.text.message);
      loginStore.emitChange();
    break;
    default:
      return true;
  }

  return true;
});

module.exports = loginStore;