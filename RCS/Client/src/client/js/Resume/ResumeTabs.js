/*jshint loopfunc:true */
/* eslint max-len: 0 */
/* eslint no-console: 0 */
import React from 'react';
import { confirm } from './../components/Confirm';
import { browserHistory } from 'react-router';
import { NotificationManager } from 'react-notifications';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import constants from './../../constants/Constants';
import GeneralDetails from './GeneralDetails';
import ProjectGrid from './ProjectGrid';
import ProjectDetails from './ProjectDetails';
import resumeActions from './../../actions/ResumeAction';
import _ from 'lodash';
var controlCountProjectDetailsDiv = [];
var resumedata = [];

export default class ResumeTabs extends React.Component {
    constructor() {
        super();
        this.state = {
          IsRerender : false,
          projectDetails : [],
          roles:[],
          domain: [],
          resumeRecord : [],
          tabIndex: 0,
          selectedDomain: [],
          selectedApplication: [],
          selectedOperatingSystem: [],
          selectedTechnology: [],
          selectedFramework: [],
          selectedLanguage: [],
          selectedDatabase: [],
          roleValue : '',
          projectValue : '',
          responsibilityValue : '',
          validateProjectDetails : {
            Role : false,
            Project : false,
            Responsibilities : false
          },

          validateResume : {
            CandidateName : false,
            EducationDescription : false,
            CurrentCompanyName : false,
            ddlCurrentDesignation :false,
            KnowledgeDescription : false,
            WorkDescription : false,
            Domain : false,
            Database : false,
            Application : false,
            Framework : false,
            Technology : false,
            ProjectCount : false,
            TeamSize : false,
            Experience : false,
            CurrentDesignation : false,
            OperatingSystem : false,
            Language: false
          }
        };
        this.getDropdownValue = this.getDropdownValue.bind(this);
        this.handleNextChange = this.handleNextChange.bind(this);
        this.addProjectClick = this.addProjectClick.bind(this);
        this.saveProjectDetails = this.saveProjectDetails.bind(this);
        this.onCancelClick = this.onCancelClick.bind(this);
        this.showInputError = this.showInputError.bind(this);
        this.showSelectError = this.showSelectError.bind(this);
        this.showMultiSelectError = this.showMultiSelectError.bind(this);
        this.showFormErrors = this.showFormErrors.bind(this);
        this.saveProjectClick = this.saveProjectClick.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.textareaHandleChange = this.textareaHandleChange.bind(this);
        this.handleDesignationChange = this.handleDesignationChange.bind(this);
        this.changeRole = this.changeRole.bind(this);
        this.changeProject = this.changeProject.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onChangeMultiselect = this.onChangeMultiselect.bind(this);
        this.numericOnly = this.numericOnly.bind(this);
        this.onAfterSaveCell = this.onAfterSaveCell.bind(this);
        this.customConfirm = this.customConfirm.bind(this);
        this.onTabSelect = this.onTabSelect.bind(this);
    }
    componentDidMount() {
        resumedata = [];
        this.setState({ resume: resumedata });
    }
    componentWillReceiveProps(props) {
        if (props.resume !== undefined && props.resume.length !== 0) {
            this.setState({ selectedDomain : this.getDropdownValue(props.domains,props.resume[0].candidates.domains) });
            this.setState({ selectedDatabase : this.getDropdownValue(props.databases,props.resume[0].candidates.databases) });
            this.setState({ selectedApplication : this.getDropdownValue(props.applications,props.resume[0].candidates.applications) });
            this.setState({ selectedTechnology : this.getDropdownValue(props.technologies,props.resume[0].candidates.technologies) });
            this.setState({ selectedLanguage : this.getDropdownValue(props.languages,props.resume[0].candidates.languages) });
            this.setState({ selectedOperatingSystem : this.getDropdownValue(props.os,props.resume[0].candidates.os) });
            this.setState({ selectedFramework : this.getDropdownValue(props.frameworks,props.resume[0].candidates.frameworks) });

            if (props.resume[0].CandidateId !== undefined)
            {
                var proRecords = [];
                for(var index = 0; index < props.resume.length ; index++)
                {
                  var record =
                    {
                      ProjectName :  props.resume[index].projects.ProjectName,
                      RoleName :  props.resume[index].projectroles[0].ProjectRoleName,
                      Responsibilities :  props.resume[index].Responsibilities,
                      ProjectId :  props.resume[index].ProjectId,
                      RoleId : props.resume[index].RoleId,
                  };

                    proRecords.push(record);
                }

                this.setState({projectDetails : proRecords }, function(proRecords) {
                });
            }

            let resumeDetails = this.state.resume;
            resumeDetails['CandidateName'] = props.resume[0].candidates.CandidateName;
            resumeDetails['TeamSize'] = props.resume[0].candidates.TeamSize;
            resumeDetails['Experience'] = props.resume[0].candidates.Experience;
            resumeDetails['ProjectCount'] = props.resume[0].candidates.ProjectCount;
            resumeDetails['DesignationId'] = props.resume[0].candidates.DesignationId;
            resumeDetails['KnowledgeDescription'] = props.resume[0].candidates.KnowledgeDescription;
            resumeDetails['CurrentCompanyName'] = props.resume[0].candidates.CurrentCompanyName;
            resumeDetails['EducationDescription'] = props.resume[0].candidates.EducationDescription;
            resumeDetails['WorkDescription'] = props.resume[0].candidates.WorkDescription;
        }
    }
    getDropdownValue(propValue,stateValue) {
      var removeArray = propValue.filter(function(item)
      {
          return stateValue.map(x=>x._id).indexOf(item._id) === -1;
      });
      return propValue.filter(function(item)
      {
        return removeArray.map(x=>x._id).indexOf(item._id) === -1;
      });
    }

