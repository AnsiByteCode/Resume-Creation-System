import React from 'react';
import LanguageForm from './LanguageForm';
import constants from '../../constants/Constants';

export default class LanguageFormWrapper extends React.Component {
  constructor() {
    super();
    this.state = { validateLanguage: { LanguageName : false } };
    this.saveHandler = this.saveHandler.bind(this);
  }
  checkValidations() {
    var inputs = document.querySelectorAll('input[name]');
    const currentState = this.state.validateLanguage;
    var isValid = false;
    inputs.forEach(input => {
      if(input.value === '') {
        currentState[input.name] = true;
        isValid = true;
      }

      return isValid;
    });

    this.setState({ validateLanguage : currentState });
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
              <div className='slds-modal__container'>
                  <div className='slds-modal__header'>
                      <h4 className='slds-text-heading--medium header'>{ constants.EDIT_LANGUAGE }</h4>
                  </div>
                  <div className='slds-modal__content'>
                      <LanguageForm ref='form' language={ this.props.language } validateLanguage={this.state.validateLanguage} />
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