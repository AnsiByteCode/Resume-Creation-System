import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

var operatingSystemActions = {
    getAllOperatingSystems() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.OPERATINGSYSTEM_GETALL,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (operatingSystems) {
            AppDispatcher.dispatch({
                actionType: appConstants.OPERATINGSYSTEM_GETALL,
                text: operatingSystems.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getOperatingSystemById(id) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.OPERATINGSYSTEM_GETBYID + id,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (operatingSystem) {
            AppDispatcher.dispatch({
                actionType: appConstants.OPERATINGSYSTEM_GETBYID,
                text: operatingSystem.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getAllActiveOperatingSystems() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.OPERATINGSYSTEM_ACTIVEGETALL,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (operatingSystems) {
            AppDispatcher.dispatch({
                actionType: appConstants.OPERATINGSYSTEM_ACTIVEGETALL,
                text: operatingSystems.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    operatingSystemInsert(operatingSystem) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.OPERATINGSYSTEM_INSERT,
            data: {
                ...operatingSystem
            },
            method: 'POST',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (operatingSystem) {
            AppDispatcher.dispatch({
                actionType: appConstants.OPERATINGSYSTEM_INSERT,
                text: operatingSystem.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    operatingSystemUpdate(operatingSystem) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.OPERATINGSYSTEM_UPDATE,
            data: {
                ...operatingSystem
            },
            method: 'PUT',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (operatingSystem) {
            AppDispatcher.dispatch({
                actionType: appConstants.OPERATINGSYSTEM_UPDATE,
                text: operatingSystem.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    operatingSystemDelete(id) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.OPERATINGSYSTEM_DELETE + id,
            method: 'DELETE',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (operatingSystem) {
            AppDispatcher.dispatch({
                actionType: appConstants.OPERATINGSYSTEM_DELETE,
                text: operatingSystem.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    }
};

module.exports = operatingSystemActions;