    handleNextChange(targetElement) {
      if(this.checkValidations())
      {
        this.setState({ tabIndex : 0 });
      }
      else {
        this.setState({ tabIndex : 1 });
      }
    }
    addProjectClick(e) {
      if (controlCountProjectDetailsDiv.length=== 0)
      {
          var count = [{id: 1,name:'Another Name'}];
          controlCountProjectDetailsDiv.push(count);
      }
        this.setState({IsRerender : 1});
    }
    saveProjectDetails(e) {
        var resumeRecord = [];
        if (this.props.resume.length=== 0) {
          resumeRecord = this.state.resume;
          resumeRecord['Projects'] = this.state.projectDetails;
          resumeActions.resumeInsert(resumeRecord);
        }
        else {
          resumeRecord = this.state.resume;
          resumeRecord['CandidateId'] = this.props.resume[0].candidates._id;
          resumeRecord['Projects'] = this.state.projectDetails;
          resumeActions.resumeUpdate(resumeRecord);
        }

        browserHistory.push('/resumes');
    }
    onCancelClick() {
      controlCountProjectDetailsDiv = [];
        browserHistory.push('/resumes');
    }
    showInputError(refName) {

        let validity;
        validity = this.refs[refName].validity;
        const label = document.getElementById(`${refName}Label`).textContent;
        const error = document.getElementById(`${refName}Error`);
        if (!validity.valid) {
        if (validity.valueMissing) {
            error.textContent = constants.REQUIRED_MESSAGE + ` ${label}`;
        }
        else if (validity.patternMismatch) {
            if (refName=== constants.TEAM_SIZE) {
                error.textContent = constants.TEAM_SIZE_MESSAGE;
            }
            else if (refName=== constants.EXPERIENCE) {
                error.textContent = constants.EXPERIENCE_MESSAGE;
            }
            else if (refName=== constants.PROJECTCOUNT) {
                error.textContent = constants.PROJECT_COUNT_MESSAGE;
            }
        }

        return false;
        }

        error.textContent = '';
        return true;
    }
    showSelectError(refName, control) {
        const label = document.getElementById(`${refName}Label`).textContent;
        const error = document.getElementById(`${refName}Error`);
        if (control.selectedOptions[0].value=== '0') {
            if (error.textContent=== '') {
                error.textContent = constants.SELECT_MESSAGE + ` ${label}`;
            }

            return false;
        }

        error.textContent = '';
        return true;
    }
    showMultiSelectError(refName, text) {
       const multiselect = document.getElementById(`${refName}`);
       const label = document.getElementById(`${refName}Label`).textContent;
       const error = document.getElementById(`${refName}Error`);
       if (text=== constants.DROPDOWN_PLACEHOLDER) {
           multiselect.classList.add('BorderRed');
           error.textContent = constants.SELECT_MESSAGE + ` ${label}`;
           return false;
       }

       multiselect.classList.remove('BorderRed');
       error.textContent = '';
       return true;
    }
    showFormErrors() {

        const inputs =  document.querySelectorAll('input[name],textarea[name]');
        const selects = document.querySelectorAll('select');

        let isFormValid = true;
        inputs.forEach(input => {

           const isInputValid = this.showInputError(input.name);
           if (!isInputValid) {

               input.classList.add('active');
              isFormValid = false;
           }
         });

         selects.forEach(select => {
             const isSelectValid = this.showSelectError(select.id, select);
             if (!isSelectValid) {
                 select.classList.add('BorderRed');
                 isFormValid = false;
             }
         });

        const multiselects = document.querySelectorAll('div[name*=dropdown]');
        multiselects.forEach(multiselect => {
            const isMultiSelectValid = this.showMultiSelectError(multiselect.id, multiselect.textContent);
            if (!isMultiSelectValid) {
                isFormValid = false;
       }
        });

        return isFormValid;
    }

