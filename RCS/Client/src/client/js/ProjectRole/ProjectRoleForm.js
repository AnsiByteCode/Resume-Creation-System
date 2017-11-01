import React from 'react';
import projectRoleActions from '../../actions/ProjectRoleActions';
import constants from '../../constants/Constants';
import classNames from 'classnames';
var projectRoleData = [];
let checkbox;

export default class ProjectRoleForm extends React.Component {
  constructor() {
    super();
    this.state = { projectRole: [] };
    this.handleChange = this.handleChange.bind(this);
    this.save = this.save.bind(this);
    this.changeIsActive = this.changeIsActive.bind(this);
  }
  componentWillMount() {
    projectRoleData = [];
    projectRoleData['IsActive'] = true;
    this.setState({ projectRole: projectRoleData });
  }
  componentWillReceiveProps(props) {
    if (props.projectRole !== undefined && props.projectRole !== this.state.projectRole && props.projectRole.length !== 0) {
      this.setState({ projectRole: props.projectRole }, function() {
        projectRoleData = this.state.projectRole;
      });
    }
  }
  handleChange(e) {
    e.target.value = e.target.value.replace(/^\s+/, '');
    const currentState = this.props.validateProjectRole;
    projectRoleData[e.target.name] = e.target.value;
    if(e.target.value === '') {
      currentState[e.target.name] = true;
    }
    else {
      currentState[e.target.name] = false;
    }

    this.setState({ validateProjectRole : currentState });
    this.setState({ projectRole : projectRoleData });
  }
  save() {
    if (this.state.projectRole._id) {
      projectRoleActions.projectRoleUpdate(this.state.projectRole);
      if (this.props.onSaved) {
        this.props.onSaved();
      }
    }
    else {
      projectRoleActions.projectRoleInsert(this.state.projectRole);
    }
  }
  changeIsActive(e) {
    projectRoleData['IsActive'] = e.target.checked;
    this.setState({ projectRole : projectRoleData });
  }
  render() {
    if (this.props.projectRole !== undefined && this.props.projectRole.length !== 0) {
      checkbox = (<input type='checkbox' checked={ this.props.projectRole.IsActive } onChange={ this.changeIsActive } />)
    }
    else {
      if (this.state.projectRole !== undefined) {
        if (this.state.projectRole.IsActive === true) {
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
              <label id={ constants.PROEJECTROLENAME_LABEL } className='control-label'>{ constants.ROLE }</label>
          </div>
          <div className='col-md-9 form-group'>
              <input className={classNames({'form-control': true, 'BorderRed': this.props.validateProjectRole.ProjectRoleName})} type='text' name={ constants.PROEJECTROLENAME } ref={ constants.PROEJECTROLENAME } value={ this.state.projectRole.ProjectRoleName ? this.state.projectRole.ProjectRoleName : '' } onChange={ this.handleChange } autoFocus required />
              <div className={classNames({'error': this.props.validateProjectRole.ProjectRoleName, 'displayNone': !this.props.validateProjectRole.ProjectRoleName})} id={ constants.PROEJECTROLENAME_ERROR }>{ constants.REQUIRED_MESSAGE +' '+ constants.ROLE }</div>
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