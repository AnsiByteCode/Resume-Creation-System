import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

var userPermissionActions = {
  userPermissionInsert(userData) {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    axios({
      url: appConstants.USERPERMISSION_INSERT,
      data: {
        ...userData
      },
      method: 'POST',
      crossOrigin: true,
      headers: {
        'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
      }
    })
    .then(function (userData) {
      AppDispatcher.dispatch({
        actionType: appConstants.USERPERMISSION_INSERT,
        text: userData.data
      });

      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    });
  },
  getUserPermissionById(id) {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    axios({
      url: appConstants.USERPERMISSION_GETBYID + id,
      method: 'GET',
      crossOrigin: true,
      headers: {
        'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
      }
    })
    .then(function (userPermission) {
      AppDispatcher.dispatch({
        actionType: appConstants.USERPERMISSION_GETBYID,
        text: userPermission.data
      });

      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    });
  }
};

module.exports = userPermissionActions;