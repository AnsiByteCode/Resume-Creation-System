import EventEmitter from 'events';
import assign from 'object-assign';
import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';

// Store
var _store = {
  technologies: [],
  technology: [],
  updateTechnology: false,
  technologiesActive: [],
  technologyInsertStatus: null,
  technologyUpdateStatus: null,
  technologyDeleteStatus: null
};

// Set data in the store
const setTechnologies = (technologies) => {
  _store.technologies = technologies;
};

const setTechnology = (technology) => {
  _store.technology = technology;
  _store.updateTechnology = true;
};

const setActiveTechnologies = (technologiesActive) => {
  _store.technologiesActive = technologiesActive;
};

var technologyStore = assign({}, EventEmitter.prototype, {
  getTechnologies() {
    return _store.technologies;
  },
  getTechnology() {
    return _store.technology;
  },
  getTechnologyStatus() {
    return _store.updateTechnology;
  },
  getActiveTechnologies() {
    return _store.technologiesActive;
  },
  getTechnologyInsertStatus() {
    return _store.technologyInsertStatus;
  },
  getTechnologyUpdateStatus() {
    return _store.technologyUpdateStatus;
  },
  getTechnologyDeleteStatus() {
    return _store.technologyDeleteStatus;
  },
  technologyInsert(technology) {
    _store.technologyInsertStatus = technology.message;
    if(_store.technologyInsertStatus === constants.OK)
    {
      setTechnologies(technology.data);
    }
  },
  technologyUpdate(technology) {
    _store.technologyUpdateStatus = technology.message;
    if(_store.technologyUpdateStatus === constants.OK)
    {
      setTechnologies(technology.data);
    }
  },
  technologyDelete(technology) {
    _store.technologyDeleteStatus = technology.message
    if(_store.technologyDeleteStatus === constants.OK)
    {
      setTechnologies(technology.data);
    }
  },
  resetStatus () {
    _store.technologyInsertStatus = null;
    _store.technologyUpdateStatus = null;
    _store.technologyDeleteStatus = null;
    _store.updateTechnology = false;
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

technologyStore.dispatchToken = AppDispatcher.register(function (payload) {
  var action = payload;
  switch (action.actionType) {
    case appConstants.TECHNOLOGY_GETALL:
      setTechnologies(action.text);
      technologyStore.emitChange();
    break;
    case appConstants.TECHNOLOGY_GETBYID:
      setTechnology(action.text);
      technologyStore.emitChange();
    break;
    case appConstants.TECHNOLOGY_ACTIVEGETALL:
      setActiveTechnologies(action.text);
      technologyStore.emitChange();
    break;
    case appConstants.TECHNOLOGY_INSERT:
      technologyStore.technologyInsert(action.text);
      technologyStore.emitChange();
    break;
    case appConstants.TECHNOLOGY_UPDATE:
      technologyStore.technologyUpdate(action.text);
      technologyStore.emitChange();
    break;
    case appConstants.TECHNOLOGY_DELETE:
      technologyStore.technologyDelete(action.text);
      technologyStore.emitChange();
    break;
    default:
      return true;
  }

  return true;
});

module.exports = technologyStore;