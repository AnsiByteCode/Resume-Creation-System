import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

var databaseActions = {
    getAllDatabases() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.DATABASE_GETALL,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (databases) {
            AppDispatcher.dispatch({
                actionType: appConstants.DATABASE_GETALL,
                text: databases.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getDatabaseById(id) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.DATABASE_GETBYID + id,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (database) {
            AppDispatcher.dispatch({
                actionType: appConstants.DATABASE_GETBYID,
                text: database.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getAllActiveDatabases() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.DATABASE_ACTIVEGETALL,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (databases) {
            AppDispatcher.dispatch({
                actionType: appConstants.DATABASE_ACTIVEGETALL,
                text: databases.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    databaseInsert(database) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.DATABASE_INSERT,
            data: {
                ...database
            },
            method: 'POST',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (database) {
            AppDispatcher.dispatch({
                actionType: appConstants.DATABASE_INSERT,
                text: database.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    databaseUpdate(database) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.DATABASE_UPDATE,
            data: {
              ...database
            },
            method: 'PUT',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (database) {
            AppDispatcher.dispatch({
                actionType: appConstants.DATABASE_UPDATE,
                text: database.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    databaseDelete(id) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.DATABASE_DELETE + id,
            method: 'DELETE',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (database) {
            AppDispatcher.dispatch({
                actionType: appConstants.DATABASE_DELETE,
                text: database.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    }
};

module.exports = databaseActions;