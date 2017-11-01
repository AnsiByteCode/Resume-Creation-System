import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

var rolePermissionActions = {
  rolePermissionInsert(roleData) {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    axios({
      url: appConstants.ROLEPERMISSION_INSERT,
      data: {
        ...roleData
      },
      method: 'POST',
      crossOrigin: true,
      headers: {
        'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
      }
    })
    .then(function (roleData) {
      AppDispatcher.dispatch({
        actionType: appConstants.ROLEPERMISSION_INSERT,
        text: roleData.data
      });

      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    });
  },
  getRolePermissionById(id) {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    axios({
      url: appConstants.ROLEPERMISSION_GETBYID + id,
      method: 'GET',
      crossOrigin: true,
      headers: {
        'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
      }
    })
    .then(function (rolePermission) {
      AppDispatcher.dispatch({
        actionType: appConstants.ROLEPERMISSION_GETBYID,
        text: rolePermission.data
      });

      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    });
  }
};

module.exports = rolePermissionActions;