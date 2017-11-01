import React from 'react';
import Spinner from './../components/Spinner';
import Toast from './../components/Toast';
import { Icon } from './../components/Icons';
import SystemLogo from './../images/my-resume.png';
import { NotificationContainer } from 'react-notifications';
import constants from '../../constants/Constants';
import loginStore from '../../stores/LoginStore';
import userActions from '../../actions/UserActions';
import userStore from '../../stores/UserStore';
import { isMenuByRolePermission } from '../Common/Common';
let headerMenu = '';
let userData = [];

export default class Shell extends React.Component {
  constructor() {
    super();
    this.state = { loginData: loginStore.getUserData(), userData: [] };
    this.selectHandler = this.selectHandler.bind(this);
    this.onChangeUser = this.onChangeUser.bind(this);
  }
  componentWillMount() {
    loginStore.addChangeListener(this.onChangeUser);
    if (localStorage.ls_userSession) {
      userActions.getPermissionsById(localStorage.ls_userSession);
    }

    userStore.addChangeListener(this.onChangeUser);
  }
  componentWillUnmount() {
    loginStore.removeChangeListener(this.onChangeUser);
    userStore.removeChangeListener(this.onChangeUser);
  }
  selectHandler(index, value, label) {
    window.location.href = 'home';
  }
  onChangeUser() {
    this.setState({ loginData: loginStore.getUserData() });
    this.setState({ userData: userStore.getPermissions() });
  }
  render() {
    if (localStorage.ls_userSession) {
      if (this.state.loginData !== undefined) {
        userData = this.state.loginData;
      }
      else {
        userData = this.state.userData;
      }

      headerMenu = (
        <header className='menu' style={{ backgroundColor: '#01344E', verticalAlign: 'middle', padding: '7px' }}>
            <div>
                <ul className='slds-list--horizontal'>
                    <li className='slds-list__item applicationName'>
                        <a href='/home'>
                            <img className='applicationLogo' src={ SystemLogo } alt='Smiley face' height='45' width='45' />
                        </a>
                        <div>
                            <Icon name='lead' theme={null}/>{ constants.RESUME_MANAGEMENT_SYSTEM }
                        </div>
                    </li>
                    <li className='slds-list__item headerMenuMarginTop navBarMenuAlignment'><a className='menuItemFontSize' href='/home'><Icon name='lead' theme={null}/>{ constants.HOME }</a></li>
                    { (isMenuByRolePermission(userData, constants.USER_USER) || isMenuByRolePermission(userData, constants.USER_MANAGEUSERS) || isMenuByRolePermission(userData, constants.USER_USERPERMISSIONS)) ?
                      <li className='slds-list__item headerMenuMarginTop'>
                      <div className='dropdown'>
                          <div className='dropbtn'>
                              { constants.USER }
                          </div>
                          <div className='dropdown-content divContentStyle'>
                            { isMenuByRolePermission(userData, constants.USER_MANAGEUSERS) ? <a href='/users'><Icon name='lead' theme={null}/>{ constants.MANAGE_USERS }</a> : null }
                            { isMenuByRolePermission(userData, constants.USER_USERPERMISSIONS) ? <a href='/userpermission'><Icon name='lead' theme={null}/>{ constants.USER_PERMISSION }</a> : null }
                          </div>
                        </div>
                    </li> : null }
                    { (isMenuByRolePermission(userData, constants.ROLE_ROLE) || isMenuByRolePermission(userData, constants.ROLE_MANAGEROLES) || isMenuByRolePermission(userData, constants.ROLE_ASSIGNROLE) ||
                       isMenuByRolePermission(userData, constants.ROLE_ROLEPERMISSIONS)) ?
                      <li className='slds-list__item headerMenuMarginTop'>
                        <div className='dropdown'>
                            <div className='dropbtn'>
                                { constants.ROLE }
                            </div>
                            <div className='dropdown-content divContentStyle'>
                              { isMenuByRolePermission(userData, constants.ROLE_MANAGEROLES) ? <a href='/roles'><Icon name='lead' theme={null}/>{ constants.MANAGE_ROLES }</a> : null }
                              { isMenuByRolePermission(userData, constants.ROLE_ASSIGNROLE) ? <a href='/assignroles'><Icon name='lead' theme={null}/>{ constants.ASSIGN_ROLES }</a> : null }
                              { isMenuByRolePermission(userData, constants.ROLE_ROLEPERMISSIONS) ? <a href='/rolepermission'><Icon name='lead' theme={null}/>{ constants.ROLE_PERMISSION }</a> : null }
                            </div>
                          </div>
                    </li> : null }
                    { isMenuByRolePermission(userData, constants.RESUMELIST_RESUMELIST) ? <li className='slds-list__item headerMenuMarginTop'><a className='menuItemFontSize' href='/resumes'><Icon name='lead' theme={null}/>{ constants.RESUME_LIST }</a></li> : null }
                    { (isMenuByRolePermission(userData, constants.LOOKUPS_LOOKUPS) || isMenuByRolePermission(userData, constants.LOOKUPS_APPLICATION) || isMenuByRolePermission(userData, constants.LOOKUPS_DATABASE) || isMenuByRolePermission(userData, constants.LOOKUPS_DESIGNATION) ||
                      isMenuByRolePermission(userData, constants.LOOKUPS_DOMAIN) || isMenuByRolePermission(userData, constants.LOOKUPS_FRAMEWORK) || isMenuByRolePermission(userData, constants.LOOKUPS_LANGUAGE) ||
                      isMenuByRolePermission(userData, constants.LOOKUPS_OPERATINGSYSTEM) || isMenuByRolePermission(userData, constants.LOOKUPS_PROJECT) || isMenuByRolePermission(userData, constants.LOOKUPS_ROLE) ||
                      isMenuByRolePermission(userData, constants.LOOKUPS_TECHNOLOGY)) ?
                      <li className='slds-list__item headerMenuMarginTop'>
                        <div className='dropdown'>
                            <div className='dropbtn'>
                                { constants.LOOKUPS }
                            </div>
                            <div className='dropdown-content divContentStyle'>
                                { isMenuByRolePermission(userData, constants.LOOKUPS_APPLICATION) ? <a href='/applications'><Icon name='lead' theme={null}/>{ constants.APPLICATION }</a> : null }
                                { isMenuByRolePermission(userData, constants.LOOKUPS_DATABASE) ? <a href='/databases'><Icon name='lead' theme={null}/>{ constants.DATABASE }</a> : null }
                                { isMenuByRolePermission(userData, constants.LOOKUPS_DESIGNATION) ? <a href='/designations'><Icon name='lead' theme={null}/>{ constants.DESIGNATION }</a> : null }
                                { isMenuByRolePermission(userData, constants.LOOKUPS_DOMAIN) ? <a href='/domains'><Icon name='lead' theme={null}/>{ constants.DOMAIN }</a> : null }
                                { isMenuByRolePermission(userData, constants.LOOKUPS_FRAMEWORK) ? <a href='/frameworks'><Icon name='lead' theme={null}/>{ constants.FRAMEWORK }</a> : null }
                                { isMenuByRolePermission(userData, constants.LOOKUPS_LANGUAGE) ? <a href='/languages'><Icon name='lead' theme={null}/>{ constants.LANGUAGE }</a> : null }
                                { isMenuByRolePermission(userData, constants.LOOKUPS_OPERATINGSYSTEM) ? <a href='/operatingSystems'><Icon name='lead' theme={null}/>{ constants.OPERATINGSYSTEM }</a> : null }
                                { isMenuByRolePermission(userData, constants.LOOKUPS_PROJECT) ? <a href='/projects'><Icon name='lead' theme={null}/>{ constants.PROJECT }</a> : null }
                                { isMenuByRolePermission(userData, constants.LOOKUPS_ROLE) ? <a href='/projectRoles'><Icon name='lead' theme={null}/>{ constants.ROLE }</a> : null }
                                { isMenuByRolePermission(userData, constants.LOOKUPS_TECHNOLOGY) ? <a href='/technologies'><Icon name='lead' theme={null}/>{ constants.TECHNOLOGY }</a> : null }
                            </div>
                        </div>
                    </li> : null }

                    <li className='slds-list__item userMenu'>
                        <div className='dropdown'>
                            <div className='dropbtn'>{localStorage.ls_userName}</div>
                            <div className='dropdown-content'>
                                <a href='/logout'>{ constants.LOGOUT }</a>
                                <a href='/changePassword'>{ constants.CHANGEPASSWORD }</a>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </header>
      )
    }
    else {
      headerMenu = ''
    }
    return (
      <div>
          <NotificationContainer/>
          <Spinner/>
          <Toast/>
          { headerMenu }
          { this.props.children }
      </div>
    );
  }
}