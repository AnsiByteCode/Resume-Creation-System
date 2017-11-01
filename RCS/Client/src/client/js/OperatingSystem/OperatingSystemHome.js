import React from 'react';
import { HomeHeader } from '../components/PageHeader';
import OperatingSystemFormWindow from './OperatingSystemFormWindow';
import OperatingSystemFormWrapper from './OperatingSystemFormWrapper';
import OperatingSystemList from './OperatingSystemList';
import { NotificationManager } from 'react-notifications';
import operatingSystemStore from '../../stores/OperatingSystemStore';
import operatingSystemActions from '../../actions/OperatingSystemActions';
import constants from '../../constants/Constants';

export default class OperatingSystemHome extends React.Component {
  constructor() {
    super();
    this.state = { operatingSystems: [], operatingSystemList: [], operatingSystem: [], addingOperatingSystem: false, updateOperatingSystem: false };
    this.newHandler = this.newHandler.bind(this);
    this.onOperatingSystemStoreChange = this.onOperatingSystemStoreChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
  }
  componentDidMount() {
    operatingSystemStore.addChangeListener(this.onChange);
    operatingSystemStore.addChangeListener(this.onOperatingSystemStoreChange);
    operatingSystemActions.getAllOperatingSystems();
  }
  componentWillUnmount() {
    operatingSystemStore.removeChangeListener(this.onChange);
    operatingSystemStore.removeChangeListener(this.onOperatingSystemStoreChange);
  }
  newHandler() {
    this.setState({ addingOperatingSystem: true });
  }
  onOperatingSystemStoreChange() {
    this.setState({ operatingSystems: operatingSystemStore.getOperatingSystems() });
    this.setState({ operatingSystem: operatingSystemStore.getOperatingSystem() }, function() {
      this.setState({ updateOperatingSystem: operatingSystemStore.getOperatingSystemStatus() });
    });

    var operatingSystemList = this.state.operatingSystems;
    for (var i = 0; i < operatingSystemList.length; i++) {
      if (operatingSystemList[i].IsActive === true || operatingSystemList[i].IsActive === constants.LBL_ACTIVE) {
        operatingSystemList[i].IsActive = constants.LBL_ACTIVE;
      }
      else {
        operatingSystemList[i].IsActive = constants.LBL_INACTIVE;
      }
    }

    this.setState({ operatingSystemList: operatingSystemList });
  }
  onChange() {
    if (this.state.addingOperatingSystem) {
      this.setState({ addingOperatingSystem: false });
      this.setState({ operatingSystemInsertStatus : operatingSystemStore.getOperatingSystemInsertStatus() }, function() {
        if (this.state.operatingSystemInsertStatus === constants.CONFLICT) {
            NotificationManager.error(constants.OPERATINGSYSTEM_EXIST, '', 2000);
            operatingSystemStore.resetStatus();
        }
        else if (this.state.operatingSystemInsertStatus === constants.OK) {
            NotificationManager.success(constants.INSERT_SUCCESS_MESSAGE, '', 2000);
            operatingSystemStore.resetStatus();
        }
      });
    }

    if (this.state.updateOperatingSystem) {
      this.setState({ updateOperatingSystem: false });
      this.setState({ operatingSystemUpdateStatus: operatingSystemStore.getOperatingSystemUpdateStatus() }, function() {
        if (this.state.operatingSystemUpdateStatus === constants.CONFLICT) {
          NotificationManager.error(constants.OPERATINGSYSTEM_EXIST, '', 2000);
          operatingSystemStore.resetStatus();
        }
        else if (this.state.operatingSystemUpdateStatus === constants.OK) {
          NotificationManager.success(constants.UPDATE_SUCCESS_MESSAGE, '', 2000);
          operatingSystemStore.resetStatus();
        }
      });
    }
  }
  cancelHandler() {
    this.setState({ addingOperatingSystem: false, updateOperatingSystem: false });
  }
  render() {
    return (
      <div>
          <HomeHeader newLabel={ constants.NEW_OPERATINGSYSTEM }
                      actions={[{ value: constants.LBL_NEW, label: constants.NEW_OPERATINGSYSTEM }]}
                      itemCount={ this.state.operatingSystems.length }
                      views={[{ id: 1, name: constants.OPERATINGSYSTEM_LIST }]}
                      viewId={ constants.LBL_ONE }
                      onNew={ this.newHandler } />
          <OperatingSystemList operatingSystems={ this.state.operatingSystemList } />
          { this.state.addingOperatingSystem ? <OperatingSystemFormWindow onCancel={ this.cancelHandler } /> : null }
          { this.state.updateOperatingSystem ? <OperatingSystemFormWrapper operatingSystem={ this.state.operatingSystem } onCancel={ this.cancelHandler } /> : null }
      </div>
    );
  }
}