import React from 'react';
import { NotificationManager } from 'react-notifications';
import loginActions from '../../actions/LoginActions';
import loginStore from '../../stores/LoginStore';
import { browserHistory } from 'react-router';
import constants from '../../constants/Constants';
import classNames from 'classnames';
var userData = [];

export default class ForgetPassword extends React.Component {
  constructor() {
    super();
    this.state = { userRecord: [], validateUser: { Email: false } };
    this.saveHandler = this.saveHandler.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onForgotPassword = this.onForgotPassword.bind(this);
    this.showFormErrors = this.showFormErrors.bind(this);
    this.showInputError = this.showInputError.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    loginStore.addChangeListener(this.onForgotPassword);
  }
  componentWillUnmount() {
    loginStore.removeChangeListener(this.onForgotPassword);
  }
  saveHandler(e) {
    e.preventDefault();
    if (!this.showFormErrors()) {
      loginActions.forgotPassword(this.state.userRecord);
    }
  }
  onCancel() {
    browserHistory.goBack();
  }
  onForgotPassword() {
    this.setState({ ForogotPaswordStatus: loginStore.forogotPaswordConfirmation() });
    if (this.state.ForogotPaswordStatus === constants.OK) {
      browserHistory.push('/login');
      setTimeout(() => NotificationManager.success(constants.PWD_SEND_MESSAGE, '', 2000), 1000);
    }
    else {
      NotificationManager.error(constants.USER_STATUS_MESSAGE, '', 2000)
    }
  }
  showFormErrors() {
    const inputs = document.querySelectorAll('input[name]');
    const currentState = this.state.validateUser;
    var isFormValid = false;
    inputs.forEach(input => {
      if(!this.showInputError(input)) {
        currentState[input.name] = true;
        isFormValid = true;
      }

      return isFormValid;
    });

    this.setState({ validateUser : currentState });
    return isFormValid;
  }
  showInputError(e) {
    let validity, refName;    
    if(e.target === undefined) {
      refName = e.name;
    }
    else {
      refName = e.target.name;
    }

    if (e.target === undefined) {
      validity = e.validity;
    }
    else {
      validity = e.target.validity;
    }

    const label = document.getElementById(`${refName}Label`).textContent;
    const error = document.getElementById(`${refName}Error`);
    if (!validity.valid)
    {
      if (validity.valueMissing) {
        error.textContent = constants.REQUIRED_MESSAGE + ` ${label}`;
      }
      else if (validity.typeMismatch) {
        error.textContent = constants.VALIDITY_MESSAGE + ` ${label}`;
      }

      return false;
    }

    error.textContent = '';
    return true;
  }
  handleChange(e) {
    const currentState = this.state.validateUser;
    userData[e.target.name] = e.target.value;
    if(!this.showInputError(e)) {
      currentState[e.target.name] = true;
    }
    else {
      currentState[e.target.name] = false;
    }

    this.setState({ validateUser : currentState });
    this.setState({userRecord : userData});
  }
  render() {
    return (
      <div className='login'>
          <hgroup>
              <h2>{ constants.FORGOTPASSWORD }</h2>
          </hgroup>
          <form id={constants.LBL_FORGOTPASSWORDFORM}>
              <div className='form-group'>
                  <label id={constants.EMAIL_LABEL} className='control-label'>{ constants.EMAIL }</label>
              </div>
              <div className='groupLoginForm'>
                  <input className={classNames({'form-control': true, 'BorderRed': this.state.validateUser.Email})} type='email' name={ constants.EMAIL } ref={ constants.EMAIL } value={ this.state.userRecord.Email ? this.state.userRecord.Email : '' } onChange={ this.handleChange } autoFocus required />
                  <div className={classNames({'error': this.state.validateUser.Email, 'displayNone': !this.state.validateUser.Email})} id={ constants.EMAIL_ERROR }></div>
              </div>
              <button className='twoButton button btn-primary' onClick={ this.saveHandler }>{ constants.SUBMIT }</button>
              <button className='twoButton2 marginLeft8P' onClick={ this.onCancel }>{ constants.CANCEL }</button>
          </form>
      </div>
    );
  }
}