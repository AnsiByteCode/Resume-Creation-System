import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

var projectRoleActions = {
    getAllProjectRoles() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.PROJECTROLE_GETALL,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (projectRoles) {
            AppDispatcher.dispatch({
                actionType: appConstants.PROJECTROLE_GETALL,
                text: projectRoles.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getProjectRoleById(id) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.PROJECTROLE_GETBYID + id,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (projectRole) {
            AppDispatcher.dispatch({
                actionType: appConstants.PROJECTROLE_GETBYID,
                text: projectRole.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getAllActiveProjectRoles() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.PROJECTROLE_ACTIVEGETALL,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (projectRoles) {
            AppDispatcher.dispatch({
                actionType: appConstants.PROJECTROLE_ACTIVEGETALL,
                text: projectRoles.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    projectRoleInsert(projectRole) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.PROJECTROLE_INSERT,
            data: {
                ...projectRole
            },
            method: 'POST',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (projectRole) {
            AppDispatcher.dispatch({
                actionType: appConstants.PROJECTROLE_INSERT,
                text: projectRole.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    projectRoleUpdate(projectRole) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.PROJECTROLE_UPDATE,
            data: {
                ...projectRole
            },
            method: 'PUT',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (projectRole) {
            AppDispatcher.dispatch({
                actionType: appConstants.PROJECTROLE_UPDATE,
                text: projectRole.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    projectRoleDelete(id) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.PROJECTROLE_DELETE + id,
            method: 'DELETE',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (projectRole) {
            AppDispatcher.dispatch({
                actionType: appConstants.PROJECTROLE_DELETE,
                text: projectRole.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    }
};

module.exports = projectRoleActions;