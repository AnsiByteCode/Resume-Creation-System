import React from 'react';
import { NotificationManager } from 'react-notifications';
import constants from '../../constants/Constants';
import Roles from './Roles';
import Users from './Users';
import './AssignRole.css';
import roleStore from '../../stores/RoleStore';
import roleActions from '../../actions/RoleActions';
import userStore from '../../stores/UserStore';
import userActions from '../../actions/UserActions';
import userRoleStore from '../../stores/UserRoleStore';
import userRoleActions from '../../actions/UserRoleActions';
var i = 0;
var selectedUserRoleData = [];

class AssignRole extends React.Component {
  constructor() {
    super();
    this.state = {
      users : [],
      roles : [],
      validateRole: { UserId : '', RoleId: '' },
      selectedUserRoles: [],
      userRole: [],
      userRoleInsertStatus: ''
    };

    this.onUserRoleChange = this.onUserRoleChange.bind(this);
    this.onRoleChange = this.onRoleChange.bind(this);
    this.onUserChange = this.onUserChange.bind(this);
    this.handleUserClick = this.handleUserClick.bind(this);
    this.handleRoleClick = this.handleRoleClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentWillMount() {
    roleActions.getAllActiveRoles();
    userActions.getAllActiveUsers();
    roleStore.addChangeListener(this.onRoleChange);
    userStore.addChangeListener(this.onUserChange);
    userRoleStore.addChangeListener(this.onUserRoleChange);
  }
  componentWillUnmount() {
    roleStore.removeChangeListener(this.onRoleChange);
    userStore.removeChangeListener(this.onUserChange);
    userRoleStore.removeChangeListener(this.onUserRoleChange);
  }
  onUserRoleChange() {
    this.setState({ userRole: userRoleStore.getUserRole() }, function() {
      this.onRoleChange();
      if(this.state.userRole.length !== 0) {
        var roles = this.state.roles;
        for(i = 0; i < roles.length; i++) {
          if (roles[i]._id === this.state.userRole[0].RoleId[0]) {
            roles[i].isSelected = true;
            selectedUserRoleData['RoleId'] = this.state.userRole[0].RoleId[0];
          }
        }

        this.setState({ roles: roles });
        this.setState({ selectedUserRoles : selectedUserRoleData });
      }
      else {
        this.onRoleChange();
      }

      this.setState({ userRoleInsertStatus: userRoleStore.getUserRoleInsertStatus() }, function() {
        if (this.state.userRoleInsertStatus === constants.OK) {
          NotificationManager.success(constants.INSERT_SUCCESS_MESSAGE, '', 2000);
          this.onRoleChange();
          this.onUserChange();
          selectedUserRoleData['UserId'] = '';
          selectedUserRoleData['RoleId'] = '';
          this.setState({ selectedUserRoles: selectedUserRoleData });
          userRoleStore.resetStatus();
        }
      });
    });
  }
  onRoleChange() {
    let roleList =  roleStore.getActiveRoles();
    roleList.map((role,index)=>(
      role["isSelected"] = false
    ));

    this.setState({roles : roleList});
  }
  onUserChange() {
    let userList = userStore.getActiveUsers();
    userList.map((user,index)=>(
      user["isSelected"] = false
    ));

    this.setState({users : userList});
  }
  handleUserClick(e) {
    var selectedUsers = this.state.users.slice();
    let selected = selectedUsers.map((user,index)=>(this.getSelectedUser(user,e)));
    for(i = 0; i < selected.length; i++) {
      if(selected[i].isSelected === true) {
        selectedUserRoleData['UserId'] = selected[i]._id;
        selectedUserRoleData['RoleId'] = '';
      }
    }

    this.setState({ selectedUserRoles : selectedUserRoleData }, function() {
      if (this.state.selectedUserRoles.UserId !== undefined || this.state.selectedUserRoles.UserId !== '') {
        userRoleActions.getUserRoleById(this.state.selectedUserRoles.UserId);
      }
    });
  }
  handleRoleClick(e) {
    var selectedRoles = this.state.roles.slice();
    let selected = selectedRoles.map((role,index)=>(this.getSelectedRole(role,e)));
    for(i = 0; i < selected.length; i++) {
      if(selected[i].isSelected === true) {
        selectedUserRoleData['RoleId'] = selected[i]._id;
      }
    }

    this.setState({roles : selected});
    this.setState({ selectedUserRoles : selectedUserRoleData });
  }
  getSelectedRole(role, roleInput) {
    if(role._id === roleInput.target.id) {
      role["isSelected"] = true;
    }
    else {
      role["isSelected"] = false;
    }

    return role;
  }
  getSelectedUser(user, userInput) {
    if(user._id === userInput.target.id) {
      user["isSelected"] = true;
    }
    else {
      user["isSelected"] = false;
    }

    return user;
  }
  checkValidations() {
    var isValid = false;
    if (this.state.selectedUserRoles.UserId === undefined && this.state.selectedUserRoles.RoleId === undefined) {
      NotificationManager.error(constants.REQUIRED_SELECT_MESSAGE, '', 2000);
      isValid = true;
    }
    else if (this.state.selectedUserRoles.UserId === undefined || this.state.selectedUserRoles.UserId === '') {
      NotificationManager.error(constants.REQUIRED_USER_MESSAGE, '', 2000);
      isValid = true;
    }
    else if (this.state.selectedUserRoles.RoleId === undefined || this.state.selectedUserRoles.RoleId === '') {
      NotificationManager.error(constants.REQUIRED_ROLE_MESSAGE, '', 2000);
      isValid = true;
    }

    return isValid;
  }
  onSubmit(e) {
    e.preventDefault();
    if (!this.checkValidations()) {
      userRoleActions.userRoleInsert(this.state.selectedUserRoles);
      userRoleStore.resetStatus();
    }
  }
  render() {
    return(
      <div className="container col-md-12 containerStyle">
        <div className="panel panel-info">
          <div className="panel-heading">Assign Roles</div>
          <div className="panel-body">
            <div className="col-md-12">
              <div className="col-md-6">
                <label className="control-label fontforlabel" htmlFor="Users">Users</label>
                <div className="well divStyle">
                  <Users users={this.state.users} onClick={(e)=>this.handleUserClick(e)}/>
                </div>
              </div>
              <div className="col-md-6">
                <label className="control-label fontforlabel" htmlFor="Groups">Roles</label>
                <div className="well wellStyle">
                  <Roles roles={this.state.roles} onRoleClick={(e)=>this.handleRoleClick(e)}/>
                </div>
              </div>
            </div>

            <div id="ActionButton" className="form-group pull-right">
              <button className='btn btn-primary marginRight' onClick={this.onSubmit}>{ constants.SAVE }</button>
              <button className='btn' onClick={() => history.go(-1)}>{ constants.CANCEL }</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AssignRole;