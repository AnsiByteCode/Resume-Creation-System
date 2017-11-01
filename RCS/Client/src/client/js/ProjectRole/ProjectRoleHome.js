import React from 'react';
import { HomeHeader } from '../components/PageHeader';
import ProjectRoleFormWindow from './ProjectRoleFormWindow';
import ProjectRoleFormWrapper from './ProjectRoleFormWrapper';
import ProjectRoleList from './ProjectRoleList';
import { NotificationManager } from 'react-notifications';
import projectRoleStore from '../../stores/ProjectRoleStore';
import projectRoleActions from '../../actions/ProjectRoleActions';
import constants from '../../constants/Constants';

export default class ProjectRoleHome extends React.Component {
  constructor() {
    super();
    this.state = { projectRoles: [], projectRoleList: [], projectRole: [], addingProjectRole: false, updateProjectRole: false };
    this.newHandler = this.newHandler.bind(this);
    this.onProjectRoleStoreChange = this.onProjectRoleStoreChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
  }
  componentDidMount() {
    projectRoleStore.addChangeListener(this.onChange);
    projectRoleStore.addChangeListener(this.onProjectRoleStoreChange);
    projectRoleActions.getAllProjectRoles();
  }
  componentWillUnmount() {
    projectRoleStore.removeChangeListener(this.onChange);
    projectRoleStore.removeChangeListener(this.onProjectRoleStoreChange);
  }
  newHandler() {
    this.setState({ addingProjectRole: true });
  }
  onProjectRoleStoreChange() {
    this.setState({ projectRoles: projectRoleStore.getProjectRoles() });
    this.setState({ projectRole: projectRoleStore.getProjectRole() }, function() {
      this.setState({ updateProjectRole: projectRoleStore.getProjectRoleStatus() });
    });

    var projectRoleList = this.state.projectRoles;
    for (var i = 0; i < projectRoleList.length; i++) {
      if (projectRoleList[i].IsActive === true || projectRoleList[i].IsActive === constants.LBL_ACTIVE) {
        projectRoleList[i].IsActive = constants.LBL_ACTIVE;
      }
      else {
        projectRoleList[i].IsActive = constants.LBL_INACTIVE;
      }
    }

    this.setState({ projectRoleList: projectRoleList });
  }
  onChange() {
    if (this.state.addingProjectRole) {
      this.setState({ addingProjectRole: false });
      this.setState({ projectRoleInsertStatus : projectRoleStore.getProjectRoleInsertStatus() }, function() {
        if (this.state.projectRoleInsertStatus === constants.CONFLICT) {
          NotificationManager.error(constants.ROLE_EXIST, '', 2000);
          projectRoleStore.resetStatus();
        }
        else if (this.state.projectRoleInsertStatus === constants.OK) {
          NotificationManager.success(constants.INSERT_SUCCESS_MESSAGE, '', 2000);
          projectRoleStore.resetStatus();
        }
      });
    }

    if (this.state.updateProjectRole) {
      this.setState({ updateProjectRole: false });
      this.setState({ projectRoleUpdateStatus: projectRoleStore.getProjectRoleUpdateStatus() }, function() {
        if (this.state.projectRoleUpdateStatus === constants.CONFLICT) {
          NotificationManager.error(constants.ROLE_EXIST, '', 2000);
          projectRoleStore.resetStatus();
        }
        else if (this.state.projectRoleUpdateStatus === constants.OK) {
          NotificationManager.success(constants.UPDATE_SUCCESS_MESSAGE, '', 2000);
          projectRoleStore.resetStatus();
        }
      });
    }
  }
  cancelHandler() {
    this.setState({ addingProjectRole: false, updateProjectRole: false });
  }
  render() {
    return (
      <div>
          <HomeHeader newLabel={ constants.NEW_ROLE }
                      actions={[{ value: constants.LBL_NEW, label: constants.NEW_ROLE }]}
                      itemCount={ this.state.projectRoles.length }
                      views={[{ id: 1, name: constants.ROLE_LIST }]}
                      viewId={ constants.LBL_ONE }
                      onNew={ this.newHandler } />
          <ProjectRoleList projectRoles={ this.state.projectRoleList } />
          { this.state.addingProjectRole ? <ProjectRoleFormWindow onCancel={ this.cancelHandler } /> : null }
          { this.state.updateProjectRole ? <ProjectRoleFormWrapper projectRole={ this.state.projectRole } onCancel={ this.cancelHandler } /> : null }
      </div>
    );
  }
}