import React from 'react';
import { HomeHeader } from '../components/PageHeader';
import RoleFormWindow from './RoleFormWindow';
import RoleFormWrapper from './RoleFormWrapper';
import RoleList from './RoleList';
import { NotificationManager } from 'react-notifications';
import roleStore from '../../stores/RoleStore';
import roleActions from '../../actions/RoleActions';
import constants from '../../constants/Constants';

export default class RoleHome extends React.Component {
  constructor() {
    super();
    this.state = { roles: [], roleList: [], role: [], addingRole: false, updateRole: false };
    this.newHandler = this.newHandler.bind(this);
    this.onRoleStoreChange = this.onRoleStoreChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
  }
  componentWillMount() {
    roleStore.addChangeListener(this.onChange);
    roleStore.addChangeListener(this.onRoleStoreChange);
    roleActions.getAllRoles();
  }
  componentWillUnmount() {
    roleStore.removeChangeListener(this.onChange);
    roleStore.removeChangeListener(this.onRoleStoreChange);
  }
  newHandler() {
    this.setState({ addingRole: true });
  }
  onRoleStoreChange() {
    this.setState({ roles: roleStore.getRoles() });
    this.setState({ role: roleStore.getRole() }, function() {
      this.setState({ updateRole: roleStore.getRoleStatus() });
    });

    var roleList = this.state.roles;
    for (var i = 0; i < roleList.length; i++) {
      if (roleList[i].IsActive === true || roleList[i].IsActive === constants.LBL_ACTIVE) {
        roleList[i].IsActive = constants.LBL_ACTIVE;
      }
      else {
        roleList[i].IsActive = constants.LBL_INACTIVE;
      }
    }

    this.setState({ roleList: roleList });
  }
  onChange() {
    if (this.state.addingRole) {
      this.setState({ addingRole: false });
      this.setState({ roleInsertStatus : roleStore.getRoleInsertStatus() }, function() {
        if (this.state.roleInsertStatus === constants.CONFLICT) {
          NotificationManager.error(constants.ROLE_EXIST, '', 2000);
          roleStore.resetStatus();
        }
        else if (this.state.roleInsertStatus === constants.OK) {
          NotificationManager.success(constants.INSERT_SUCCESS_MESSAGE, '', 2000);
          roleStore.resetStatus();
        }
      });
    }

    if (this.state.updateRole) {
      this.setState({ updateRole: false });
      this.setState({ roleUpdateStatus: roleStore.getRoleUpdateStatus() }, function() {
        if (this.state.roleUpdateStatus === constants.CONFLICT) {
          NotificationManager.error(constants.ROLE_EXIST, '', 2000);
          roleStore.resetStatus();
        }
        else if (this.state.roleUpdateStatus === constants.OK) {
          NotificationManager.success(constants.UPDATE_SUCCESS_MESSAGE, '', 2000);
          roleStore.resetStatus();
        }
      });
    }
  }
  cancelHandler() {
    this.setState({ addingRole: false, updateRole: false });
  }
  render() {
    return (
      <div>
          <HomeHeader newLabel={ constants.NEW_ROLE }
                      actions={[{ value: constants.LBL_NEW, label: constants.NEW_ROLE }]}
                      itemCount={ this.state.roles.length }
                      views={[{ id: 1, name: constants.ROLE_LIST }]}
                      viewId={ constants.LBL_ONE }
                      onNew={ this.newHandler } />
          <RoleList roles={ this.state.roleList } />
          { this.state.addingRole ? <RoleFormWindow onCancel={ this.cancelHandler } /> : null }
          { this.state.updateRole ? <RoleFormWrapper role={ this.state.role } onCancel={ this.cancelHandler } /> : null }
      </div>
    );
  }
}