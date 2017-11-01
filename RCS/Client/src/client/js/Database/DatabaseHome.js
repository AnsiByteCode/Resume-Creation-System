import React from 'react';
import { HomeHeader } from '../components/PageHeader';
import DatabaseFormWindow from './DatabaseFormWindow';
import DatabaseFormWrapper from './DatabaseFormWrapper';
import DatabaseList from './DatabaseList';
import { NotificationManager } from 'react-notifications';
import databaseStore from '../../stores/DatabaseStore';
import databaseActions from '../../actions/DatabaseActions';
import constants from '../../constants/Constants';

export default class DatabaseHome extends React.Component {
  constructor() {
    super();
    this.state = { databases: [], databaseList: [], database: [], addingDatabase: false, updateDatabase: false };
    this.newHandler = this.newHandler.bind(this);
    this.onDatabaseStoreChange = this.onDatabaseStoreChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
  }
  componentDidMount() {
    databaseStore.addChangeListener(this.onChange);
    databaseStore.addChangeListener(this.onDatabaseStoreChange);
    databaseActions.getAllDatabases();
  }
  componentWillUnmount() {
    databaseStore.removeChangeListener(this.onChange);
    databaseStore.removeChangeListener(this.onDatabaseStoreChange);
  }
  newHandler() {
    this.setState({ addingDatabase: true });
  }
  onDatabaseStoreChange() {
    this.setState({ databases: databaseStore.getDatabases() });
    this.setState({ database: databaseStore.getDatabase() }, function() {
      this.setState({ updateDatabase: databaseStore.getDatabaseStatus() });
    });

    var databaseList = this.state.databases;
    for (var i = 0; i < databaseList.length; i++) {
      if (databaseList[i].IsActive === true || databaseList[i].IsActive === constants.LBL_ACTIVE) {
        databaseList[i].IsActive = constants.LBL_ACTIVE;
      }
      else {
        databaseList[i].IsActive = constants.LBL_INACTIVE;
      }
    }

    this.setState({ databaseList: databaseList });
  }
  onChange() {
    if (this.state.addingDatabase) {
      this.setState({ addingDatabase: false });
      this.setState({ databaseInsertStatus : databaseStore.getDatabaseInsertStatus() }, function() {
        if (this.state.databaseInsertStatus === constants.CONFLICT) {
          NotificationManager.error(constants.DATABASE_EXIST, '', 2000);
          databaseStore.resetStatus();
        }
        else if (this.state.databaseInsertStatus === constants.OK)  {
          NotificationManager.success(constants.INSERT_SUCCESS_MESSAGE, '', 2000);
          databaseStore.resetStatus();
        }
      });
    }

    if (this.state.updateDatabase) {
      this.setState({ updateDatabase: false });
      this.setState({ databaseUpdateStatus: databaseStore.getDatabaseUpdateStatus() }, function() {
        if (this.state.databaseUpdateStatus === constants.CONFLICT) {
          NotificationManager.error(constants.DATABASE_EXIST, '', 2000);
          databaseStore.resetStatus();
        }
        else if (this.state.databaseUpdateStatus === constants.OK) {
          NotificationManager.success(constants.UPDATE_SUCCESS_MESSAGE, '', 2000);
          databaseStore.resetStatus();
        }
      });
    }
  }
  cancelHandler() {
    this.setState({ addingDatabase: false, updateDatabase: false });
  }
  render() {
    return (
      <div>
          <HomeHeader newLabel={ constants.NEW_DATABASE }
                      actions={[{ value: constants.LBL_NEW, label: constants.NEW_DATABASE }]}
                      itemCount={ this.state.databases.length }
                      views={[{ id: 1, name: constants.DATABASE_LIST }]}
                      viewId={ constants.LBL_ONE }
                      onNew={ this.newHandler } />
          <DatabaseList databases={ this.state.databaseList } />
          { this.state.addingDatabase ? <DatabaseFormWindow onCancel={ this.cancelHandler } /> : null }
          { this.state.updateDatabase ? <DatabaseFormWrapper database={ this.state.database } onCancel={ this.cancelHandler } /> : null }
      </div>
    );
  }
}