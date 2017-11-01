import React from 'react';


class Roles extends React.Component{
render(){
  return(
    <ul id="RoleList" className="list-group checked-list-box">
    {
        this.props.roles.map((role,index)=>(
          <li key={role._id}className="list-group-item roleDetails list-group-item-primary liStyle" id={role._id}>
            <input type="checkbox" id = {role._id} checked = {role.isSelected} className="marginRight"  onChange = {(e) => this.props.onRoleClick(e)}/>
            {role.RoleName}

          </li>
        ))
    }
    </ul>
  );
}
}

export default Roles;
