import React from 'react';
import { HomeHeader } from '../components/PageHeader';
import ProjectFormWindow from './ProjectFormWindow';
import ProjectFormWrapper from './ProjectFormWrapper';
import ProjectList from './ProjectList';
import { NotificationManager } from 'react-notifications';
import projectStore from '../../stores/ProjectStore';
import projectActions from '../../actions/ProjectActions';
import databaseStore from '../../stores/DatabaseStore';
import databaseActions from '../../actions/DatabaseActions';
import domainStore from '../../stores/DomainStore';
import domainActions from '../../actions/DomainActions';
import operatingSystemStore from '../../stores/OperatingSystemStore';
import operatingSystemActions from '../../actions/OperatingSystemActions';
import technologyStore from '../../stores/TechnologyStore';
import technologyActions from '../../actions/TechnologyActions';
import constants from '../../constants/Constants';

export default class ProjectHome extends React.Component {
  constructor() {
    super();
    this.state = { projects: [], projectList: [], project: [], addingProject: false, updateProject: false };
    this.newHandler = this.newHandler.bind(this);
    this.onProjectStoreChange = this.onProjectStoreChange.bind(this);
    this.onChangeDatabases = this.onChangeDatabases.bind(this);
    this.onChangeDomains = this.onChangeDomains.bind(this);
    this.onChangeOperatingSystems = this.onChangeOperatingSystems.bind(this);
    this.onChangeTechnologies = this.onChangeTechnologies.bind(this);
    this.onChange = this.onChange.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
  }
  componentDidMount() {
    projectStore.addChangeListener(this.onChange);
    projectStore.addChangeListener(this.onProjectStoreChange);
    databaseStore.addChangeListener(this.onChangeDatabases);
    domainStore.addChangeListener(this.onChangeDomains);
    operatingSystemStore.addChangeListener(this.onChangeOperatingSystems);
    technologyStore.addChangeListener(this.onChangeTechnologies);
    projectActions.getAllProjects();
    databaseActions.getAllActiveDatabases();
    domainActions.getAllActiveDomains();
    operatingSystemActions.getAllActiveOperatingSystems();
    technologyActions.getAllActiveTechnologies();
  }
  componentWillUnmount() {
    projectStore.removeChangeListener(this.onChange);
    projectStore.removeChangeListener(this.onProjectStoreChange);
    databaseStore.removeChangeListener(this.onChangeDatabases);
    domainStore.removeChangeListener(this.onChangeDomains);
    operatingSystemStore.removeChangeListener(this.onChangeOperatingSystems);
    technologyStore.removeChangeListener(this.onChangeTechnologies);
  }
  newHandler() {
    this.setState({ addingProject: true });
  }
  onProjectStoreChange() {
    this.setState({ projects: projectStore.getProjects() });
    this.setState({ project: projectStore.getProject() }, function() {
      this.setState({ updateProject: projectStore.getProjectStatus() });
    });

    var projectList = this.state.projects;
    for (var i = 0; i < projectList.length; i++) {
      if (projectList[i].IsActive === true || projectList[i].IsActive === constants.LBL_ACTIVE) {
        projectList[i].IsActive = constants.LBL_ACTIVE;
      }
      else {
        projectList[i].IsActive = constants.LBL_INACTIVE;
      }
    }

    this.setState({ projectList: projectList });
  }
  onChangeDatabases() {
    this.setState({ databasesActive: databaseStore.getActiveDatabases() });
  }
  onChangeDomains() {
    this.setState({ domainsActive: domainStore.getActiveDomains() });
  }
  onChangeOperatingSystems() {
    this.setState({ operatingSystemsActive: operatingSystemStore.getActiveOperatingSystems() });
  }
  onChangeTechnologies() {
    this.setState({ technologiesActive: technologyStore.getActiveTechnologies() });
  }
  onChange() {
    if (this.state.addingProject) {
      this.setState({ addingProject: false });
      this.setState({ projectInsertStatus : projectStore.getProjectInsertStatus() }, function() {
        if (this.state.projectInsertStatus === constants.CONFLICT) {
            NotificationManager.error(constants.PROJECT_EXIST, '', 2000);
            projectStore.resetStatus();
        }
        else if (this.state.projectInsertStatus === constants.OK) {
            NotificationManager.success(constants.INSERT_SUCCESS_MESSAGE, '', 2000);
            projectStore.resetStatus();
        }
      });
    }

    if (this.state.updateProject) {
      this.setState({ updateProject: false });
      this.setState({ projectUpdateStatus: projectStore.getProjectUpdateStatus() }, function() {
        if (this.state.projectUpdateStatus === constants.CONFLICT) {
          NotificationManager.error(constants.PROJECT_EXIST, '', 2000);
          projectStore.resetStatus();
        }
        else if (this.state.projectUpdateStatus === constants.OK) {
          NotificationManager.success(constants.UPDATE_SUCCESS_MESSAGE, '', 2000);
          projectStore.resetStatus();
        }
      });
    }
  }
  cancelHandler() {
    this.setState({ addingProject: false, updateProject: false });
  }
  render() {
    return (
      <div>
          <HomeHeader newLabel={ constants.NEW_PROJECT }
                      actions={[{ value: constants.LBL_NEW, label: constants.NEW_PROJECT }]}
                      itemCount={ this.state.projects.length }
                      views={[{ id: 1, name: constants.PROJECT_LIST }]}
                      viewId={ constants.LBL_ONE }
                      onNew={ this.newHandler } />
          <ProjectList projects={ this.state.projectList } />
          { this.state.addingProject ? <ProjectFormWindow databasesActive={ this.state.databasesActive } domainsActive={ this.state.domainsActive } operatingSystemsActive={ this.state.operatingSystemsActive } technologiesActive={ this.state.technologiesActive } onCancel={ this.cancelHandler } /> : null }
          { this.state.updateProject ? <ProjectFormWrapper project={ this.state.project } databasesActive={ this.state.databasesActive } domainsActive={ this.state.domainsActive } operatingSystemsActive={ this.state.operatingSystemsActive } technologiesActive={ this.state.technologiesActive } onCancel={ this.cancelHandler } /> : null }
      </div>
    );
  }
}