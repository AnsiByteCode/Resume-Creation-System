import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

var domainActions = {
    getAllDomains() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.DOMAIN_GETALL,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (domains) {
            AppDispatcher.dispatch({
                actionType: appConstants.DOMAIN_GETALL,
                text: domains.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getDomainById(id) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.DOMAIN_GETBYID + id,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (domain) {
            AppDispatcher.dispatch({
                actionType: appConstants.DOMAIN_GETBYID,
                text: domain.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getAllActiveDomains() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.DOMAIN_ACTIVEGETALL,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (domains) {
            AppDispatcher.dispatch({
                actionType: appConstants.DOMAIN_ACTIVEGETALL,
                text: domains.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    domainInsert(domain) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.DOMAIN_INSERT,
            data: {
                ...domain
            },
            method: 'POST',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (domain) {
            AppDispatcher.dispatch({
                actionType: appConstants.DOMAIN_INSERT,
                text: domain.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    domainUpdate(domain) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.DOMAIN_UPDATE,
            data: {
                ...domain
            },
            method: 'PUT',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (domain) {
            AppDispatcher.dispatch({
                actionType: appConstants.DOMAIN_UPDATE,
                text: domain.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    domainDelete(id) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.DOMAIN_DELETE + id,
            method: 'DELETE',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (domain) {
            AppDispatcher.dispatch({
                actionType: appConstants.DOMAIN_DELETE,
                text: domain.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    }
};

module.exports = domainActions;