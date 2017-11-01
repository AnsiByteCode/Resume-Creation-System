import EventEmitter from 'events';
import assign from 'object-assign';
import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';

// Store
var _store = {
  projects: [],
  project: [],
  updateProject: false,
  projectsActive: [],
  projectInsertStatus: null,
  projectUpdateStatus: null,
  projectDeleteStatus: null
};

// Set data in the store
const setProjects = (projects) => {
  _store.projects = projects;
};

const setProject = (project) => {
  _store.project = project;
  _store.updateProject = true;
};

const setActiveProjects = (projectsActive) => {
  _store.projectsActive = projectsActive;
};

var projectStore = assign({}, EventEmitter.prototype, {
  getProjects() {
    return _store.projects;
  },
  getProject() {
    return _store.project;
  },
  getProjectStatus() {
    return _store.updateProject;
  },
  getActiveProjects() {
    return _store.projectsActive;
  },
  getProjectInsertStatus() {
    return _store.projectInsertStatus;
  },
  getProjectUpdateStatus() {
    return _store.projectUpdateStatus;
  },
  getProjectDeleteStatus() {
    return _store.projectDeleteStatus;
  },
  projectInsert(project) {
    _store.projectInsertStatus = project.message;
    if(_store.projectInsertStatus === constants.OK)
    {
      setProjects(project.data);
    }
  },
  projectUpdate(project) {
    _store.projectUpdateStatus = project.message;
    if(_store.projectUpdateStatus === constants.OK)
    {
      setProjects(project.data);
    }
  },
  projectDelete(project) {
    _store.projectDeleteStatus = project.message
    if(_store.projectDeleteStatus === constants.OK)
    {
      setProjects(project.data);
    }
  },
  resetStatus () {
    _store.projectInsertStatus = null;
    _store.projectUpdateStatus = null;
    _store.projectDeleteStatus = null;
    _store.updateProject = false;
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

projectStore.dispatchToken = AppDispatcher.register(function (payload) {
  var action = payload;
  switch (action.actionType) {
    case appConstants.PROJECT_GETALL:
      setProjects(action.text);
      projectStore.emitChange();
    break;
    case appConstants.PROJECT_GETBYID:
      setProject(action.text);
      projectStore.emitChange();
    break;
    case appConstants.PROJECT_ACTIVEGETALL:
      setActiveProjects(action.text);
      projectStore.emitChange();
    break;
    case appConstants.PROJECT_INSERT:
      projectStore.projectInsert(action.text);
      projectStore.emitChange();
    break;
    case appConstants.PROJECT_UPDATE:
      projectStore.projectUpdate(action.text);
      projectStore.emitChange();
    break;
    case appConstants.PROJECT_DELETE:
      projectStore.projectDelete(action.text);
      projectStore.emitChange();
    break;
    default:
      return true;
  }

  return true;
});

module.exports = projectStore;