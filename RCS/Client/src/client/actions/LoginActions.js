import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

var loginActions = {
    loginUser(credentials) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.LOGIN_DETAILS,
            data: {
                ...credentials
            },
            method: 'POST',
            crossOrigin: true
        })
        .then(function (loginResponse) {
            if (loginResponse.statusText === constants.OK_STATUS)
            {
                if (loginResponse.data.message === constants.OK)
                {
                    loginResponse.data.data[0].Email = credentials.Email;
                    AppDispatcher.dispatch({
                        actionType: constants.LOGIN_SUCCESS,
                        text: loginResponse.data.data[0],
                        jwt: loginResponse.data.id_token,
                        message: loginResponse.data.message
                    });
                }
                else {
                    AppDispatcher.dispatch({
                        actionType: constants.LOGIN_ERROR,
                        text: loginResponse.data.result,
                        message: loginResponse.data.message
                    });
                }
            }

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    logOutUser() {
        AppDispatcher.dispatch({
            actionType: constants.LOGOFF_ERROR,
        });
    },
    forgotPassword(userDetails) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.FORGOT_PASSWORD,
            data: {
                ...userDetails
            },
            method: 'POST'
        })
        .then(function (loginResponse) {
            if (loginResponse.statusText === constants.OK_STATUS)
            {
                if (loginResponse.data.message === constants.OK)
                {
                    AppDispatcher.dispatch({
                        actionType: constants.FORGOTPASSWORD_SUCCESS,
                        text: loginResponse.data
                    });
                }
                else {
                    AppDispatcher.dispatch({
                        actionType: constants.FORGOTPASSWORD_ERROR,
                        text: loginResponse.data
                    });
                }
            }

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    changePassword(OldPassword, NewPassword) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        var Email = localStorage.getItem('ls_userSession');
        const userData = {
          OldPassword: OldPassword,
          NewPassword: NewPassword,
          Email: Email
        };
        axios({
            url: appConstants.CHANGE_PASSWORD,
            data: {
                ...userData
            },
            method: 'POST',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (loginResponse) {
            if (loginResponse.statusText === constants.OK_STATUS)
            {
                if (loginResponse.data.message === constants.OK)
                {
                    AppDispatcher.dispatch({
                        actionType: constants.CHANGEPASSWORD_SUCCESS,
                        text: loginResponse.data
                    });
                }
                else {
                    AppDispatcher.dispatch({
                        actionType: constants.CHANGEPASSWORD_ERROR,
                        text: loginResponse.data
                    });
                }
            }

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    }
};

module.exports = loginActions;