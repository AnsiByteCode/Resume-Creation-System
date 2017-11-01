import React from 'react';
import loginActions from '../../actions/LoginActions';
import loginStore from '../../stores/LoginStore';
import { browserHistory } from 'react-router';

export default class LogOut extends React.Component {
  constructor() {
    super();
    loginStore.addChangeListener(this.onLogOut);
    loginActions.logOutUser();
  }
  onLogOut(){
    browserHistory.push('/login');
  }
  render() {
    return (
      <div>
      </div>
    );
  }
}