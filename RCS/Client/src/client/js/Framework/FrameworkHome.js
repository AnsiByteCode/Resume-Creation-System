import React from 'react';
import { HomeHeader } from '../components/PageHeader';
import FrameworkFormWindow from './FrameworkFormWindow';
import FrameworkFormWrapper from './FrameworkFormWrapper';
import FrameworkList from './FrameworkList';
import { NotificationManager } from 'react-notifications';
import frameworkStore from '../../stores/FrameworkStore';
import frameworkActions from '../../actions/FrameworkActions';
import constants from '../../constants/Constants';

export default class FrameworkHome extends React.Component {
  constructor() {
    super();
    this.state = { frameworks: [], frameworkList: [], framework: [], addingFramework: false, updateFramework: false };
    this.newHandler = this.newHandler.bind(this);
    this.onFrameworkStoreChange = this.onFrameworkStoreChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
  }
  componentDidMount() {
    frameworkStore.addChangeListener(this.onChange);
    frameworkStore.addChangeListener(this.onFrameworkStoreChange);
    frameworkActions.getAllFrameworks();
  }
  componentWillUnmount() {
    frameworkStore.removeChangeListener(this.onChange);
    frameworkStore.removeChangeListener(this.onFrameworkStoreChange);
  }
  newHandler() {
    this.setState({ addingFramework: true });
  }
  onFrameworkStoreChange() {
    this.setState({ frameworks: frameworkStore.getFrameworks() });
    this.setState({ framework: frameworkStore.getFramework() }, function() {
      this.setState({ updateFramework: frameworkStore.getFrameworkStatus() });
    });

    var frameworkList = this.state.frameworks;
    for (var i = 0; i < frameworkList.length; i++) {
      if (frameworkList[i].IsActive === true || frameworkList[i].IsActive === constants.LBL_ACTIVE) {
        frameworkList[i].IsActive = constants.LBL_ACTIVE;
      }
      else {
        frameworkList[i].IsActive = constants.LBL_INACTIVE;
      }
    }

    this.setState({ frameworkList: frameworkList });
  }
  onChange() {
    if (this.state.addingFramework) {
      this.setState({ addingFramework: false });
      this.setState({ frameworkInsertStatus : frameworkStore.getFrameworkInsertStatus() }, function() {
        if (this.state.frameworkInsertStatus === constants.CONFLICT) {
          NotificationManager.error(constants.FRAMEWORK_EXIST, '', 2000);
          frameworkStore.resetStatus();
        }
        else if (this.state.frameworkInsertStatus === constants.OK) {
          NotificationManager.success(constants.INSERT_SUCCESS_MESSAGE, '', 2000);
          frameworkStore.resetStatus();
        }
      });
    }

    if (this.state.updateFramework) {
      this.setState({ updateFramework: false });
      this.setState({ frameworkUpdateStatus: frameworkStore.getFrameworkUpdateStatus() }, function() {
        if (this.state.frameworkUpdateStatus === constants.CONFLICT) {
          NotificationManager.error(constants.FRAMEWORK_EXIST, '', 2000);
          frameworkStore.resetStatus();
        }
        else if (this.state.frameworkUpdateStatus === constants.OK) {
          NotificationManager.success(constants.UPDATE_SUCCESS_MESSAGE, '', 2000);
          frameworkStore.resetStatus();
        }
      });
    }
  }
  cancelHandler() {
    this.setState({ addingFramework: false, updateFramework: false });
  }
  render() {
    return (
      <div>
          <HomeHeader newLabel={ constants.NEW_FRAMEWORK }
                      actions={[{ value: constants.LBL_NEW, label: constants.NEW_FRAMEWORK }]}
                      itemCount={ this.state.frameworks.length }
                      views={[{ id: 1, name: constants.FRAMEWORK_LIST }]}
                      viewId={ constants.LBL_ONE }
                      onNew={ this.newHandler } />
          <FrameworkList frameworks={ this.state.frameworkList } />
          { this.state.addingFramework ? <FrameworkFormWindow onCancel={ this.cancelHandler } /> : null }
          { this.state.updateFramework ? <FrameworkFormWrapper framework={ this.state.framework } onCancel={ this.cancelHandler } /> : null }
      </div>
    );
  }
}