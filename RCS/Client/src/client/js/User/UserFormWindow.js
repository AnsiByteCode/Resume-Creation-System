import React from 'react';
import UserForm from './UserForm';
import constants from '../../constants/Constants';

export default class UserFormWindow extends React.Component {
  constructor() {
    super();
    this.state = { validateUser: { FirstName : false, LastName: false, ContactNumber: false, Email: false, Password: false, ConfirmPassword: false } };
    this.saveHandler = this.saveHandler.bind(this);
  }
  showInputError(refName) {
    let validity;
    validity = this.refs.form.refs[refName].validity;
    const label = document.getElementById(`${refName}Label`).textContent;
    const error = document.getElementById(`${refName}Error`);
    const isContactNumber = refName === constants.CONTACT_NUMBER;
    const isPassword = refName === constants.PASSWORD;
    const isconfirmpassword = refName === constants.CONFIRM_PASSWORD;
    const isEmailId = refName === constants.EMAIL;
    if (isconfirmpassword) {
      if (this.refs.form.refs.Password.value !== '' && this.refs.form.refs.Password.value !== this.refs.form.refs.ConfirmPassword.value) {
        this.refs.form.refs.ConfirmPassword.setCustomValidity(constants.MATCH_PASSWORD_MESSAGE);
      }
      else {
        this.refs.form.refs.ConfirmPassword.setCustomValidity('');
      }
    }

    if (!validity.valid) {
      if (validity.valueMissing) {
        error.textContent = constants.REQUIRED_MESSAGE + ` ${label}`;
      }
      else if (validity.typeMismatch) {
        error.textContent = constants.VALIDITY_MESSAGE + ` ${label}`;
      }
      else if ((isContactNumber || isEmailId) && validity.patternMismatch) {
        error.textContent = constants.VALIDITY_MESSAGE + ` ${label}`;
      }
      else if ((isPassword || isconfirmpassword) && validity.patternMismatch) {
        error.textContent = constants.PWD_LENGTH_MESSAGE
      }
      else if (isconfirmpassword && validity.customError) {
        error.textContent = constants.MATCH_PASSWORD_MESSAGE;
      }

      return false;
    }

    error.textContent = '';
    return true;
  }
  showFormErrors() {
    const inputs = document.querySelectorAll('input[name]');
    const currentState = this.state.validateUser;
    var isFormValid = false;
    inputs.forEach(input => {
      if(!this.showInputError(input.name)) {
        currentState[input.name] = true;
        isFormValid = true;
      }

      return isFormValid;
    });

    this.setState({ validateUser : currentState });
    return isFormValid;
  }
  saveHandler(e) {
    e.preventDefault();
    if (!this.showFormErrors()) {
      this.refs.form.save();
    }
  }
  render() {
    return (
      <div>
          <div aria-hidden='false' role='dialog' className='slds-modal slds-fade-in-open'>
              <div className='slds-modal__container modelWidth40'>
                  <div className='slds-modal__header'>
                      <h4 className='slds-text-heading--medium header'>{ constants.NEW_USER }</h4>
                  </div>
                  <div className='slds-modal__content'>
                      <UserForm onchangeListner={ this.props.onchangeListner } ref='form' validateUser={this.state.validateUser} onSaved={ this.props.onSaved } />
                  </div>
                  <div className='slds-modal__footer'>
                      <button className='btn btn-primary slds-button slds-button--neutral slds-button--brand' onClick={ this.saveHandler }>{ constants.SAVE }</button>
                      <button className='btn MarginLeft1Per' onClick={ this.props.onCancel }>{ constants.CANCEL }</button>
                  </div>
              </div>
          </div>
          <div className='slds-modal-backdrop slds-modal-backdrop--open'></div>
      </div>
    );
  }
}