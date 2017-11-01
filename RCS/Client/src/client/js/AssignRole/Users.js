import React from 'react';

class Users extends React.Component {
render(){
  return(
    <ul id="UserList" className="list-group checked-list-box">
      {
      this.props.users.map((user,index)=>(
          <li className="list-group-item userDetails liStyle" id={'user_'+ user._id} key={user._id} >
            <input type="checkbox" id = {user._id} checked = {user.isSelected} className="marginRight"  onChange = {(e) => this.props.onClick(e)}/>
            {user.Email}
          </li>
      ))
      }
    </ul>
  );
}
}

export default Users;