    checkValidations()
    {
      var inputs = document.querySelectorAll('input[name],textarea[name]');
      var selects = document.querySelectorAll('select');
      var multiselects = document.querySelectorAll('.Dropdown-control');
      const currentState = this.state.validateResume;
       inputs.forEach(input => {
         if(input.value === '')
         {
           currentState[input.name] = true;
           this.setState({
           validateResume : currentState
         });
         }
       });

        selects.forEach(input => {
          if(input.value === '0')
          {
            currentState[input.id] = true;
            this.setState({
            validateResume : currentState
          });
          }
        });

        multiselects.forEach(input => {
          if(input.textContent === constants.DROPDOWN_PLACEHOLDER)
          {
            currentState[input.id] = true;
            this.setState({
            validateResume : currentState
          });
          }
        });
      var validateresumeDetail = this.state.validateResume;
      var isValid = false;
      Object.keys(validateresumeDetail).some(function(key) {
        if(validateresumeDetail[key] === true)
        {
          isValid = true;
          return isValid;
        }
      });

      var newstate = this.state.validateProjectDetails;
      this.setState({validateProjectDetails : newstate});
      return isValid;
    }

    checkForValidations()
    {
      var inputs = document.querySelectorAll('input[name],textarea[name]');
      var selects = document.querySelectorAll('select');
      const currentState = this.state.validateProjectDetails;
       inputs.forEach(input => {
         if(input.value === '')
         {
           currentState[input.name] = true;
         }
       });

        selects.forEach(input => {
          if(input.value === '0')
          {
            currentState[input.id] = true;
          }
        });

        this.setState({
        validateProjectDetails : currentState
      });

        var validatedetails = this.state.validateProjectDetails;
        var isValid = false;
        Object.keys(validatedetails).some(function(key) {
          if(validatedetails[key] === true)
          {
            isValid = true;
            return isValid;
          }
        });

        var newstate = this.state.validateProjectDetails;
        this.setState({validateProjectDetails : newstate});
        return isValid;
    }

