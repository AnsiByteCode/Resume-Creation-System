import React from 'react';
import { RecordHeader } from './../components/PageHeader';
import resumeStore from './../../stores/ResumeStore';
import resumeAction from './../../actions/ResumeAction';
import projectStore from './../../stores/ProjectStore';
import projectActions from './../../actions/ProjectActions';
import databaseStore from './../../stores/DatabaseStore';
import languageActions from './../../actions/LanguageActions';
import frameworkActions from './../../actions/FrameworkActions';
import designationActions from './../../actions/DesignationActions';
import databaseActions from './../../actions/DatabaseActions';
import applicationActions from './../../actions/ApplicationActions';
import domainStore from './../../stores/DomainStore';
import applicationStore from './../../stores/ApplicationStore';
import designationStore from './../../stores/DesignationStore';
import frameworkStore from './../../stores/FrameworkStore';
import languageStore from './../../stores/LanguageStore';
import domainActions from './../../actions/DomainActions';
import operatingSystemStore from './../../stores/OperatingSystemStore';
import operatingSystemActions from './../../actions/OperatingSystemActions';
import projectRoleStore from './../../stores/ProjectRoleStore';
import projectRoleActions from './../../actions/ProjectRoleActions';
import technologyStore from './../../stores/TechnologyStore';
import technologyActions from './../../actions/TechnologyActions';
import constants from './../../constants/Constants';

export default class ResumeRecord extends React.Component {
    constructor() {
        super();
        this.state = { resume: [] };
        this.onResumeStoreChange = this.onResumeStoreChange.bind(this);
        this.onProjectStoreChange = this.onProjectStoreChange.bind(this);
        this.onRoleStoreChange = this.onRoleStoreChange.bind(this);
        this.onDatabaseStoreChange = this.onDatabaseStoreChange.bind(this);
        this.onDesignationStoreChange = this.onDesignationStoreChange.bind(this);
        this.onDomainStoreChange = this.onDomainStoreChange.bind(this);
        this.onOperatingSystemStoreChange = this.onOperatingSystemStoreChange.bind(this);
        this.onTechnologyStoreChange = this.onTechnologyStoreChange.bind(this);
        this.onFrameworkStoreChange = this.onFrameworkStoreChange.bind(this);
        this.onApplicationStoreChange = this.onApplicationStoreChange.bind(this);
        this.onLanguageStoreChange = this.onLanguageStoreChange.bind(this);
        this.getResume = this.getResume.bind(this);
        this.editHandler = this.editHandler.bind(this);
    }
    componentDidMount() {
      ///Event Listeners
        resumeStore.addChangeListener(this.onResumeStoreChange);
        projectStore.addChangeListener(this.onProjectStoreChange);
        databaseStore.addChangeListener(this.onDatabaseStoreChange);
        designationStore.addChangeListener(this.onDesignationStoreChange);
        domainStore.addChangeListener(this.onDomainStoreChange);
        languageStore.addChangeListener(this.onLanguageStoreChange);
        applicationStore.addChangeListener(this.onApplicationStoreChange);
        frameworkStore.addChangeListener(this.onFrameworkStoreChange);
        operatingSystemStore.addChangeListener(this.onOperatingSystemStoreChange);
        technologyStore.addChangeListener(this.onTechnologyStoreChange);
        projectRoleStore.addChangeListener(this.onRoleStoreChange);

        //Action Calling
        projectActions.getAllActiveProjects();
        databaseActions.getAllActiveDatabases();
        designationActions.getAllActiveDesignations();
        applicationActions.getAllActiveApplications();
        frameworkActions.getAllActiveFrameworks();
        languageActions.getAllActiveLanguages();
        projectRoleActions.getAllActiveProjectRoles();
        domainActions.getAllActiveDomains();
        operatingSystemActions.getAllActiveOperatingSystems();
        technologyActions.getAllActiveTechnologies();
        if (this.props.params.create !== constants.LBL_CREATE) {
            this.getResume(this.props.params._id);
        }
    }
    componentWillUnmount() {
        resumeStore.removeChangeListener(this.onResumeStoreChange);
        projectStore.removeChangeListener(this.onProjectStoreChange);
        languageStore.removeChangeListener(this.onLanguageStoreChange);
        databaseStore.removeChangeListener(this.onDatabaseStoreChange);
        designationStore.removeChangeListener(this.onDesignationStoreChange);
        domainStore.removeChangeListener(this.onDomainStoreChange);
        operatingSystemStore.removeChangeListener(this.onOperatingSystemStoreChange);
        technologyStore.removeChangeListener(this.onTechnologyStoreChange);
        applicationStore.removeChangeListener(this.onApplicationStoreChange);
        frameworkStore.removeChangeListener(this.onFrameworkStoreChange);
        projectRoleStore.removeChangeListener(this.onRoleStoreChange);
    }
    onResumeStoreChange() {
        this.setState({ resume: resumeStore.getResume() });
    }
    onProjectStoreChange() {
        this.setState({ projectsActive: projectStore.getActiveProjects() });
    }
    onRoleStoreChange() {
        this.setState({ rolesActive: projectRoleStore.getActiveProjectRoles() });
    }
    onDatabaseStoreChange() {
        this.setState({ databasesActive: databaseStore.getActiveDatabases() });
    }
    onDesignationStoreChange() {
        this.setState({ designationsActive: designationStore.getActiveDesignations() });
    }
    onDomainStoreChange() {
      this.setState({ domainsActive: domainStore.getActiveDomains() });
    }
    onOperatingSystemStoreChange() {
      this.setState({ operatingSystemsActive: operatingSystemStore.getActiveOperatingSystems() },function(data){
      });
    }
    onTechnologyStoreChange() {
      this.setState({ technologiesActive: technologyStore.getActiveTechnologies() });
    }
    onFrameworkStoreChange() {
      this.setState({ frameworksActive: frameworkStore.getActiveFrameworks() });
    }
    onApplicationStoreChange() {
      this.setState({ applicationsActive: applicationStore.getActiveApplications() });
    }
    onLanguageStoreChange() {
      this.setState({ languagesActive: languageStore.getActiveLanguages() });
    }
    getResume(id) {
        resumeAction.getAllResumeDetailsById(id);
    }
    editHandler(e) {
        // window.location.hash = 'resume/' + 1 + '/edit';
    }
    render() {
        return (
            <div>
                <RecordHeader type='resumes' icon='lead' title='' onEdit={this.editHandler}>
                </RecordHeader>
                { React.cloneElement(this.props.children, { resume: this.state.resume, designations: this.state.designationsActive, databases: this.state.databasesActive, domains: this.state.domainsActive, os: this.state.operatingSystemsActive, technologies: this.state.technologiesActive, languages: this.state.languagesActive, applications: this.state.applicationsActive, frameworks: this.state.frameworksActive, projects: this.state.projectsActive, roles: this.state.rolesActive }) }
            </div>
        );
    }
}