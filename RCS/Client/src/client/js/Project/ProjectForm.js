import React from 'react';
import Dropdown from 'react-dropdown-multiselect';
import Ddl from'../components/Ddl';
import projectActions from '../../actions/ProjectActions';
import constants from '../../constants/Constants';
import classNames from 'classnames';
var projectData = [];
let checkbox;
import _ from 'lodash';

export default class ProjectForm extends React.Component {
  constructor() {
    super();
    this.state = { project: [], selectedDomain: [], selectedDatabase: [], selectedOperatingSystem: [], selectedTechnology: [] };
    this.getDropdownValue = this.getDropdownValue.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.save = this.save.bind(this);
    this.onChangeMultiselect = this.onChangeMultiselect.bind(this);
    this.onChangeDomain = this.onChangeDomain.bind(this);
    this.onChangeDatabase = this.onChangeDatabase.bind(this);
    this.onChangeOperatingSystem = this.onChangeOperatingSystem.bind(this);
    this.changeIsActive = this.changeIsActive.bind(this);
    this.numericOnly = this.numericOnly.bind(this);
  }
  componentDidMount() {
    projectData = [];
    projectData['IsActive'] = true;
    this.setState({ project: projectData });
  }
  componentWillReceiveProps(props) {
    if (props.project !== undefined && props.project !== this.state.project && props.project.length !== 0) {
      this.setState({ selectedTechnology : this.getDropdownValue(props.technologiesActive, props.project.technologies) });
      this.setState({ project: props.project }, function() {
        projectData = this.state.project;
      });
    }
  }
  getDropdownValue(propValue, stateValue) {
    var removeArray = propValue.filter(function(item) {
      return stateValue.map(x=>x._id).indexOf(item._id) === -1;
    });

    return propValue.filter(function(item) {
      return removeArray.map(x=>x._id).indexOf(item._id) === -1;
    });
  }
  showInputError(e) {
    let validity;
    let refName = e.target.name;
    validity = e.target.validity;
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
  handleChange(e) {
    e.target.value = e.target.value.replace(/^\s+/, '');
    const currentState = this.props.validateProject;
    projectData[e.target.name] = e.target.value;
    if(!this.showInputError(e)) {
      currentState[e.target.name] = true;
    }
    else {
      currentState[e.target.name] = false;
    }

    this.setState({ validateProject : currentState });
    this.setState({ project : projectData });
  }
  save() {
    if (this.state.project._id) {
      projectActions.projectUpdate(this.state.project);
      if (this.props.onSaved) {
        this.props.onSaved();
      }
    }
    else {
      projectActions.projectInsert(this.state.project);
    }
  }
  onChangeMultiselect(controlName, options) {
    const currentState = this.props.validateProject;
    switch (controlName) {
      case constants.TECHNOLOGY:
        this.setState({ selectedTechnology : options });
      break;
      default:
        this.setState({ selectedTechnology : options });
      break;
    }

    if(options.length === 0)
    {
      currentState[controlName] = true;
    }
    else {
      currentState[controlName] = false;
    }

    var projectData = this.state.project;
    projectData[controlName] = options;
    this.setState({ project: projectData });
  }
  onChangeDomain(e) {
    const currentState = this.props.validateProject;
    if(e === '0') {
      currentState['Domain'] = true;
    }
    else {
      currentState['Domain'] = false;
    }

    projectData['DomainId'] = e;
    this.setState({ project : projectData });
  }
  onChangeDatabase(e) {
    const currentState = this.props.validateProject;
    if(e === '0') {
      currentState['Database'] = true;
    }
    else {
      currentState['Database'] = false;
    }

    projectData['DatabaseId'] = e;
    this.setState({ project : projectData });
  }
  onChangeOperatingSystem(e) {
    const currentState = this.props.validateProject;
    if(e === '0') {
      currentState['OperatingSystem'] = true;
    }
    else {
      currentState['OperatingSystem'] = false;
    }

    projectData['OperatingSystemId'] = e;
    this.setState({ project : projectData });
  }
  changeIsActive(e) {
    projectData['IsActive'] = e.target.checked;
    this.setState({ project : projectData });
  }
  numericOnly(e) {
    const re = /[0-9]+/g;
    if (!re.test(e.key)) {
      e.preventDefault();
    }
  }
  render() {
    if (this.props.project !== undefined && this.props.project.length !== 0) {
      checkbox = (<input type='checkbox' checked={ this.props.project.IsActive } onChange={ this.changeIsActive } />)
    }
    else {
      if (this.state.project !== undefined) {
        if (this.state.project.IsActive === true) {
          checkbox = (<input type='checkbox' checked={ true } onChange={ this.changeIsActive } />)
        }
        else {
          checkbox = (<input type='checkbox' checked={ false }  onChange={ this.changeIsActive } />)
        }
      }
    }
    return (
      <div className='form-group col-md-12'>
          <div className='col-md-3'>
              <label id={ constants.PROJECTNAME_LABEL } className='control-label'>{ constants.PROJECT }</label>
          </div>
          <div className='col-md-9 form-group'>
              <input className={classNames({'form-control': true, 'BorderRed': this.props.validateProject.ProjectName})} type='text' name={ constants.PROJECTNAME } ref={ constants.PROJECTNAME } value={ this.state.project.ProjectName } onChange={ this.handleChange } autoFocus required />
              <div className={classNames({'error': this.props.validateProject.ProjectName, 'displayNone': !this.props.validateProject.ProjectName})} id={ constants.PROJECTNAME_ERROR }></div>
          </div>

          <div className='col-md-3'>
              <label id={ constants.TEAMSIZE_LABEL } className='control-label'>{ constants.TEAMSIZE }</label>
          </div>
          <div className='col-md-9 form-group'>
              <input className={classNames({'form-control': true, 'BorderRed': this.props.validateProject.TeamSize})} type='text' name={ constants.TEAM_SIZE } ref={ constants.TEAM_SIZE } pattern='(99)|(0*\d{1,2})' onKeyPress={ (e) => this.numericOnly(e) } value={ this.state.project.TeamSize } onChange={ this.handleChange } required />
              <div className={classNames({'error': this.props.validateProject.TeamSize, 'displayNone': !this.props.validateProject.TeamSize})} id={ constants.TEAMSIZE_ERROR }></div>
          </div>

          <div className='col-md-3'>
              <label id={ constants.DESIGNATIONNAME_LABEL } className='control-label'>{ constants.DESCRIPTION }</label>
          </div>
          <div className='col-md-9 form-group'>
              <textarea className='form-control resizeNone' rows='2' name={ constants.DESCRIPTION } ref={ constants.DESCRIPTION } onChange={ this.handleChange } value={ this.state.project.Description } />
              <div className='error' id={ constants.DESIGNATIONNAME_ERROR } />
          </div>

          <div className='col-md-3'>
              <label id={ constants.OTHERTOOLS_LABEL } className='control-label'>{ constants.OTHERTOOLS }</label>
          </div>
          <div className='col-md-9 form-group'>
              <textarea className='form-control resizeNone' rows='2' name={ constants.OTHER_TOOLS } ref={ constants.OTHER_TOOLS } onChange={ this.handleChange } value={ this.state.project.OtherTools } />
              <div className='error' id={ constants.OTHERTOOLS_ERROR } />
          </div>

          <div className='col-md-3'>
              <label id={ constants.DOMAIN_LABEL } className='control-label'>{ constants.DOMAIN }</label>
          </div>
          <div className='col-md-9 form-group'>
              <Ddl id={ constants.DOMAIN } className={classNames({'form-control':true, 'BorderRed': this.props.validateProject.Domain})} name={ constants.DDL_DOMAIN } options={ this.props.domainsActive } value={ this.state.project.DomainId } onValueChange={ this.onChangeDomain } valueField='_id' labelField='DomainName' />
              <div className={classNames({'error': this.props.validateProject.Domain, 'displayNone': !this.props.validateProject.Domain})} id={ constants.DOMAIN_ERROR }>{ constants.SELECT_MESSAGE +' '+ constants.DOMAIN }</div>
          </div>

          <div className='col-md-3'>
              <label id={ constants.OPERATINGSYSTEM_LABEL } className='control-label'>{ constants.OPERATINGSYSTEM }</label>
          </div>
          <div className='col-md-9 form-group'>
              <Ddl id={ constants.OPERATING_SYSTEM } className={classNames({'form-control':true, 'BorderRed': this.props.validateProject.OperatingSystem})} name={ constants.DDL_OPERATINGSYSTEM } options={ this.props.operatingSystemsActive } value={ this.state.project.OperatingSystemId } onValueChange={ this.onChangeOperatingSystem } valueField='_id' labelField='OperatingSystemName' />
              <div className={classNames({'error': this.props.validateProject.OperatingSystem, 'displayNone': !this.props.validateProject.OperatingSystem})} id={ constants.OPERATINGSYSTEM_ERROR }>{ constants.SELECT_MESSAGE +' '+ constants.OPERATINGSYSTEM }</div>
          </div>

          <div className='col-md-3'>
              <label id={ constants.DATABASE_LABEL } className='control-label'>{ constants.DATABASE }</label>
          </div>
          <div className='col-md-9 form-group'>
              <Ddl id={ constants.DATABASE } className={classNames({'form-control':true, 'BorderRed': this.props.validateProject.Database})} name={ constants.DDL_DATABASE } options={ this.props.databasesActive } value={ this.state.project.DatabaseId } onValueChange={ this.onChangeDatabase } valueField='_id' labelField='DatabaseName' />
              <div className={classNames({'error': this.props.validateProject.Database, 'displayNone': !this.props.validateProject.Database})} id={ constants.DATABASE_ERROR }>{ constants.SELECT_MESSAGE +' '+ constants.DATABASE }</div>
          </div>

          <div className='col-md-3'>
              <label id={ constants.TECHNOLOGY_LABEL } className='control-label'>{ constants.TECHNOLOGY }</label>
          </div>
          <div className='col-md-9 form-group'>
              <Dropdown id={ constants.TECHNOLOGY } name={ constants.DDL_TECHNOLOGY } className={classNames({'BorderRed': this.props.validateProject.Technology})} options={ this.props.technologiesActive } onChange={ this.onChangeMultiselect.bind(this, 'Technology') } value={ this.state.selectedTechnology } valueField='_id' labelField='TechnologyName' placeholder={ constants.DROPDOWN_PLACEHOLDER } />
              <div className={classNames({'error': this.props.validateProject.Technology,'displayNone': !this.props.validateProject.Technology})} id={ constants.TECHNOLOGY_ERROR } >{ constants.SELECT_MESSAGE +' '+ constants.TECHNOLOGY }</div>
          </div>

          <div className='col-md-3'>
              <label id={ constants.STATUS_LABEL } className='control-label'>{ constants.STATUS }</label>
          </div>
          <div className='col-md-9 form-group'>
              { checkbox }
          </div>
      </div>
    );
  }
}