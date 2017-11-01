import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

var frameworkActions = {
    getAllFrameworks() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.FRAMEWORK_GETALL,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (frameworks) {
            AppDispatcher.dispatch({
                actionType: appConstants.FRAMEWORK_GETALL,
                text: frameworks.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getFrameworkById(id) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.FRAMEWORK_GETBYID + id,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (framework) {
            AppDispatcher.dispatch({
                actionType: appConstants.FRAMEWORK_GETBYID,
                text: framework.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getAllActiveFrameworks() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.FRAMEWORK_ACTIVEGETALL,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (frameworks) {
            AppDispatcher.dispatch({
                actionType: appConstants.FRAMEWORK_ACTIVEGETALL,
                text: frameworks.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    frameworkInsert(framework) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.FRAMEWORK_INSERT,
            data: {
                ...framework
            },
            method: 'POST',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (framework) {
            AppDispatcher.dispatch({
                actionType: appConstants.FRAMEWORK_INSERT,
                text: framework.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    frameworkUpdate(framework) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.FRAMEWORK_UPDATE,
            data: {
                ...framework
            },
            method: 'PUT',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (framework) {
            AppDispatcher.dispatch({
                actionType: appConstants.FRAMEWORK_UPDATE,
                text: framework.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    frameworkDelete(id) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.FRAMEWORK_DELETE + id,
            method: 'DELETE',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (framework) {
            AppDispatcher.dispatch({
                actionType: appConstants.FRAMEWORK_DELETE,
                text: framework.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    }
};

module.exports = frameworkActions;