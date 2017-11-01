import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

var languageActions = {
    getAllLanguages() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.LANGUAGE_GETALL,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (languages) {
            AppDispatcher.dispatch({
                actionType: appConstants.LANGUAGE_GETALL,
                text: languages.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getLanguageById(id) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.LANGUAGE_GETBYID + id,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (language) {
            AppDispatcher.dispatch({
                actionType: appConstants.LANGUAGE_GETBYID,
                text: language.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getAllActiveLanguages() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.LANGUAGE_ACTIVEGETALL,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (languages) {
            AppDispatcher.dispatch({
                actionType: appConstants.LANGUAGE_ACTIVEGETALL,
                text: languages.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    languageInsert(language) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.LANGUAGE_INSERT,
            data: {
                ...language
            },
            method: 'POST',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (language) {
            AppDispatcher.dispatch({
                actionType: appConstants.LANGUAGE_INSERT,
                text: language.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    languageUpdate(language) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.LANGUAGE_UPDATE,
            data: {
                ...language
            },
            method: 'PUT',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (language) {
            AppDispatcher.dispatch({
                actionType: appConstants.LANGUAGE_UPDATE,
                text: language.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    languageDelete(id) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.LANGUAGE_DELETE + id,
            method: 'DELETE',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (language) {
            AppDispatcher.dispatch({
                actionType: appConstants.LANGUAGE_DELETE,
                text: language.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    }
};

module.exports = languageActions;