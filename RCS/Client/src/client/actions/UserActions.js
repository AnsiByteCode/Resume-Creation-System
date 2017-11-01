import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

var userActions = {
    getAllUsers() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.USER_GETALL,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (users) {
            AppDispatcher.dispatch({
                actionType: appConstants.USER_GETALL,
                text: users.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getUserById(userId) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.USER_GETBYID + userId,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (user) {
            AppDispatcher.dispatch({
                actionType: appConstants.USER_GETBYID,
                text: user.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getAllActiveUsers() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.USER_ACTIVEGETALL,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (users) {
            AppDispatcher.dispatch({
                actionType: appConstants.USER_ACTIVEGETALL,
                text: users.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    userInsert(user) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.USER_INSERT,
            method: 'POST',
            data: {
                ...user
            },
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (user) {
            AppDispatcher.dispatch({
                actionType: appConstants.USER_INSERT,
                text: user.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    userUpdate(user) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.USER_UPDATE,
            method: 'PUT',
            data: {
                ...user
            },
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (user) {
            AppDispatcher.dispatch({
                actionType: appConstants.USER_UPDATE,
                text: user.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    userDelete(id) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.USER_DELETE + id,
            method: 'DELETE',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (user) {
            AppDispatcher.dispatch({
                actionType: appConstants.USER_DELETE,
                text: user.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getPermissionsById(id) {
      document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
      axios({
          url: appConstants.PERMISSIONS_GETBYID + id,
          method: 'GET',
          crossOrigin: true,
          headers: {
              'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
          }
      })
      .then(function (user) {
          AppDispatcher.dispatch({
              actionType: appConstants.PERMISSIONS_GETBYID,
              text: user.data[0]
          });

          document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
      });
    }
};

module.exports = userActions;