import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

var applicationActions = {
    getAllApplications() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.APPLICATION_GETALL,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (applications) {
            AppDispatcher.dispatch({
                actionType: appConstants.APPLICATION_GETALL,
                text: applications.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getApplicationById(id) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.APPLICATION_GETBYID + id,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (application) {
            AppDispatcher.dispatch({
                actionType: appConstants.APPLICATION_GETBYID,
                text: application.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getAllActiveApplications() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.APPLICATION_ACTIVEGETALL,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (applications) {
            AppDispatcher.dispatch({
                actionType: appConstants.APPLICATION_ACTIVEGETALL,
                text: applications.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    applicationInsert(application) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.APPLICATION_INSERT,
            data: {
                ...application
            },
            method: 'POST',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (application) {
            AppDispatcher.dispatch({
                actionType: appConstants.APPLICATION_INSERT,
                text: application.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    applicationUpdate(application) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.APPLICATION_UPDATE,
            data: {
              ...application
            },
            method: 'PUT',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (application) {
            AppDispatcher.dispatch({
                actionType: appConstants.APPLICATION_UPDATE,
                text: application.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    applicationDelete(id) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.APPLICATION_DELETE + id,
            method: 'DELETE',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (application) {
            AppDispatcher.dispatch({
                actionType: appConstants.APPLICATION_DELETE,
                text: application.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    }
};

module.exports = applicationActions;