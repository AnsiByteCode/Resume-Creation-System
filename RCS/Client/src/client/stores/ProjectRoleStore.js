import EventEmitter from 'events';
import assign from 'object-assign';
import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';

// Store
var _store = {
  projectRoles: [],
  projectRole: [],
  updateProjectRole: false,
  projectRolesActive: [],
  projectRoleInsertStatus: null,
  projectRoleUpdateStatus: null,
  projectRoleDeleteStatus: null
};

// Set data in the store
const setProjectRoles = (projectRoles) => {
  _store.projectRoles = projectRoles;
};

const setProjectRole = (projectRole) => {
  _store.projectRole = projectRole;
  _store.updateProjectRole = true;
};

const setActiveProjectRoles = (projectRolesActive) => {
  _store.projectRolesActive = projectRolesActive;
};

var projectRoleStore = assign({}, EventEmitter.prototype, {
  getProjectRoles() {
    return _store.projectRoles;
  },
  getProjectRole() {
    return _store.projectRole;
  },
  getProjectRoleStatus() {
    return _store.updateProjectRole;
  },
  getActiveProjectRoles() {
    return _store.projectRolesActive;
  },
  getProjectRoleInsertStatus() {
    return _store.projectRoleInsertStatus;
  },
  getProjectRoleUpdateStatus() {
    return _store.projectRoleUpdateStatus;
  },
  getProjectRoleDeleteStatus() {
    return _store.projectRoleDeleteStatus;
  },
  projectRoleInsert(projectRole) {
    _store.projectRoleInsertStatus = projectRole.message;
    if(_store.projectRoleInsertStatus === constants.OK)
    {
      setProjectRoles(projectRole.data);
    }
  },
  projectRoleUpdate(projectRole) {
    _store.projectRoleUpdateStatus = projectRole.message;
    if(_store.projectRoleUpdateStatus === constants.OK)
    {
      setProjectRoles(projectRole.data);
    }
  },
  projectRoleDelete(projectRole) {
    _store.projectRoleDeleteStatus = projectRole.message
    if(_store.projectRoleDeleteStatus === constants.OK)
    {
      setProjectRoles(projectRole.data);
    }
  },
  resetStatus () {
    _store.projectRoleInsertStatus = null;
    _store.projectRoleUpdateStatus = null;
    _store.projectRoleDeleteStatus = null;
    _store.updateProjectRole = false;
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

projectRoleStore.dispatchToken = AppDispatcher.register(function (payload) {
  var action = payload;
  switch (action.actionType) {
    case appConstants.PROJECTROLE_GETALL:
      setProjectRoles(action.text);
      projectRoleStore.emitChange();
    break;
    case appConstants.PROJECTROLE_GETBYID:
      setProjectRole(action.text);
      projectRoleStore.emitChange();
    break;
    case appConstants.PROJECTROLE_ACTIVEGETALL:
      setActiveProjectRoles(action.text);
      projectRoleStore.emitChange();
    break;
    case appConstants.PROJECTROLE_INSERT:
      projectRoleStore.projectRoleInsert(action.text);
      projectRoleStore.emitChange();
    break;
    case appConstants.PROJECTROLE_UPDATE:
      projectRoleStore.projectRoleUpdate(action.text);
      projectRoleStore.emitChange();
    break;
    case appConstants.PROJECTROLE_DELETE:
      projectRoleStore.projectRoleDelete(action.text);
      projectRoleStore.emitChange();
    break;
    default:
      return true;
  }

  return true;
});

module.exports = projectRoleStore;