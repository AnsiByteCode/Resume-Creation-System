import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

var designationActions = {
    getAllDesignations() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.DESIGNATION_GETALL,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (designations) {
            AppDispatcher.dispatch({
                actionType: appConstants.DESIGNATION_GETALL,
                text: designations.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getDesignationById(id) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.DESIGNATION_GETBYID + id,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (designation) {
            AppDispatcher.dispatch({
                actionType: appConstants.DESIGNATION_GETBYID,
                text: designation.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getAllActiveDesignations() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.DESIGNATION_ACTIVEGETALL,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (designations) {
            AppDispatcher.dispatch({
                actionType: appConstants.DESIGNATION_ACTIVEGETALL,
                text: designations.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    designationInsert(designation) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.DESIGNATION_INSERT,
            data: {
                ...designation
            },
            method: 'POST',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (designation) {
            AppDispatcher.dispatch({
                actionType: appConstants.DESIGNATION_INSERT,
                text: designation.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    designationUpdate(designation) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.DESIGNATION_UPDATE,
            data: {
                ...designation
            },
            method: 'PUT',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (designation) {
            AppDispatcher.dispatch({
                actionType: appConstants.DESIGNATION_UPDATE,
                text: designation.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    designationDelete(id) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.DESIGNATION_DELETE + id,
            method: 'DELETE',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (designation) {
            AppDispatcher.dispatch({
                actionType: appConstants.DESIGNATION_DELETE,
                text: designation.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    }
};

module.exports = designationActions;