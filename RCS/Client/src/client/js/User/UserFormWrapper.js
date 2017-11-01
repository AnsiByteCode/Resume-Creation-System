import React from 'react';
import UserForm from './UserForm';
import constants from '../../constants/Constants';

export default class UserFormWrapper extends React.Component {
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
    const isConfirmPassword = refName === constants.CONFIRM_PASSWORD;
    const isEmail = refName === constants.EMAIL;
    if (isConfirmPassword) {
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
      else if ((isEmail || isContactNumber || isPassword || isConfirmPassword) && validity.patternMismatch) {
        error.textContent = constants.VALIDITY_MESSAGE + ` ${label}`;
      }
      else if (isConfirmPassword && validity.customError) {
        error.textContent = constants.MATCH_PASSWORD_MESSAGE;
      }

      return false;
    }

    error.textContent = '';
    return true;
  }
  showFormErrors() {
    const inputs = document.querySelectorAll('input[name]:not(.password)');
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
                      <h4 className='slds-text-heading--medium header'>{ constants.EDIT_USER }</h4>
                  </div>
                  <div className='slds-modal__content'>
                      <UserForm ref='form' user={ this.props.user } validateUser={this.state.validateUser}  />
                  </div>
                  <div className='slds-modal__footer'>
                      <button className='btn btn-primary slds-button slds-button--neutral slds-button--brand' onClick={ this.saveHandler }>{ constants.UPDATE }</button>
                      <button className='btn MarginLeft1Per' onClick={ this.props.onCancel }>{ constants.CANCEL }</button>
                  </div>
              </div>
          </div>
          <div className='slds-modal-backdrop slds-modal-backdrop--open'></div>
      </div>
    );
  }
}