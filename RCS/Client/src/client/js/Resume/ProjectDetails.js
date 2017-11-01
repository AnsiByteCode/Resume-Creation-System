import React from 'react';
import constants from './../../constants/Constants';
import Ddl from'./../components/Ddl';
import appconstants from './../../constants/AppConstants';
import classNames from 'classnames';

const ProjectDetails = (props) => {
    return (
      <div id='SampleComponent'>
          <div className='formDiv'>
              <div className='form-group col-md-12'>
                  <div className='col-md-4'>
                      <label id={ constants.PROJECT_LABEL } className='control-label'>{ appconstants.PROJECT }</label>
                  </div>
                  <div className='col-md-8 form-group'>
                      <Ddl className={classNames({ 'form-control':true,'BorderRed': props.validateProjectDetails.Project})} id={ constants.PROJECT } options={ props.projects } value={ props.projectValue } onValueChange={ props.changeProject } labelField='ProjectName' valueField='_id' />
                      <div className={classNames({'error' : props.validateProjectDetails.Project,'displayNone' : !props.validateProjectDetails.Project})} id={ constants.PROJECT_ERROR }>{ constants.REQUIRED_MESSAGE +' '+ appconstants.PROJECT }</div>
                  </div>
                  <div className='col-md-4'>
                      <label id={ constants.ROLE_LABEL } className='control-label'>{ appconstants.ROLE }</label>
                  </div>
                  <div className='col-md-8 form-group'>
                      <Ddl className={classNames({ 'form-control':true,'BorderRed': props.validateProjectDetails.Role})} id={ constants.ROLE }  options={ props.roles } value={ props.roleValue } onValueChange={ props.changeRole } labelField='ProjectRoleName' valueField='_id' />
                      <div className={classNames({'error' : props.validateProjectDetails.Role,'displayNone' : !props.validateProjectDetails.Role})} id={ constants.ROLE_ERROR } >{ constants.REQUIRED_MESSAGE +' '+ appconstants.ROLE }</div>
                  </div>
                  <div className='col-md-4'>
                      <label id={ constants.RESPONSIBILITIES_LABEL } className='control-label'>{ appconstants.RESPONSIBILITIES }</label>
                  </div>
                  <div className='col-md-8 form-group'>
                       <textarea  className={classNames({'form-control': true,'resizeNone':true,'active': props.validateProjectDetails.Responsibilities})} rows='2' value={props.responsibilityValue}  onChange={props.textareaHandleChange} name='Responsibilities'  required />
                      <div  className='colorGreen'>{constants.SENTENCE_NOTE}</div>
                      <div className={classNames({'error' : props.validateProjectDetails.Responsibilities,'displayNone' : !props.validateProjectDetails.Responsibilities})} id='ResponsibilitiesError'>{ constants.REQUIRED_MESSAGE +' '+ appconstants.RESPONSIBILITIES }</div>
                  </div>
              </div>
              <div className='form-group col-md-12'>
                  <div className='col-md-4'>
                      <label id={ constants.ROLE_LABEL } className='control-label'>{ }</label>
                  </div>
                  <div className='col-md-8 form-group'>
                     <button onClick={ props.saveProjectClick.bind(props)} className='btn btn-primary'>{ constants.SAVE_PROJECT }</button>
                  </div>
              </div>
               </div>
      </div>
    );
};

export default ProjectDetails;