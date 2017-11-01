import React from 'react';
import ProjectForm from './ProjectForm';
import constants from '../../constants/Constants';

export default class ProjectFormWindow extends React.Component {
  constructor() {
    super();
    this.state = { validateProject: { ProjectName: false, TeamSize: false, Domain: false, OperatingSystem: false, Database: false, Technology: false } };
    this.saveHandler = this.saveHandler.bind(this);
  }
  saveHandler(e) {
    e.preventDefault();
    if (!this.showFormErrors()) {
      this.refs.form.save();
    }
  }
  showFormErrors() {
    const inputs = document.querySelectorAll('input[name]');
    const currentState = this.state.validateProject;
    var isFormValid = false;
    inputs.forEach(input => {
      if(!this.showInputError(input.name)) {
        currentState[input.name] = true;
        isFormValid = true;
      }

      return isFormValid;
    });

    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
      if(select.value === '0') {
        currentState[select.id] = true;
        isFormValid = true;
      }
    });

    const multiselects = document.querySelectorAll('div[name*=dropdown]');
    multiselects.forEach(multiselect => {
      if(multiselect.textContent === constants.DROPDOWN_PLACEHOLDER) {
        currentState[multiselect.id] = true;
        isFormValid = true;
      }
    });

    this.setState({ validateProject : currentState });
    return isFormValid;
  }
  showInputError(refName) {
    let validity;
    validity = this.refs.form.refs[refName].validity;
    const label = document.getElementById(`${refName}Label`).textContent;
    const error = document.getElementById(`${refName}Error`);
    if (!validity.valid) {
      if (validity.valueMissing) {
        error.textContent = constants.REQUIRED_MESSAGE + ` ${label}`;
      }
      else if (validity.patternMismatch) {
        error.textContent = constants.TEAM_SIZE_MESSAGE;
      }

      return false;
    }

    error.textContent = '';
    return true;
  }
  render() {
    return (
      <div>
          <div aria-hidden='false' role='dialog' className='slds-modal slds-fade-in-open'>
              <div className='slds-modal__container modelWidth40'>
                  <div className='slds-modal__header'>
                      <h4 className='slds-text-heading--medium header'>{ constants.NEW_PROJECT }</h4>
                  </div>
                  <div className='slds-modal__content'>
                      <ProjectForm ref='form' databasesActive={ this.props.databasesActive } domainsActive={ this.props.domainsActive } operatingSystemsActive={ this.props.operatingSystemsActive } technologiesActive={ this.props.technologiesActive } validateProject={this.state.validateProject} onchangeListner={ this.props.onchangeListner } onSaved={ this.props.onSaved } />
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