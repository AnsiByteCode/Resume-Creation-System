import React from 'react';
import Tree, { TreeNode } from 'rc-tree';
import Ddl from'../components/Ddl';
import classNames from 'classnames';
import { NotificationManager } from 'react-notifications';
import constants from '../../constants/Constants';
import permissionModuleActions from '../../actions/PermissionModuleActions';
import permissionModuleStore from '../../stores/PermissionModuleStore';
import roleActions from '../../actions/RoleActions';
import roleStore from '../../stores/RoleStore';
import rolePermissionActions from '../../actions/RolePermissionActions';
import rolePermissionStore from '../../stores/RolePermissionStore';
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

export default class RolePermission extends React.Component {
  constructor() {
    super();
    this.state = { role: [], rolesActive: [], rolePermission: [], rolePermissionInsertStatus: '', permissionModules: [], treeData: [], checkedKeys: [], validateRole: { Role : false, checkedKeys: [] } };
    this.onChange = this.onChange.bind(this);
    this.onChangeRole = this.onChangeRole.bind(this);
    this.onLoadData = this.onLoadData.bind(this);
    this.onCheck = this.onCheck.bind(this);
    this.onSelectAll = this.onSelectAll.bind(this);
    this.onUnSelectAll = this.onUnSelectAll.bind(this);
  }
  componentWillMount() {
    permissionModuleStore.addChangeListener(this.onChange);
    roleStore.addChangeListener(this.onChange);
    rolePermissionStore.addChangeListener(this.onChange);
    permissionModuleActions.getAllPermissionModules();
    roleActions.getAllActiveRoles();
  }
  componentWillUnmount() {
    permissionModuleStore.removeChangeListener(this.onChange);
    roleStore.removeChangeListener(this.onChange);
    rolePermissionStore.removeChangeListener(this.onChange);
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

    this.setState({ rolesActive: roleStore.getActiveRoles() });
    this.setState({ rolePermission: rolePermissionStore.getRolePermission() }, function() {
      selectedNodeList = [];
      for(i = 0; i < this.state.rolePermission.length; i++) {
        let roleData = {
          PermissionModuleId: this.state.rolePermission[i]._id,
          ModuleKey: this.state.rolePermission[i].ModuleKey
        }

        checkedKeys.push(this.state.rolePermission[i].ModuleKey);
        selectedNodeList.push(roleData);
        selectedList['ModuleList'] = selectedNodeList;
      }

      this.setState({ checkedKeys: checkedKeys });
      this.setState({ role : selectedList });
      this.setState({ rolePermissionInsertStatus: rolePermissionStore.getRolePermissionInsertStatus() },function() {
        if (this.state.rolePermissionInsertStatus === constants.OK) {
          NotificationManager.success(constants.INSERT_SUCCESS_MESSAGE, '', 2000);
          this.setState({ role: [], checkedKeys: [] });
          rolePermissionStore.resetStatus();
        }
      });
    });
  }
  onChangeRole(e) {
    const currentState = this.state.validateRole;
    if(e === '0') {
      currentState['Role'] = true;
    }
    else {
      currentState['Role'] = false;
    }

    selectedList['RoleId'] = e;
    this.setState({ validateRole : currentState });
    this.setState({ role : selectedList }, function() {
      if (this.state.role.RoleId !== undefined) {
        rolePermissionActions.getRolePermissionById(this.state.role.RoleId);
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
        let roleData = {
          PermissionModuleId: e.checkedNodes[i].props.id,
          ModuleKey: e.checkedNodes[i].key
        }

        selectedNodeList.push(roleData);
        selectedList['ModuleList'] = selectedNodeList;
      }
    }
    else {
      for(i = 0; i < this.state.treeData.length; i++) {
        let roleData = {
          PermissionModuleId: this.state.treeData[i]._id,
          ModuleKey: this.state.treeData[i].PermissionModuleName
        }

        selectedNodeList.push(roleData);
        selectedList['ModuleList'] = selectedNodeList;
      }
    }

    this.setState({ role : selectedList });
    this.setState({ checkedKeys });
  }
  checkValidations() {
    const currentState = this.state.validateRole;
    var isValid = false;
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
      if(select.value === '0') {
        currentState[select.id] = true;
        isValid = true;
      }
    });

    this.setState({ validateRole : currentState });
    return isValid;
  }
  saveHandler(e) {
    e.preventDefault();
    if (!this.checkValidations()) {
      rolePermissionActions.rolePermissionInsert(this.state.role);
      selectedList = [];
      this.setState({ role: [], checkedKeys: [] });
      rolePermissionStore.resetStatus();
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
        this.setState({ role: selectedList });
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
                          <h4 className='slds-truncate' title=''>{constants.ROLE_PERMISSION}</h4>
                      </div>
                  </div>
              </div>
          </div>
          <div className='form-group col-md-12'>
              <div className='col-md-4'>
                  <label id={ constants.ROLE_LABEL } className='control-label'>{ constants.ROLE }</label>
                  <Ddl id={ constants.ROLE } className={classNames({'form-control':true, 'BorderRed': this.state.validateRole.Role})} name={ constants.DDL_ROLE } options={ this.state.rolesActive ? this.state.rolesActive : [] } value={ this.state.role.RoleId } onValueChange={ this.onChangeRole } valueField='_id' labelField='RoleName' />
                  <div className={classNames({'error': this.state.validateRole.Role, 'displayNone': !this.state.validateRole.Role})} id={ constants.ROLE_ERROR }>{ constants.SELECT_MESSAGE +' '+ constants.ROLE }</div>
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