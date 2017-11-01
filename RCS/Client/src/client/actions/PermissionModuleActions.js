import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

var permissionModuleActions = {
    getAllPermissionModules() {
      document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
      axios({
        url: appConstants.PERMISSIONMODULE_GETALL,
        method: 'GET',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(function (permissionModules) {
        AppDispatcher.dispatch({
          actionType: appConstants.PERMISSIONMODULE_GETALL,
          text: permissionModules.data
        });

        document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
      });
    }
};

module.exports = permissionModuleActions;