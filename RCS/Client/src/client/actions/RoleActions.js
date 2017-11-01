import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

var roleActions = {
  getAllRoles() {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    axios({
      url: appConstants.ROLE_GETALL,
      method: 'GET',
      crossOrigin: true,
      headers: {
        'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
      }
    })
    .then(function (roles) {
      AppDispatcher.dispatch({
        actionType: appConstants.ROLE_GETALL,
        text: roles.data
      });

      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    });
  },
  getRoleById(id) {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    axios({
      url: appConstants.ROLE_GETBYID + id,
      method: 'GET',
      crossOrigin: true,
      headers: {
        'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
      }
    })
    .then(function (role) {
      AppDispatcher.dispatch({
        actionType: appConstants.ROLE_GETBYID,
        text: role.data
      });

      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    });
  },
  getAllActiveRoles() {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    axios({
      url: appConstants.ROLE_ACTIVEGETALL,
      method: 'GET',
      crossOrigin: true,
      headers: {
        'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
      }
    })
    .then(function (roles) {
      AppDispatcher.dispatch({
        actionType: appConstants.ROLE_ACTIVEGETALL,
        text: roles.data
      });

      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    });
  },
  roleInsert(role) {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    axios({
      url: appConstants.ROLE_INSERT,
      data: {
        ...role
      },
      method: 'POST',
      crossOrigin: true,
      headers: {
        'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
      }
    })
    .then(function (role) {
      AppDispatcher.dispatch({
        actionType: appConstants.ROLE_INSERT,
        text: role.data
      });

      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    });
  },
  roleUpdate(role) {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    axios({
      url: appConstants.ROLE_UPDATE,
      data: {
        ...role
      },
      method: 'PUT',
      crossOrigin: true,
      headers: {
        'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
      }
    })
    .then(function (role) {
      AppDispatcher.dispatch({
        actionType: appConstants.ROLE_UPDATE,
        text: role.data
      });

      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    });
  },
  roleDelete(id) {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    axios({
      url: appConstants.ROLE_DELETE + id,
      method: 'DELETE',
      crossOrigin: true,
      headers: {
        'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
      }
    })
    .then(function (role) {
      AppDispatcher.dispatch({
        actionType: appConstants.ROLE_DELETE,
        text: role.data
      });

      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    });
  }
};

module.exports = roleActions;