    saveProjectClick(e) {
      e.preventDefault();
      if (!this.checkForValidations()) {
        let proDetails = this.state.projectDetails;
        if (proDetails.map(x=>x.ProjectId).indexOf(this.state.projectValue) !== -1)
        {
           NotificationManager.warning(constants.PROJECT_ADDED_MESSAGE, '', 3000);
        }
        else {
          let proData = {
          ProjectName:this.props.projects.filter(x=>x._id=== this.state.projectValue)[0].ProjectName,
          ProjectId:this.state.projectValue,
          RoleId:this.state.roleValue,
          RoleName:this.props.roles.filter(x=>x._id=== this.state.roleValue)[0].ProjectRoleName,
          Responsibilities : this.state.responsibilityValue
      };
          proDetails.push(proData);
          this.setState({projectDetails : proDetails});
        }
          this.setState({projectValue : '', roleValue : '', responsibilityValue : ''});
      }
      else {
      }
    }
    onBlur(e){
     e.target.classList.remove('active');
    }
    textareaHandleChange(e){
      e.target.value = e.target.value.replace(/^\s+/, '');
      const currentState = this.state.validateProjectDetails;
      if(e.target.value === '')
      {
        currentState[e.target.name] = true;
      }
      else {
          currentState[e.target.name] = false;
      }

      this.setState({
      validateProjectDetails : currentState
    });
      this.setState({responsibilityValue : e.target.value});
    }
    handleDesignationChange(e) {
      const currentState = this.state.validateResume;
        resumedata['DesignationId'] = e;
        if(e === '0')
        {
          currentState['ddlCurrentDesignation'] = true;
        }
        else {
            currentState['ddlCurrentDesignation'] = false;
        }

        this.setState({
        validateResume : currentState
        });
        this.setState({ resume : resumedata });
    }
    changeRole(e) {
      const currentState = this.state.validateProjectDetails;
      if(e === '0')
      {
        currentState['Role'] = true;
      }
      else {
          currentState['Role'] = false;
      }

      this.setState({
      validateProjectDetails : currentState
      });
      this.setState({roleValue : e});
    }
    changeProject(e) {
        const currentState = this.state.validateProjectDetails;
      if(e === '0')
      {
        currentState['Project'] = true;
      }
      else {
          currentState['Project'] = false;
      }

      this.setState({
      validateProjectDetails : currentState
      });
      this.setState({projectValue : e});
    }
    handleChange(event) {
      event.target.value = event.target.value.replace(/^\s+/, '');
      const currentState = this.state.validateResume;
      resumedata[event.target.name] = event.target.value;
      if(event.target.value=== '')
      {
        currentState[event.target.name] = true;
      }
      else {
          currentState[event.target.name] = false;
      }
      this.setState({
      validateResume : currentState
      });
      this.setState({ resume : resumedata });
    }
    onChangeMultiselect(controlName, options) {
      debugger;
      const currentState = this.state.validateResume;
      switch (controlName) {
                case constants.DOMAIN:
      this.setState({ selectedDomain : options });
        break;
                case constants.DATABASE:
        this.setState({ selectedDatabase : options });
        break;
                case constants.TECHNOLOGY:
        this.setState({ selectedTechnology : options });
          break;
                case constants.APPLICATION:
        this.setState({ selectedApplication : options });
        break;
                case constants.LANGUAGE:
        this.setState({ selectedLanguage : options });
          break;
                case constants.FRAMEWORK:
        this.setState({ selectedFramework : options });
            break;
                case constants.OPERATING_SYSTEM:
        this.setState({ selectedOperatingSystem : options });
              break;
      default:
        this.setState({ selectedDomain : options });
        break;
      }
        if(options.length === 0)
        {
            currentState[controlName] = true;
        }
        else {
          currentState[controlName] = false;
        }

         var newResume = this.state.resume;
         newResume[controlName] = options;
         this.setState({
         validateResume : currentState
         });
         this.setState({ resume: newResume });
    }

    numericOnly(e) {
        const re = /[0-9]+/g;
        if (!re.test(e.key)) {
            e.preventDefault();
        }
    }
    onAfterSaveCell(row, cellName, cellValue) {
      if(cellName=== 'RoleName')
      {
        var role = this.props.roles.filter((ex) => ex.RoleName.toString()=== row['RoleName']);
        row['RoleId'] = role[0]._id;
      }
      return true;
    }
     customConfirm(next, rowKeys) {
       let projectDetails = this.state.projectDetails;
       var self = this;
          if (rowKeys.length > 0)
          {
             confirm(constants.DELETE_CONFIRMATION).then(() => {
                     for(var index = 0; index<rowKeys.length; index++)
                     {
                       projectDetails = projectDetails.filter(x=>x.ProjectId !== rowKeys[index]);
                     }
                     self.setState({projectDetails: projectDetails},function(){
                       if(rowKeys.length !== 1)
                       {
                         NotificationManager.success(constants.DELETE_SUCCESS_MESSAGE_MULTIPLE, '', 2000);
                         rowKeys = [];
                       }
                       else
                       {
                           NotificationManager.success(constants.DELETE_SUCCESS_MESSAGE, '', 2000);
                           rowKeys = [];
                       }
                     });

                      next();
                 });
           }
    }
     onTabSelect(tabIndex) {
      this.setState({ tabIndex: tabIndex }, function() {
           if (this.state.tabIndex === 1) {
                   this.setState({ tabIndex: 0 }, function() {
                        if(this.checkValidations()){
                           this.setState({ tabIndex : 0 });
                       }
                       else {
                           this.setState({ tabIndex : 1 });
                       }
                   });
           }
       });
    }

