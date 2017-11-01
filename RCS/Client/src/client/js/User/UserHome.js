import React from 'react';
import { HomeHeader } from '../components/PageHeader';
import UserFormWindow from './UserFormWindow';
import UserFormWrapper from './UserFormWrapper';
import UserList from './UserList';
import { NotificationManager } from 'react-notifications';
import userStore from '../../stores/UserStore';
import userActions from '../../actions/UserActions';
import constants from '../../constants/Constants';

export default class UserHome extends React.Component {
  constructor() {
    super();
    this.state = { users: [], userList: [], user: [], addingUser: false, updateUser: false };
    this.newHandler = this.newHandler.bind(this);
    this.onUserStoreChange = this.onUserStoreChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
  }
  componentDidMount() {
    userStore.addChangeListener(this.onChange);
    userStore.addChangeListener(this.onUserStoreChange);
    userActions.getAllUsers();
  }
  componentWillUnmount() {
    userStore.removeChangeListener(this.onChange);
    userStore.removeChangeListener(this.onUserStoreChange);
  }
  newHandler() {
    this.setState({ addingUser: true });
  }
  onUserStoreChange() {
    this.setState({ users: userStore.getUsers() });
    this.setState({ user: userStore.getUser() }, function() {
      this.setState({ updateUser: userStore.getUserStatus() });
    });

    var userList = this.state.users;
    for (var i = 0; i < userList.length; i++) {
      if (userList[i].IsActive === true || userList[i].IsActive === constants.LBL_ACTIVE) {
        userList[i].IsActive = constants.LBL_ACTIVE;
      }
      else {
        userList[i].IsActive = constants.LBL_INACTIVE;
      }
    }

    this.setState({ userList: userList });
  }
  onChange() {
    if (this.state.addingUser) {
      this.setState({ addingUser: false });
      this.setState({ userInsertStatus : userStore.getUserInsertStatus() }, function() {
        if (this.state.userInsertStatus === constants.CONFLICT) {
          NotificationManager.error(constants.EMAIL_EXIST_MESSAGE, '', 2000);
          userStore.resetStatus();
        }
        else if (this.state.userInsertStatus === constants.OK) {
          NotificationManager.success(constants.INSERT_SUCCESS_MESSAGE, '', 2000);
          userStore.resetStatus();
        }
      });
    }

    if (this.state.updateUser) {
      this.setState({ updateUser: false });
      this.setState({ userUpdateStatus: userStore.getUserUpdateStatus() }, function() {
        if (this.state.userUpdateStatus === constants.CONFLICT) {
          NotificationManager.error(constants.EMAIL_EXIST_MESSAGE, '', 2000);
          userStore.resetStatus();
        }
        else if (this.state.userUpdateStatus === constants.OK) {
          NotificationManager.success(constants.UPDATE_SUCCESS_MESSAGE, '', 2000);
          userStore.resetStatus();
        }
      });
    }
  }
  cancelHandler() {
    this.setState({ addingUser: false, updateUser: false });
  }
  render() {
    return (
      <div>
          <HomeHeader newLabel={ constants.NEW_USER }
                      actions={[{ value: constants.LBL_NEW, label: constants.NEW_USER }]}
                      itemCount={ this.state.users.length }
                      views={[{ id: 1, name: constants.USER_LIST }]}
                      viewId={ constants.LBL_ONE }
                      onNew={ this.newHandler } />
          <UserList users={ this.state.userList } />
          { this.state.addingUser ? <UserFormWindow onCancel={ this.cancelHandler } /> : null }
          { this.state.updateUser ? <UserFormWrapper user={ this.state.user } onCancel={ this.cancelHandler } /> : null }
      </div>
    );
  }
}