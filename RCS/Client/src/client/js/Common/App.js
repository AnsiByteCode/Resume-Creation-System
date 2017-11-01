import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import Shell from './../Common/Shell';
import Login from './../User/Login';
import ForgetPassword from './../User/ForgetPassword';
import ChangePassword from './../User/ChangePassword';
import LogOut from './../User/LogOut';
import ApplicationHome from './../Application/ApplicationHome';
import ApplicationFormWrapper from './../Application/ApplicationFormWrapper';
import DatabaseHome from './../Database/DatabaseHome';
import DatabaseFormWrapper from './../Database/DatabaseFormWrapper';
import DesignationHome from './../Designation/DesignationHome';
import DesignationFormWrapper from './../Designation/DesignationFormWrapper';
import DomainHome from './../Domain/DomainHome';
import DomainFormWrapper from './../Domain/DomainFormWrapper';
import FrameworkHome from './../Framework/FrameworkHome';
import FrameworkFormWrapper from './../Framework/FrameworkFormWrapper';
import LanguageHome from './../Language/LanguageHome';
import LanguageFormWrapper from './../Language/LanguageFormWrapper';
import OperatingSystemHome from './../OperatingSystem/OperatingSystemHome';
import OperatingSystemFormWrapper from './../OperatingSystem/OperatingSystemFormWrapper';
import ProjectHome from './../Project/ProjectHome';
import ProjectFormWrapper from './../Project/ProjectFormWrapper';
import ResumeHome from './../Resume/ResumeHome';
import ResumeRecord from './../Resume/ResumeRecord';
import ResumeFormWrapper from './../Resume/ResumeFormWrapper';
import ResumeFormWindow from './../Resume/ResumeFormWindow';
import ProjectRoleHome from './../ProjectRole/ProjectRoleHome';
import ProjectRoleFormWrapper from './../ProjectRole/ProjectRoleFormWrapper';
import TechnologyHome from './../Technology/TechnologyHome';
import TechnologyFormWrapper from './../Technology/TechnologyFormWrapper';
import UserHome from './../User/UserHome';
import UserFormWrapper from './../User/UserFormWrapper';
import UserPermission from './../UserPermission/UserPermission';
import RolePermission from './../RolePermission/RolePermission';
import RoleHome from './../Role/RoleHome';
import RoleFormWrapper from './../Role/RoleFormWrapper';
import HomeScreen from './../Home/HomeScreen';
import AssignRoles from './../AssignRole/AssignRole';
import constants from '../../constants/Constants';
import { isMenuByRolePermission } from '../Common/Common';

const requireAuth = (nextState, replace) => {
  if (!localStorage.ls_userSession) {
    replace({
      pathname: '/login'
    })
  }
};

const checkSession = (nextState, replace) => {
  if (localStorage.ls_userSession) {
    replace({
      pathname: '/home'
    })
  }
};

const authorize = (nextState, replace) => {
  var userData = JSON.parse(localStorage.getItem('userData'));
  if (!isMenuByRolePermission(userData, nextState["routes"][1].value)) {
    replace({
      pathname: '/home'
    })
  }
};

