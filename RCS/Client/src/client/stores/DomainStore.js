import EventEmitter from 'events';
import assign from 'object-assign';
import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';

// Store
var _store = {
  domains: [],
  domain: [],
  updateDomain: false,
  domainsActive: [],
  domainInsertStatus: null,
  domainUpdateStatus: null,
  domainDeleteStatus: null
};

// Set data in the store
const setDomains = (domains) => {
  _store.domains = domains;
};

const setDomain = (domain) => {
  _store.domain = domain;
  _store.updateDomain = true;
};

const setActiveDomains = (domainsActive) => {
  _store.domainsActive = domainsActive;
};

var domainStore = assign({}, EventEmitter.prototype, {
  getDomains() {
    return _store.domains;
  },
  getDomain() {
    return _store.domain;
  },
  getDomainStatus() {
    return _store.updateDomain;
  },
  getActiveDomains() {
    return _store.domainsActive;
  },
  getDomainInsertStatus() {
    return _store.domainInsertStatus;
  },
  getDomainUpdateStatus() {
    return _store.domainUpdateStatus;
  },
  getDomainDeleteStatus() {
    return _store.domainDeleteStatus;
  },
  domainInsert(domain) {
    _store.domainInsertStatus = domain.message;
    if(_store.domainInsertStatus === constants.OK)
    {
      setDomains(domain.data);
    }
  },
  domainUpdate(domain) {
    _store.domainUpdateStatus = domain.message;
    if(_store.domainUpdateStatus === constants.OK)
    {
      setDomains(domain.data);
    }
  },
  domainDelete(domain) {
    _store.domainDeleteStatus = domain.message
    if(_store.domainDeleteStatus === constants.OK)
    {
      setDomains(domain.data);
    }
  },
  resetStatus () {
    _store.domainInsertStatus = null;
    _store.domainUpdateStatus = null;
    _store.domainDeleteStatus = null;
    _store.updateDomain = false;
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

domainStore.dispatchToken = AppDispatcher.register(function (payload) {
  var action = payload;
  switch (action.actionType) {
    case appConstants.DOMAIN_GETALL:
      setDomains(action.text);
      domainStore.emitChange();
    break;
    case appConstants.DOMAIN_GETBYID:
      setDomain(action.text);
      domainStore.emitChange();
    break;
    case appConstants.DOMAIN_ACTIVEGETALL:
      setActiveDomains(action.text);
      domainStore.emitChange();
    break;
    case appConstants.DOMAIN_INSERT:
      domainStore.domainInsert(action.text);
      domainStore.emitChange();
    break;
    case appConstants.DOMAIN_UPDATE:
      domainStore.domainUpdate(action.text);
      domainStore.emitChange();
    break;
    case appConstants.DOMAIN_DELETE:
      domainStore.domainDelete(action.text);
      domainStore.emitChange();
    break;
    default:
      return true;
  }

  return true;
});

module.exports = domainStore;