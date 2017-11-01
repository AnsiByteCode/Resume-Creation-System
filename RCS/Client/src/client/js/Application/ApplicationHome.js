import React from 'react';
import { HomeHeader } from './../components/PageHeader';
import ApplicationFormWindow from './ApplicationFormWindow';
import ApplicationFormWrapper from './ApplicationFormWrapper';
import ApplicationList from './ApplicationList';
import { NotificationManager } from 'react-notifications';
import applicationStore from '../../stores/ApplicationStore';
import applicationActions from '../../actions/ApplicationActions';
import constants from '../../constants/Constants';

export default class ApplicationHome extends React.Component {
  constructor() {
    super();
    this.state = { applications: [], applicationList: [], application: [], addingApplication: false, updateApplication: false };
    this.newHandler = this.newHandler.bind(this);
    this.onApplicationStoreChange = this.onApplicationStoreChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
  }
  componentDidMount() {
    applicationStore.addChangeListener(this.onChange);
    applicationStore.addChangeListener(this.onApplicationStoreChange);
    applicationActions.getAllApplications();
  }
  componentWillUnmount() {
    applicationStore.removeChangeListener(this.onChange);
    applicationStore.removeChangeListener(this.onApplicationStoreChange);
  }
  newHandler() {
    this.setState({ addingApplication: true });
  }
  onApplicationStoreChange() {
    this.setState({ applications: applicationStore.getApplications() });
    this.setState({ application: applicationStore.getApplication() }, function() {
      this.setState({ updateApplication: applicationStore.getApplicationStatus() });
    });

    var applicationList = this.state.applications;
    for (var i = 0; i < applicationList.length; i++) {
      if (applicationList[i].IsActive === true || applicationList[i].IsActive === constants.LBL_ACTIVE) {
        applicationList[i].IsActive = constants.LBL_ACTIVE;
      }
      else {
        applicationList[i].IsActive = constants.LBL_INACTIVE;
      }
    }

    this.setState({ applicationList: applicationList });
  }
  onChange() {
    if (this.state.addingApplication) {
      this.setState({ addingApplication: false });
      this.setState({ applicationInsertStatus : applicationStore.getApplicationInsertStatus() }, function() {
        if (this.state.applicationInsertStatus === constants.CONFLICT) {
          NotificationManager.error(constants.APPLICATION_EXIST, '', 2000);
          applicationStore.resetStatus();
        }
        else if (this.state.applicationInsertStatus === constants.OK) {
          NotificationManager.success(constants.INSERT_SUCCESS_MESSAGE, '', 2000);
          applicationStore.resetStatus();
        }
      });
    }

    if (this.state.updateApplication) {
      this.setState({ updateApplication: false });
      this.setState({ applicationUpdateStatus: applicationStore.getApplicationUpdateStatus() }, function() {
        if (this.state.applicationUpdateStatus === constants.CONFLICT) {
          NotificationManager.error(constants.APPLICATION_EXIST, '', 2000);
          applicationStore.resetStatus();
        }
        else if (this.state.applicationUpdateStatus === constants.OK) {
          NotificationManager.success(constants.UPDATE_SUCCESS_MESSAGE, '', 2000);
          applicationStore.resetStatus();
        }
      });
    }
  }
  cancelHandler() {
    this.setState({ addingApplication: false, updateApplication: false });
  }
  render() {
    return (
      <div>
          <HomeHeader newLabel={ constants.NEW_APPLICATION }
                      actions={[{ value: constants.LBL_NEW, label: constants.NEW_APPLICATION }]}
                      itemCount={ this.state.applications.length }
                      views={[{ id: 1, name: constants.APPLICATION_LIST }]}
                      viewId={ constants.LBL_ONE }
                      onNew={ this.newHandler } />
          <ApplicationList applications={ this.state.applicationList } />
          { this.state.addingApplication ? <ApplicationFormWindow onCancel={ this.cancelHandler } /> : null }
          { this.state.updateApplication ? <ApplicationFormWrapper application={ this.state.application } onCancel={ this.cancelHandler } /> : null }
      </div>
    );
  }
}