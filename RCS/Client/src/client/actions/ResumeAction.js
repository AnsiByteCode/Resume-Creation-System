import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

var resumeActions = {
    getAllResumes() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.RESUME_GETALL,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (resumes) {
            AppDispatcher.dispatch({
                actionType: appConstants.RESUME_GETALL,
                text: resumes.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getAllResumeDetailsById(id) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.RESUME_GETALLDETAILSBYID + id,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (resume) {
          var resumeData = [];
          if(resume.data[0].CandidateId == undefined)
          {
            var candidateRecord = [];
            resumeData.push(candidateRecord);
            candidateRecord['candidates'] = resume.data[0];
          }
          else {
            resumeData = resume.data;
          }

            AppDispatcher.dispatch({
                actionType: appConstants.RESUME_GETBYID,
                text: resumeData
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getResumeById(id) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.RESUME_GETBYID + id,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (resume) {
            AppDispatcher.dispatch({
                actionType: appConstants.RESUME_GETBYID,
                text: resume.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    resumeInsert(resume) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.RESUME_INSERT,
            data: {
                ...resume
            },
            method: 'POST',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (resume) {
            AppDispatcher.dispatch({
                actionType: appConstants.RESUME_INSERT,
                text: resume.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    resumeCreation(candidateId) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        const resumeData = { CandidateId : candidateId };
        axios({
            url: appConstants.RESUMECREATION,
            data: {
              ...resumeData
            },
            method: 'POST',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (resume) {
            AppDispatcher.dispatch({
                actionType: appConstants.RESUMECREATION,
                text: resume.data
            });
              document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    resumeUpdate(resume) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.RESUME_UPDATE,
            data: {
              ...resume
            },
            method: 'PUT',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (resume) {
            AppDispatcher.dispatch({
                actionType: appConstants.RESUME_UPDATE,
                text: resume.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    resumeDelete(id) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.RESUME_DELETE + id,
            method: 'DELETE',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (resume) {
            AppDispatcher.dispatch({
                actionType: appConstants.RESUME_DELETE,
                text: resume.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    }
};

module.exports = resumeActions;