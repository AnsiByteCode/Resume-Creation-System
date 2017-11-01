import EventEmitter from 'events';
import assign from 'object-assign';
import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';

// Store
var _store = {
  permissionModules: []
};

// Set data in the store
const setPermissionModules = (permissionModules) => {
  _store.permissionModules = permissionModules;
};

var permissionModuleStore = assign({}, EventEmitter.prototype, {
  getPermissionModules() {
    return _store.permissionModules;
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

permissionModuleStore.dispatchToken = AppDispatcher.register(function (payload) {
  var action = payload;
  switch (action.actionType) {
    case appConstants.PERMISSIONMODULE_GETALL:
      setPermissionModules(action.text);
      permissionModuleStore.emitChange();
    break;
    default:
      return true;
  }

  return true;
});

module.exports = permissionModuleStore;