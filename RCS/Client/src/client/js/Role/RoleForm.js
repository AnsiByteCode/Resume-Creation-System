import React from 'react';
import roleActions from '../../actions/RoleActions';
import constants from '../../constants/Constants';
import classNames from 'classnames';
var roleData = [];
let checkbox;

export default class RoleForm extends React.Component {
  constructor() {
    super();
    this.state = { role: [] };
    this.handleChange = this.handleChange.bind(this);
    this.save = this.save.bind(this);
    this.changeIsActive = this.changeIsActive.bind(this);
  }
  componentWillMount() {
    roleData = [];
    roleData['IsActive'] = true;
    this.setState({ role: roleData });
  }
  componentWillReceiveProps(props) {
    if (props.role !== undefined && props.role !== this.state.role && props.role.length !== 0) {
      this.setState({ role: props.role }, function() {
        roleData = this.state.role;
      });
    }
  }
  handleChange(e) {
    e.target.value = e.target.value.replace(/^\s+/, '');
    const currentState = this.props.validateRole;
    roleData[e.target.name] = e.target.value;
    if(e.target.value === '') {
      currentState[e.target.name] = true;
    }
    else {
      currentState[e.target.name] = false;
    }

    this.setState({ validateRole : currentState });
    this.setState({ role : roleData });
  }
  save() {
    if (this.state.role._id) {
      roleActions.roleUpdate(this.state.role);
      if (this.props.onSaved) {
        this.props.onSaved();
      }
    }
    else {
      roleActions.roleInsert(this.state.role);
    }
  }
  changeIsActive(e) {
    roleData['IsActive'] = e.target.checked;
    this.setState({ role : roleData });
  }
  render() {
    if (this.props.role !== undefined && this.props.role.length !== 0) {
      checkbox = (<input type='checkbox' checked={ this.props.role.IsActive } onChange={ this.changeIsActive } />)
    }
    else {
      if (this.state.role !== undefined) {
        if (this.state.role.IsActive === true) {
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
              <label id={ constants.ROLENAME_LABEL } className='control-label'>{ constants.ROLE }</label>
          </div>
          <div className='col-md-9 form-group'>
              <input className={classNames({'form-control': true, 'BorderRed': this.props.validateRole.RoleName})} type='text' name={ constants.ROLENAME } ref={ constants.ROLENAME } value={ this.state.role.RoleName ? this.state.role.RoleName : '' } onChange={ this.handleChange } autoFocus required />
              <div className={classNames({'error': this.props.validateRole.RoleName, 'displayNone': !this.props.validateRole.RoleName})} id={ constants.ROLENAME_ERROR }>{ constants.REQUIRED_MESSAGE +' '+ constants.ROLE }</div>
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