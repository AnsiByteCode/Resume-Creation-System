import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

var userRoleActions = {
  userRoleInsert(userRoleData) {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    axios({
      url: appConstants.USERROLE_INSERT,
      data: {
        ...userRoleData
      },
      method: 'POST',
      crossOrigin: true,
      headers: {
        'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
      }
    })
    .then(function (userRoleData) {
      AppDispatcher.dispatch({
        actionType: appConstants.USERROLE_INSERT,
        text: userRoleData.data
      });

      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    });
  },
  getUserRoleById(id) {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    axios({
      url: appConstants.USERROLE_GETBYID + id,
      method: 'GET',
      crossOrigin: true,
      headers: {
        'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
      }
    })
    .then(function (userRole) {
      AppDispatcher.dispatch({
        actionType: appConstants.USERROLE_GETBYID,
        text: userRole.data
      });

      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    });
  }
};

module.exports = userRoleActions;