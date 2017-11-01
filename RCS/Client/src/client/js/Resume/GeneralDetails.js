import React , { Component }  from 'react';
import constants from './../../constants/Constants';
// import Dropdown from 'react-dropdown-multiselect';
import Dropdown from './../components/react-dropdown-multiselect';
import appconstants from './../../constants/AppConstants';
import Ddl from'./../components/Ddl';
import classNames from 'classnames';

  class GeneralDetails extends Component {
    render(){
      debugger;
    return (

      <div className='col-md-12'>
          <div className='col-md-6'>
              <div className='col-md-3'>
                  <label id={ constants.CANDIDATENAME_LABEL } className='control-label'>{ appconstants.CANDIDATE_NAME }</label>
              </div>
              <div className='col-md-9 form-group'>
                  <input className={classNames({'form-control': true,'active': this.props.validateResume.CandidateName})} type='text' name={ constants.CANDIDATENAME } value={ this.props.resume!== undefined ? this.props.resume.CandidateName : '' } onChange={ this.props.handleChange } autoFocus required />
                  <div className={classNames({'error' : this.props.validateResume.CandidateName,'displayNone' : !this.props.validateResume.CandidateName})} id={ constants.CANDIDATENAME_ERROR }>{ constants.REQUIRED_MESSAGE +' '+ appconstants.CANDIDATE_NAME }</div>
              </div>

              <div className='col-md-3'>
                  <label id={ constants.EDUCATIONDESCRIPTION_LABEL } className='control-label'>{ appconstants.EDUCATION_DESCRIPTION }</label>
              </div>
              <div className='col-md-9 form-group'>
                 <textarea className={classNames({'form-control': true,'resizeNone':true,'active': this.props.validateResume.EducationDescription})} rows='2' name={ constants.EDUCATIONDESCRIPTION } ref={ constants.EDUCATIONDESCRIPTION } onChange={ this.props.handleChange } value={this.props.resume!==undefined ? this.props.resume.EducationDescription : ''} required />
                 <div className='colorGreen'>{ constants.SENTENCE_NOTE }</div>
                 <div className={classNames({'error' : this.props.validateResume.EducationDescription,'displayNone' : !this.props.validateResume.EducationDescription})} id={ constants.EDUCATIONDESCRIPTION_ERROR } >{ constants.REQUIRED_MESSAGE +' '+ appconstants.KNOWLEDGE_DESCRIPTION }</div>
              </div>

              <div className='col-md-3'>
                  <label id={ constants.CURRENT_COMPANYNAME_LABEL } className='control-label'>{ appconstants.CURRENT_COMPANY_NAME }</label>
              </div>
              <div className='col-md-9 form-group'>
                  <input className={classNames({'form-control': true,'active': this.props.validateResume.CurrentCompanyName})} type='text' name={ constants.CURRENT_COMPANYNAME } ref={ constants.CURRENT_COMPANYNAME } value={ this.props.resume!==undefined ? this.props.resume.CurrentCompanyName : '' }  onChange={ this.props.handleChange } required />
                  <div className={classNames({'error' : this.props.validateResume.CurrentCompanyName,'displayNone' : !this.props.validateResume.CurrentCompanyName})} id='CurrentCompanyNameError' >{ constants.REQUIRED_MESSAGE +' '+ appconstants.CURRENT_COMPANY_NAME }</div>
              </div>

              <div className='col-md-3'>
                  <label id={ constants.DDL_CURRENTDESIGNATION_LABEL } className='control-label'>{ appconstants.CURRENT_DESIGNATION }</label>
              </div>
              <div className='col-md-9 form-group'>
                   <Ddl className={classNames({ 'form-control':true,'BorderRed': this.props.validateResume.ddlCurrentDesignation})} id={ constants.DDL_CURRENTDESIGNATION } options={ this.props.designations !== undefined ? this.props.designations : [] } onValueChange={ this.props.handleDesignationChange } value={ this.props.resume !== undefined ? this.props.resume.DesignationId : '' } labelField='DesignationName' valueField='_id' />
                   <div className={classNames({'error' : this.props.validateResume.ddlCurrentDesignation,'displayNone' : !this.props.validateResume.ddlCurrentDesignation})} id={ constants.DDL_CURRENTDESIGNATION_ERROR } >{ constants.REQUIRED_MESSAGE +' '+ appconstants.CURRENT_DESIGNATION }</div>
              </div>

              <div className='col-md-3'>
                  <label id={ constants.EXPERIENCE_LABEL } className='control-label'>{ constants.EXPERIENCE_YEARS }</label>
              </div>
              <div className='col-md-9 form-group'>
                  <input className={classNames({'form-control': true,'active': this.props.validateResume.Experience})} type='text' name={ constants.EXPERIENCE } ref={ constants.EXPERIENCE } pattern='(99)|(0*\d{1,2})' onKeyPress={ (e) => this.props.numericOnly(e) } value={ this.props.resume!== undefined ? this.props.resume.Experience : '' } onChange={ this.props.handleChange } required />
                  <div className={classNames({'error' : this.props.validateResume.Experience,'displayNone' : !this.props.validateResume.Experience})} id={ constants.EXPERIENCE_ERROR } >{ constants.REQUIRED_MESSAGE +' '+ constants.EXPERIENCE_YEARS }</div>
              </div>

              <div className='col-md-3'>
                  <label id={ constants.TEAMSIZE_LABEL } className='control-label'>{ appconstants.TEAM_SIZE }</label>
              </div>
              <div className='col-md-9 form-group'>
                  <input className={classNames({'form-control': true,'active': this.props.validateResume.TeamSize})} type='text' name={ constants.TEAM_SIZE } ref={ constants.TEAM_SIZE } pattern='(99)|(0*\d{1,2})' onKeyPress={ (e) => this.props.numericOnly(e) } value={ this.props.resume!== undefined ? this.props.resume.TeamSize : '' } onChange={ this.props.handleChange } required />
                  <div className={classNames({'error' : this.props.validateResume.TeamSize,'displayNone' : !this.props.validateResume.TeamSize})} id={ constants.TEAMSIZE_ERROR } > { constants.REQUIRED_MESSAGE +' '+ appconstants.TEAM_SIZE }</div>
              </div>

              <div className='col-md-3'>
                  <label id={ constants.PROJECTCOUNT_LABEL } className='control-label'>{ appconstants.PROJECT_COUNT }</label>
              </div>
              <div className='col-md-9 form-group'>
                  <input className={classNames({'form-control': true,'active': this.props.validateResume.ProjectCount})} type='text' name={ constants.PROJECTCOUNT } ref={ constants.PROJECTCOUNT } pattern='(99)|(0*\d{1,2})' onKeyPress={ (e) => this.props.numericOnly(e) } value={ this.props.resume!== undefined ? this.props.resume.ProjectCount : '' } onChange={ this.props.handleChange } required />
                  <div className={classNames({'error' : this.props.validateResume.ProjectCount,'displayNone' : !this.props.validateResume.ProjectCount})} id={ constants.PROJECTCOUNT_ERROR } >{ constants.REQUIRED_MESSAGE +' '+ appconstants.PROJECT_COUNT }</div>
              </div>

              <div className='col-md-3'>
                  <label id={ constants.KNOWLEDGEDESCRIPTION_LABEL } className='control-label'>{ appconstants.KNOWLEDGE_DESCRIPTION }</label>
              </div>
              <div className='col-md-9 form-group'>
                  <textarea className={classNames({'form-control': true,'resizeNone':true,'active': this.props.validateResume.KnowledgeDescription})} rows='2' name={ constants.KNOWLEDGEDESCRIPTION }  ref={ constants.KNOWLEDGEDESCRIPTION }  value={this.props.resume!== undefined ? this.props.resume.KnowledgeDescription : ''}  onChange={this.props.handleChange} required />
                  <div  className='colorGreen'>{ constants.SENTENCE_NOTE }</div>
                  <div className={classNames({'error' : this.props.validateResume.KnowledgeDescription,'displayNone' : !this.props.validateResume.KnowledgeDescription})} id={ constants.KNOWLEDGEDESCRIPTION_ERROR } >{ constants.REQUIRED_MESSAGE +' '+ appconstants.KNOWLEDGE_DESCRIPTION }</div>
              </div>
         </div>
         <div className='col-md-6'>
            <div className='col-md-3'>
                <label id={ constants.WORKDESCRIPTION_LABEL } className='control-label'>{ appconstants.WORK_DESCRIPTION }</label>
            </div>
            <div className='col-md-9 form-group'>
                <textarea className={classNames({'form-control': true,'resizeNone':true,'active': this.props.validateResume.WorkDescription})} rows='2' name={ constants.WORKDESCRIPTION } ref={ constants.WORKDESCRIPTION } value={this.props.resume!== undefined ? this.props.resume.WorkDescription : ''} onChange={this.props.handleChange} required />
                <div  className='colorGreen'>{constants.SENTENCE_NOTE}</div>
                <div className={classNames({'error' : this.props.validateResume.WorkDescription,'displayNone' : !this.props.validateResume.WorkDescription})} id={ constants.WORKDESCRIPTION_ERROR } >{ constants.REQUIRED_MESSAGE +' '+ appconstants.WORK_DESCRIPTION }</div>
            </div>

            <div className='col-md-3'>
                <label id={ constants.DOMAIN_LABEL } className='control-label'>{ appconstants.DOMAIN }</label>
            </div>
            <div className='col-md-9 form-group'>
                <Dropdown className={classNames({'BorderRed': this.props.validateResume.Domain})} id={ constants.DOMAIN } name={ constants.DROPDOWN_DOMAIN } options={ this.props.domains } labelField='DomainName' valueField='_id' value={ this.props.selectedDomain } onChange={ this.props.onChangeMultiselect.bind(this, 'Domain') } placeholder={ constants.DROPDOWN_PLACEHOLDER } />
                <div className={classNames({'error' : this.props.validateResume.Domain,'displayNone' : !this.props.validateResume.Domain})} id='DomainError' >{ constants.REQUIRED_MESSAGE +' '+ appconstants.APPLICATION }</div>
            </div>

            <div className='col-md-3'>
                <label id={ constants.APPLICATION_LABEL } className='control-label'>{ appconstants.APPLICATION }</label>
            </div>
            <div className='col-md-9 form-group'>
                <Dropdown className={classNames({'BorderRed': this.props.validateResume.Application})} id={ constants.APPLICATION } name={ constants.DROPDOWN_APPLICATION } options={ this.props.applications !== undefined ? this.props.applications : [] } labelField='ApplicationName' valueField='_id' value={ this.props.selectedApplication } onChange={ this.props.onChangeMultiselect.bind(this, 'Application') } placeholder={ constants.DROPDOWN_PLACEHOLDER } />
                <div className={classNames({'error' : this.props.validateResume.Application,'displayNone' : !this.props.validateResume.Application})} id={ constants.APPLICATION_ERROR } >{ constants.REQUIRED_MESSAGE +' '+ appconstants.APPLICATION }</div>
            </div>

            <div className='col-md-3'>
                <label id={ constants.OPERATINGSYSTEM_LABEL } className='control-label'>{ appconstants.OS }</label>
            </div>
            <div className='col-md-9 form-group'>
                <Dropdown className={classNames({'BorderRed': this.props.validateResume.OperatingSystem})} id={ constants.OPERATING_SYSTEM } name={ constants.DROPDOWN_OPERATINGSYSTEM } options={ this.props.os } onChange={ this.props.onChangeMultiselect.bind(this, 'OperatingSystem') } labelField='OperatingSystemName' valueField='_id' value={this.props.selectedOperatingSystem } placeholder={ constants.DROPDOWN_PLACEHOLDER } />
                <div className={classNames({'error' : this.props.validateResume.OperatingSystem,'displayNone' : !this.props.validateResume.OperatingSystem})} id={ constants.OPERATINGSYSTEM_ERROR } >{ constants.REQUIRED_MESSAGE +' '+ appconstants.OS }</div>
            </div>

            <div className='col-md-3'>
                <label id={ constants.TECHNOLOGY_LABEL } className='control-label'>{ appconstants.TECHNOLOGY }</label>
            </div>
            <div className='col-md-9 form-group'>
                <Dropdown  className={classNames({'BorderRed': this.props.validateResume.Technology})} id={ constants.TECHNOLOGY } name={ constants.DDL_TECHNOLOGY } options={ this.props.technologies } labelField='TechnologyName' valueField='_id' value={ this.props.selectedTechnology } onChange={ this.props.onChangeMultiselect.bind(this, 'Technology') } placeholder={ constants.DROPDOWN_PLACEHOLDER } />
                <div className={classNames({'error' : this.props.validateResume.Technology,'displayNone' : !this.props.validateResume.Technology})} id={ constants.TECHNOLOGY_ERROR } >{ constants.REQUIRED_MESSAGE +' '+ appconstants.TECHNOLOGY }</div>
            </div>

            <div className='col-md-3'>
                <label id={ constants.FRAMEWORK_LABEL } className='control-label'>{ appconstants.FRAMEWORK }</label>
            </div>
            <div className='col-md-9 form-group'>
                <Dropdown className={classNames({'BorderRed': this.props.validateResume.Framework})}  id={ constants.FRAMEWORK } name={ constants.DROPDOWN_FRAMEWORK } options={ this.props.frameworks } onChange={ this.props.onChangeMultiselect.bind(this, 'Framework') } value={ this.props.selectedFramework } labelField='FrameworkName' valueField='_id' placeholder={ constants.DROPDOWN_PLACEHOLDER } />
                <div className={classNames({'error' : this.props.validateResume.Framework,'displayNone' : !this.props.validateResume.Framework})} id={ constants.FRAMEWORK_ERROR } >{ constants.REQUIRED_MESSAGE +' '+ appconstants.FRAMEWORK }</div>
            </div>

            <div className='col-md-3'>
                <label id={ constants.LANGUAGE_LABEL } className='control-label'>{ appconstants.LANGUAGE }</label>
            </div>
            <div className='col-md-9 form-group'>
                <Dropdown className={classNames({'BorderRed': this.props.validateResume.Language})} id={ constants.LANGUAGE } name={ constants.DROPDOWN_LANGUAGE } options={ this.props.languages } labelField='LanguageName' valueField='_id' value={ this.props.selectedLanguage } onChange={ this.props.onChangeMultiselect.bind(this, 'Language') } placeholder={ constants.DROPDOWN_PLACEHOLDER } />
                <div className={classNames({'error' : this.props.validateResume.Language,'displayNone' : !this.props.validateResume.Language})} id={ constants.LANGUAGE_ERROR } > { constants.REQUIRED_MESSAGE +' '+ appconstants.LANGUAGE }</div>
            </div>

            <div className='col-md-3'>
                <label id={ constants.DATABASE_LABEL } className='control-label'>{ appconstants.DATABASE }</label>
            </div>
            <div className='col-md-9 form-group'>
                <Dropdown className={classNames({'BorderRed': this.props.validateResume.Database})}  id={ constants.DATABASE } name={ constants.DROPDOWN_DATABASE } options={ this.props.databases } labelField='DatabaseName' valueField='_id' value={ this.props.selectedDatabase } onChange={ this.props.onChangeMultiselect.bind(this, 'Database') } placeholder={ constants.DROPDOWN_PLACEHOLDER } />
                <div className={classNames({'error' : this.props.validateResume.Database,'displayNone' : !this.props.validateResume.Database})} id={ constants.DATABASE_ERROR } >{ constants.REQUIRED_MESSAGE +' '+ appconstants.DATABASE }</div>
            </div>
         </div>
      </div>



    );
  }
};

 export default GeneralDetails;
