import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

var projectActions = {
    getAllProjects() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.PROJECT_GETALL,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (projects) {
            AppDispatcher.dispatch({
                actionType: appConstants.PROJECT_GETALL,
                text: projects.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getProjectById(id) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.PROJECT_GETBYID + id,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (project) {
            AppDispatcher.dispatch({
                actionType: appConstants.PROJECT_GETBYID,
                text: project.data[0]
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getAllActiveProjects() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.PROJECT_ACTIVEGETALL,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (projects) {
            AppDispatcher.dispatch({
                actionType: appConstants.PROJECT_ACTIVEGETALL,
                text: projects.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    projectInsert(project) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.PROJECT_INSERT,
            data: {
                ...project
            },
            method: 'POST',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (project) {
            AppDispatcher.dispatch({
                actionType: appConstants.PROJECT_INSERT,
                text: project.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    projectUpdate(project) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.PROJECT_UPDATE,
            data: {
                ...project
            },
            method: 'PUT',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (project) {
            AppDispatcher.dispatch({
                actionType: appConstants.PROJECT_UPDATE,
                text: project.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    projectDelete(id) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.PROJECT_DELETE + id,
            method: 'DELETE',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (project) {
            AppDispatcher.dispatch({
                actionType: appConstants.PROJECT_DELETE,
                text: project.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    }
};

module.exports = projectActions;