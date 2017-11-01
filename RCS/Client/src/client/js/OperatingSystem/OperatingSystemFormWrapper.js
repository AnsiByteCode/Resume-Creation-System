import React from 'react';
import OperatingSystemForm from './OperatingSystemForm';
import constants from '../../constants/Constants';

export default class OperatingSystemFormWrapper extends React.Component {
  constructor() {
    super();
    this.state = { validateOperatingSystem: { OperatingSystemName : false } };
    this.saveHandler = this.saveHandler.bind(this);
  }
  checkValidations() {
    var inputs = document.querySelectorAll('input[name]');
    const currentState = this.state.validateOperatingSystem;
    var isValid = false;
    inputs.forEach(input => {
      if(input.value === '') {
        currentState[input.name] = true;
        isValid = true;
      }

      return isValid;
    });

    this.setState({ validateOperatingSystem : currentState });
    return isValid;
  }
  saveHandler(e) {
    e.preventDefault();
    if (!this.checkValidations()) {
      this.refs.form.save();
    }
  }
  render() {
    return (
      <div>
          <div aria-hidden='false' role='dialog' className='slds-modal slds-fade-in-open'>
              <div className='slds-modal__container modelWidth35'>
                  <div className='slds-modal__header'>
                      <h4 className='slds-text-heading--medium header'>{ constants.EDIT_OPERATINGSYSTEM }</h4>
                  </div>
                  <div className='slds-modal__content'>
                      <OperatingSystemForm ref='form' operatingSystem={ this.props.operatingSystem } validateOperatingSystem={this.state.validateOperatingSystem} />
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