const App = () => {
  return (
    <Router history={browserHistory}>
      <Route path='/' component={Shell}>
        <IndexRoute component={Login} onEnter={checkSession}/>
        <Route path='/home' component={HomeScreen} onEnter={requireAuth} />
        //// Resume route
        <Route path='/resumes' component={ResumeHome} onEnter={authorize} value={constants.RESUMELIST_RESUMELIST} />
        <Route path='resume' component={ResumeRecord} onEnter={authorize} value={constants.RESUMELIST_RESUMELIST}>
          <Route path=':create' component={ResumeFormWindow} onEnter={authorize} value={constants.RESUMELIST_RESUMELIST} />
          <Route path=':_id/edit' component={ResumeFormWrapper} onEnter={authorize} value={constants.RESUMELIST_RESUMELIST} />
         </Route>
        //// Application route
        <Route path='/applications' component={ApplicationHome} onEnter={authorize} value={constants.LOOKUPS_APPLICATION} />
        <Route path='application/:_id/edit' component={ApplicationFormWrapper} onEnter={authorize} value={constants.LOOKUPS_APPLICATION} />
        //// Database route
        <Route path='/databases' component={DatabaseHome} onEnter={authorize} value={constants.LOOKUPS_DATABASE} />
        <Route path='database/:_id/edit' component={DatabaseFormWrapper} onEnter={authorize} value={constants.LOOKUPS_DATABASE} />
        //// Designation route
        <Route path='/designations' component={DesignationHome} onEnter={authorize} value={constants.LOOKUPS_DESIGNATION} />
        <Route path='designation/:_id/edit' component={DesignationFormWrapper} onEnter={authorize} value={constants.LOOKUPS_DESIGNATION} />
        //// Domain route
        <Route path='/domains' component={DomainHome} onEnter={authorize} value={constants.LOOKUPS_DOMAIN} />
        <Route path='domain/:_id/edit' component={DomainFormWrapper} onEnter={authorize} value={constants.LOOKUPS_DOMAIN} />
        //// Framework route
        <Route path='/frameworks' component={FrameworkHome} onEnter={authorize} value={constants.LOOKUPS_FRAMEWORK} />
        <Route path='framework/:_id/edit' component={FrameworkFormWrapper} onEnter={authorize} value={constants.LOOKUPS_FRAMEWORK} />
        //// Language route
        <Route path='/languages' component={LanguageHome} onEnter={authorize} value={constants.LOOKUPS_LANGUAGE} />
        <Route path='language/:_id/edit' component={LanguageFormWrapper} onEnter={authorize} value={constants.LOOKUPS_LANGUAGE} />
        //// Operating System route
        <Route path='/operatingSystems' component={OperatingSystemHome} onEnter={authorize} value={constants.LOOKUPS_OPERATINGSYSTEM} />
        <Route path='operatingSystem/:_id/edit' component={OperatingSystemFormWrapper} onEnter={authorize} value={constants.LOOKUPS_OPERATINGSYSTEM} />
        //// Project route
        <Route path='/projects' component={ProjectHome} onEnter={authorize} value={constants.LOOKUPS_PROJECT} />
        <Route path='project/:_id/edit' component={ProjectFormWrapper} onEnter={authorize} value={constants.LOOKUPS_PROJECT} />
        //// Project Role route
        <Route path='/projectRoles' component={ProjectRoleHome} onEnter={authorize} value={constants.LOOKUPS_ROLE} />
        <Route path='projectRole/:_id/edit' component={ProjectRoleFormWrapper} onEnter={authorize} value={constants.LOOKUPS_ROLE} />
        //// Technology route
        <Route path='/technologies' component={TechnologyHome} onEnter={authorize} value={constants.LOOKUPS_TECHNOLOGY} />
        <Route path='technology/:_id/edit' component={TechnologyFormWrapper} onEnter={authorize} value={constants.LOOKUPS_TECHNOLOGY} />
        //// User route
        <Route path='/users' component={UserHome} onEnter={authorize} value={constants.USER_MANAGEUSERS} />
        <Route path='user/:_id/edit' component={UserFormWrapper} onEnter={authorize} value={constants.USER_MANAGEUSERS} />
        //// User permission
        <Route path='/userpermission' component={UserPermission} onEnter={authorize} value={constants.USER_USERPERMISSIONS} />
        //// Assign role
        <Route path='/assignroles' component={AssignRoles} onEnter={authorize} value={constants.ROLE_ASSIGNROLE} />
        //// Role permission
        <Route path='/rolepermission' component={RolePermission} onEnter={authorize} value={constants.ROLE_ROLEPERMISSIONS} />
        //// Role route
        <Route path='/roles' component={RoleHome} onEnter={authorize} value={constants.ROLE_MANAGEROLES} />
        <Route path='role/:_id/edit' component={RoleFormWrapper} onEnter={authorize} value={constants.ROLE_MANAGEROLES} />
        //// Login
        <Route path='login' component={Login} onEnter={checkSession} />
        <Route path='changePassword' component={ChangePassword} onEnter={requireAuth}/>
        <Route path='forgetPassword' component={ForgetPassword} onEnter={checkSession}/>
        <Route path='logout' component={LogOut}/>

        <Route path='*' component={HomeScreen} />  //// When navigate to the undefined route, This will navigate to the Home page of the Interview.
      </Route>
    </Router>
  );
};

export default App;