    render() {
        const cellEditProp = {
          mode: 'click',
          blurToSave: true,
          afterSaveCell: this.onAfterSaveCell,
        }

        const selectRowProp = {
          mode: 'checkbox',
        }

        const options = {
             handleConfirmDeleteRow: this.customConfirm,
         }

        var TabHeaderText = [];
            TabHeaderText.push(<Tab key= "1"> { constants.GENERAL_DETAILS } </Tab>);
            TabHeaderText.push(<Tab key="2"> { constants.PROJECT_DETAILS } </Tab>);
        var TabContent = [];
         TabContent.push(
         <TabPanel key="1" className='slds-m-around--medium'>
         <div>
          <GeneralDetails validateResume={this.state.validateResume} resume={this.state.resume} selectedDomain={this.state.selectedDomain}
          selectedApplication={ this.state.selectedApplication } selectedDatabase={ this.state.selectedDatabase } selectedLanguage={ this.state.selectedLanguage }
           selectedFramework={ this.state.selectedFramework } selectedTechnology={ this.state.selectedTechnology }
           selectedOperatingSystem={ this.state.selectedOperatingSystem } numericOnly={this.numericOnly}
          handleChange={ this.handleChange } handleDesignationChange={ this.handleDesignationChange }  designations={ this.props.designations }
          onChangeMultiselect={ this.onChangeMultiselect }
          domains={this.props.domains} applications={ this.props.applications } os={ this.props.os } technologies={ this.props.technologies } frameworks={ this.props.frameworks }
          languages={ this.props.languages } databases={ this.props.databases }
          />
          <button className='btn floatRight' onClick={ this.onCancelClick }>{ constants.CANCEL }</button>
          <button className='btn btn-primary marginBtnCancel slds-button slds-button--neutral slds-button--brand floatRight' onClick={ this.handleNextChange}>{ constants.NEXT }</button>
          </div>
         </TabPanel>
          );
         TabContent.push(
           <TabPanel key="2" className='slds-m-around--medium'>

         <div>
             <div className='form-group col-md-12'>
             </div>
             <div className='form-group col-md-12'>
                 <div className='form-group col-md-3'>
                     <div>
                        <button onClick={ this.addProjectClick } className='btn btn-primary'>{ constants.ADD_PROJECT }</button>
                     </div>
                 </div>
                 <div className='form-group col-md-6'>
                     <div>
                        <div id='dynamicDiv'>
                         {
                             controlCountProjectDetailsDiv.map((item) => (
                              <ProjectDetails validateProjectDetails={this.state.validateProjectDetails} projects={this.props.projects} roles={this.props.roles} textareaHandleChange={this.textareaHandleChange} changeRole={ this.changeRole }  changeProject={ this.changeProject }
                              responsibilityValue={this.state.responsibilityValue}  roleValue={ this.state.roleValue }  projectValue={ this.state.projectValue } saveProjectClick={ this.saveProjectClick }/>
                             ))
                         }
                        </div>

                    </div>
                 </div>
                 <div className='form-group col-md-3'>

                 <div>

                 </div>

                 </div>
                 </div>
             </div>
             <div className='form-group col-md-12'>
             <div className='form-group col-md-3'></div>
             <div className='form-group col-md-6'>
             <ProjectGrid  projectDetails={this.state.projectDetails} selectRowProp={ selectRowProp }  options={ options } cellEdit={ cellEditProp } roles={this.props.roles} />
             </div>
             <div className='form-group col-md-3'></div>
             </div>
             <div className='form-group col-md-12'>
             <div className='form-group col-md-3'></div>
             <div className='form-group col-md-6'>
             <button className='btn marginBtn floatRight' onClick={ this.onCancelClick }>{ constants.CANCEL }</button>
             <button className='btn btn-primary slds-button slds-button--neutral slds-button--brand floatRight MarginLeft1Per' onClick={ this.saveProjectDetails }>{ constants.SAVE_PROJECT_DETAILS }</button>
             </div>
             <div className='form-group col-md-3'></div>
             </div>
             </TabPanel>
           );

    return (
            <div>
                <div>
                    <Tabs selectedIndex={ this.state.tabIndex } onSelect={ this.onTabSelect }>
                        <TabList>
                            { TabHeaderText }
                        </TabList>
                        { TabContent }
                    </Tabs>
                </div>
                <br/>
            </div>
          );
    }
}
