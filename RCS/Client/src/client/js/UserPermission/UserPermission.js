import React from 'react';
import Tree, { TreeNode } from 'rc-tree';
import Ddl from'../components/Ddl';
import classNames from 'classnames';
import { NotificationManager } from 'react-notifications';
import constants from '../../constants/Constants';
import permissionModuleActions from '../../actions/PermissionModuleActions';
import permissionModuleStore from '../../stores/PermissionModuleStore';
import userActions from '../../actions/UserActions';
import userStore from '../../stores/UserStore';
import userPermissionActions from '../../actions/UserPermissionActions';
import userPermissionStore from '../../stores/UserPermissionStore';
var parentNodeList = [];
var childNodeList = [];
var selectedNodeList = [];
var selectedList = [];

function generateTreeNodes(treeNode) {
  var nodeList = [];
  parentNodeList.forEach((item) => {
    nodeList = [];
    for(let i = 0; i < childNodeList.length; i++) {
      if(item._id === childNodeList[i].ParentPermissionModuleId) {
        nodeList.push({ name: childNodeList[i].DisplayName, key: childNodeList[i].PermissionModuleName, isLeaf: true, _id: childNodeList[i]._id });
        item.children = nodeList;
      }
    }
  });

  return nodeList;
}

export default class UserPermission extends React.Component {
  constructor() {
    super();
    this.state = { user: [], usersActive: [], userPermission: [], userPermissionInsertStatus: '', permissionModules: [], treeData: [], checkedKeys: [], validateUser: { User : false, checkedKeys: [] } };
    this.onChange = this.onChange.bind(this);
    this.onChangeUser = this.onChangeUser.bind(this);
    this.onLoadData = this.onLoadData.bind(this);
    this.onCheck = this.onCheck.bind(this);
    this.onSelectAll = this.onSelectAll.bind(this);
    this.onUnSelectAll = this.onUnSelectAll.bind(this);
  }
  componentWillMount() {
    permissionModuleStore.addChangeListener(this.onChange);
    userStore.addChangeListener(this.onChange);
    userPermissionStore.addChangeListener(this.onChange);
    permissionModuleActions.getAllPermissionModules();
    userActions.getAllActiveUsers();
  }
  componentWillUnmount() {
    permissionModuleStore.removeChangeListener(this.onChange);
    userStore.removeChangeListener(this.onChange);
    userPermissionStore.removeChangeListener(this.onChange);
  }
  onChange() {
    var checkedKeys = [];
    var i= 0;
    this.setState({ treeData: permissionModuleStore.getPermissionModules() }, function() {
      if(parentNodeList.length === 0 || childNodeList === 0) {
        for(let i = 0; i < this.state.treeData.length; i++) {
          if (this.state.treeData[i].ParentPermissionModuleId === null) {
            parentNodeList.push(this.state.treeData[i]);
          }
          else {
            childNodeList.push(this.state.treeData[i]);
          }
        }
      }
    });

    this.setState({ usersActive: userStore.getActiveUsers() });
    this.setState({ userPermission: userPermissionStore.getUserPermission() }, function() {
      selectedNodeList = [];
      for(i = 0; i < this.state.userPermission.length; i++) {
        let userData = {
          PermissionModuleId: this.state.userPermission[i]._id,
          ModuleKey: this.state.userPermission[i].ModuleKey
        }

        checkedKeys.push(this.state.userPermission[i].ModuleKey);
        selectedNodeList.push(userData);
        selectedList['ModuleList'] = selectedNodeList;
      }

      this.setState({ checkedKeys: checkedKeys });
      this.setState({ user : selectedList });
      this.setState({ userPermissionInsertStatus: userPermissionStore.getUserPermissionInsertStatus() },function() {
        if (this.state.userPermissionInsertStatus === constants.OK) {
          NotificationManager.success(constants.INSERT_SUCCESS_MESSAGE, '', 2000);
          this.setState({ user: [], checkedKeys: [] });
          userPermissionStore.resetStatus();
        }
      });
    });
  }
  onChangeUser(e) {
    const currentState = this.state.validateUser;
    if(e === '0') {
      currentState['User'] = true;
    }
    else {
      currentState['User'] = false;
    }

    selectedList['UserId'] = e;
    this.setState({ validateUser : currentState });
    this.setState({ user : selectedList }, function() {
      if (this.state.user.UserId !== undefined) {
        userPermissionActions.getUserPermissionById(this.state.user.UserId);
      }
    });
  }
  onLoadData(treeNode) {
    return new Promise((resolve) => {
      const treeData = [...parentNodeList];
      this.setState({ treeData });
      parentNodeList = treeData;
      resolve();
    });
  }
  onCheck(checkedKeys, e) {
    selectedNodeList = [];
    var i = 0;
    if(e !== undefined) {
      for(i = 0; i < e.checkedNodes.length; i++) {
        let userData = {
          PermissionModuleId: e.checkedNodes[i].props.id,
          ModuleKey: e.checkedNodes[i].key
        }

        selectedNodeList.push(userData);
        selectedList['ModuleList'] = selectedNodeList;
      }
    }
    else {
      for(i = 0; i < this.state.treeData.length; i++) {
        let userData = {
          PermissionModuleId: this.state.treeData[i]._id,
          ModuleKey: this.state.treeData[i].PermissionModuleName
        }

        selectedNodeList.push(userData);
        selectedList['ModuleList'] = selectedNodeList;
      }
    }

    this.setState({ user : selectedList });
    this.setState({ checkedKeys });
  }
  checkValidations() {
    const currentState = this.state.validateUser;
    var isValid = false;
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
      if(select.value === '0') {
        currentState[select.id] = true;
        isValid = true;
      }
    });

    this.setState({ validateUser : currentState });
    return isValid;
  }
  saveHandler(e) {
    e.preventDefault();
    if (!this.checkValidations()) {
      userPermissionActions.userPermissionInsert(this.state.user);
      selectedList = [];
      this.setState({ user: [], checkedKeys: [] });
      userPermissionStore.resetStatus();
    }
  }
  cancelHandler() {
    this.setState({ user: [], checkedKeys: [] });
  }
  onSelectAll() {
    selectedNodeList = [];
    for(var i = 0; i < this.state.treeData.length; i++) {
      var ModuleKey = this.state.treeData[i].PermissionModuleName;
      selectedNodeList.push(ModuleKey);
    }

    this.setState({ checkedKeys: selectedNodeList }, function() {
      this.onCheck(this.state.checkedKeys);
    });
  }
  onUnSelectAll() {
    this.setState({ checkedKeys: [] }, function() {
      selectedList['ModuleList'] = [];
      this.setState({ user: selectedList });
    });
  }
  render() {
    const loop = (data) => {
      return data.map((item) => {
        if (item.children) {
          return <TreeNode title={item.DisplayName} key={item.PermissionModuleName} id={item._id}>{loop(item.children)}</TreeNode>;
        }
        else {
          generateTreeNodes(item);
          if(item.key) {
            return <TreeNode title={item.name} key={item.key} isLeaf={item.isLeaf} id={item._id}></TreeNode>;
          }
          else {
            return <TreeNode title={item.DisplayName} key={item.PermissionModuleName} id={item._id}></TreeNode>;
          }
        }
      });
    };
    const treeNodes = loop(parentNodeList);
    return (
      <div>
          <div className='slds-page-header'>
              <div className='slds-grid'>
                  <div className='slds-col slds-no-flex slds-has-flexi-truncate'>
                      <div className='slds-grid slds-no-space'>
                          <h4 className='slds-truncate' title=''>{constants.USER_PERMISSION}</h4>
                      </div>
                  </div>
              </div>
          </div>
          <div className='form-group col-md-12'>
              <div className='col-md-4'>
                  <label id={ constants.USER_LABEL } className='control-label'>{ constants.USER }</label>
                  <Ddl id={ constants.USER } className={classNames({'form-control':true, 'BorderRed': this.state.validateUser.User})} name={ constants.DDL_USER } options={ this.state.usersActive ? this.state.usersActive : [] } value={ this.state.user.UserId } onValueChange={ this.onChangeUser } valueField='_id' labelField='Email' />
                  <div className={classNames({'error': this.state.validateUser.User, 'displayNone': !this.state.validateUser.User})} id={ constants.USER_ERROR }>{ constants.SELECT_MESSAGE +' '+ constants.USER }</div>
              </div>
              <div className='col-md-8'>
                  <a href='#' className='paddingRight' onClick={this.onSelectAll}>{constants.LBL_SELECTALL}</a>
                  <a href='#' onClick={this.onUnSelectAll}>{constants.LBL_UNSELECTALL}</a>
                  <Tree
                    checkable onCheck={this.onCheck} checkedKeys={this.state.checkedKeys}
                    loadData={this.onLoadData}>
                    {treeNodes}
                  </Tree>
              </div>
          </div>
          <div>
              <button className='btn btn-primary marginLeft' onClick={ this.saveHandler.bind(this) }>{ constants.SAVE }</button>
              <button className='btn MarginLeft1Per' onClick={ this.cancelHandler.bind(this) }>{ constants.CANCEL }</button>
          </div>
      </div>
    );
  }
}