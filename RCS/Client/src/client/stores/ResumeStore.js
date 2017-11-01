import EventEmitter from 'events';
import assign from 'object-assign';
import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';

// Store
var _store = {
    resumes: [],
    resume: [],
    resumeInsertStatus: null,
    resumeUpdateStatus: null,
    resumeDeleteStatus: null,
    resumeFileCreateStatus: null
};

// Set data in the store
const setResumes = (resumes) => {
    _store.resumes = resumes;
};

const setResume = (resume) => {
    _store.resume = resume;
};

const setResumeFileCreateStatus = (resume) => {
    _store.resumeFileCreateStatus = resume.message;
};

var resumeStore = assign({}, EventEmitter.prototype, {
    getResumes() {
        return _store.resumes;
    },
    getResume() {
        return _store.resume;
    },
    getResumeInsertStatus() {
        return _store.resumeInsertStatus;
    },
    getResumeUpdateStatus() {
        return _store.resumeUpdateStatus;
    },
    getResumeDeleteStatus() {
        return _store.resumeDeleteStatus;
    },
    resumeInsert(resume) {
        _store.resumeInsertStatus = resume.message;
        if(_store.resumeInsertStatus === constants.OK)
        {
            setResumes(resume.data);
        }
    },
    resumeUpdate(resume) {
        _store.resumeUpdateStatus = resume.message;
        if(_store.resumeUpdateStatus === constants.OK)
        {
            setResumes(resume.data);
        }
    },
    resumeDelete(resume) {
        _store.resumeDeleteStatus = resume.message
        if(_store.resumeDeleteStatus === constants.OK)
        {
            setResumes(resume.data);
        }
    },
    getResumeFileCreateStatus(resume) {
        return _store.resumeFileCreateStatus;
    },
    resetStatus () {
        _store.resumeUpdateStatus = null;
        _store.resumeInsertStatus = null;
        _store.resumeDeleteStatus = null;
        _store.resumeFileCreateStatus = null;
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

resumeStore.dispatchToken = AppDispatcher.register(function (payload) {
    var action = payload;
    switch (action.actionType) {
      case appConstants.RESUME_GETALL:
          setResumes(action.text);
          resumeStore.emitChange();
      break;
      case appConstants.RESUME_GETBYID:
          setResume(action.text);
          resumeStore.emitChange();
      break;
      case appConstants.RESUME_INSERT:
          resumeStore.resumeInsert(action.text);
          resumeStore.emitChange();
      break;
      case appConstants.RESUME_UPDATE:
          resumeStore.resumeUpdate(action.text);
          resumeStore.emitChange();
      break;
      case appConstants.RESUME_DELETE:
          resumeStore.resumeDelete(action.text);
          resumeStore.emitChange();
      break;
      case appConstants.RESUMECREATION:
          setResumeFileCreateStatus(action.text);
          resumeStore.emitChange();
      break;
      default:
          return true;
    }

    return true;
});

module.exports = resumeStore;