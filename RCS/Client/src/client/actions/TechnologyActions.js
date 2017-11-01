import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

var technologyActions = {
    getAllTechnologies() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.TECHNOLOGY_GETALL,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (technologies) {
            AppDispatcher.dispatch({
                actionType: appConstants.TECHNOLOGY_GETALL,
                text: technologies.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getTechnologyById(id) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.TECHNOLOGY_GETBYID + id,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (technology) {
            AppDispatcher.dispatch({
                actionType: appConstants.TECHNOLOGY_GETBYID,
                text: technology.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getAllActiveTechnologies() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.TECHNOLOGY_ACTIVEGETALL,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (technologies) {
            AppDispatcher.dispatch({
                actionType: appConstants.TECHNOLOGY_ACTIVEGETALL,
                text: technologies.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    technologyInsert(technology) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.TECHNOLOGY_INSERT,
            data: {
                ...technology
            },
            method: 'POST',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (technology) {
            AppDispatcher.dispatch({
                actionType: appConstants.TECHNOLOGY_INSERT,
                text: technology.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    technologyUpdate(technology) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.TECHNOLOGY_UPDATE,
            data: {
                ...technology
            },
            method: 'PUT',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (technology) {
            AppDispatcher.dispatch({
                actionType: appConstants.TECHNOLOGY_UPDATE,
                text: technology.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    technologyDelete(id) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.TECHNOLOGY_DELETE + id,
            method: 'DELETE',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (technology) {
            AppDispatcher.dispatch({
                actionType: appConstants.TECHNOLOGY_DELETE,
                text: technology.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    }
};

module.exports = technologyActions;