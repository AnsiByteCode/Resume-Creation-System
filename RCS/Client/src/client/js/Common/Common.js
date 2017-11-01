import React from 'react';
import constants from '../../constants/Constants';

//// Edit link component
export const LinkEditComponent = (props) => {
  var urlEdit = props.moduleUrl + props.rowData._id + constants.EDIT_URL;
  return (
    <a href={ urlEdit }><center><span className='glyphicon glyphicon-edit'></span></center></a>
  );
};

export const renderShowsTotal = (start, to, total) => {
  if (total !== 0) {
    return (
      <p className='colorBlack'>
        { constants.LBL_SHOWING } { start } { constants.LBL_TO } { to } { constants.LBL_OF } { total } { constants.LBL_ENTRIES }
      </p>
    );
  }
};

export const isMenuByRolePermission = (userData, moduleName) => {
  var i = 0;
  if (userData !== undefined && userData.length !== 0) {
    if (userData.userpermissions.length !== 0) {
      for (i = 0; i < userData.userpermissions.length; i++) {
        if (userData.userpermissions[i].ModuleKey === moduleName) {
          return true;
        }
      }
    }
    else {
      if (userData.rolepermissions.length !== 0) {
        for (i = 0; i < userData.rolepermissions.length; i++) {
          if (userData.rolepermissions[i].ModuleKey === moduleName) {
            return true;
          }
        }
      }
    }

    return false;
  }
};