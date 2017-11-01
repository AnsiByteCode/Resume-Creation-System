import React from 'react';
import userActions from '../../actions/UserActions';
import constants from '../../constants/Constants';
import classNames from 'classnames';
var userData = [];
let checkbox;
let txtEmail, lblPassword, lblcnfPassword, inputPassword, inputcnfPassword;

export default class UserForm extends React.Component {
  constructor() {
    super();
    this.state = { userRecord: [] };
    this.handleChange = this.handleChange.bind(this);
    this.save = this.save.bind(this);
    this.changeIsActive = this.changeIsActive.bind(this);
  }
  componentDidMount() {
    userData = [];
    userData['IsActive'] = true;
    this.setState({ userRecord: userData });
  }
  componentWillReceiveProps(props) {
    if (props.user !== undefined && props.user !== this.state.userRecord && props.user.length !== 0) {
      this.setState({ userRecord: props.user }, function() {
        userData = this.state.userRecord;
      });
    }
  }
  showInputError(e) {
    let validity;
    let refName = e.target.name;
    validity = e.target.validity;
    const label = document.getElementById(`${refName}Label`).textContent;
    const error = document.getElementById(`${refName}Error`);
    const inputPassword = document.getElementById(`${constants.PASSWORD}`);
    const isContactNumber = refName === constants.CONTACT_NUMBER;
    const isPassword = refName === constants.PASSWORD;
    const isconfirmpassword = refName === constants.CONFIRM_PASSWORD;
    const isEmailId = refName === constants.EMAIL;
    if (isconfirmpassword) {
      if (inputPassword.value !== '' && inputPassword.value !== e.target.value) {
        e.target.setCustomValidity(constants.MATCH_PASSWORD_MESSAGE);
      }
      else {
        e.target.setCustomValidity('');
      }
    }

    if (!validity.valid) {
      if (validity.valueMissing) {
        error.textContent = constants.REQUIRED_MESSAGE + ` ${label}`;
      }
      else if (validity.typeMismatch) {
        error.textContent = constants.VALIDITY_MESSAGE + ` ${label}`;
      }
      else if ((isContactNumber || isEmailId) && validity.patternMismatch) {
        error.textContent = constants.VALIDITY_MESSAGE + ` ${label}`;
      }
      else if ((isPassword || isconfirmpassword) && validity.patternMismatch) {
        error.textContent = constants.PWD_LENGTH_MESSAGE
      }
      else if (isconfirmpassword && validity.customError) {
        error.textContent = constants.MATCH_PASSWORD_MESSAGE;
      }

      return false;
    }

    error.textContent = '';
    return true;
  }
  handleChange(e) {
    e.target.value = e.target.value.replace(/\s/g, "");
    const currentState = this.props.validateUser;
    userData[e.target.name] = e.target.value;
    if(!this.showInputError(e)) {
      currentState[e.target.name] = true;
    }
    else {
      currentState[e.target.name] = false;
    }

    this.setState({ validateUser : currentState });
    this.setState({ userRecord : userData });
  }
  save() {
    if (this.state.userRecord._id) {
      userActions.userUpdate(this.state.userRecord);
      if (this.props.onSaved) {
        this.props.onSaved();
      }
    }
    else {
      userActions.userInsert(this.state.userRecord);
    }
  }
  changeIsActive(e) {
    userData['IsActive'] = e.target.checked;
    this.setState({ userRecord : userData });
  }
  numericOnly(e) {
    const re = /[0-9]+/g;
    if (!re.test(e.key)) {
      e.preventDefault();
    }
  }
  alphaOnly(e) {
    const re = /[a-zA-Z]+/g;
    if (!re.test(e.key)) {
      e.preventDefault();
    }
  }
  prevent(e) {
    if (e.key === '<' || e.key === '>') {
      e.preventDefault();
    }
  }
  render() {
    if (this.props.user !== undefined && this.props.user.length !== 0) {
      if (this.props.user._id) {
          lblPassword = (<div className='col-md-3 displayNone' ref={ constants.LBLPASSWORD }><label id={ constants.PASSWORD_LABEL } className='control-label'>{ constants.PASSWORD }</label></div>)
          inputPassword = (
            <div className='col-md-9 form-group displayNone' ref={ constants.INPUT_PASSWORD }>
                <input className={classNames({'form-control': true, 'password': true, 'BorderRed': this.props.validateUser.Password})} type='password' id={ constants.PASSWORD } name={ constants.PASSWORD } ref={ constants.PASSWORD } pattern='[a-zA-Z0-9@#$%^&*]{8,}$' value={ this.state.userRecord.Password ? this.state.userRecord.Password : '' } onChange={ this.handleChange } required />
                <div className={classNames({'error': this.props.validateUser.Password, 'displayNone': !this.props.validateUser.Password})} id={ constants.PASSWORD_ERROR }></div>
            </div>
          )
          lblcnfPassword = (<div className='col-md-3 displayNone' ref={ constants.LBLCONFIRMPASSWORD }><label id={ constants.CONFIRMPASSWORD_LABEL } className='control-label'>{ constants.CONFIRMPASSWORD }</label></div>)
          inputcnfPassword = (
              <div className='col-md-9 form-group displayNone' ref={ constants.INPUT_CONFIRM_PASSWORD }>
                  <input className={classNames({'form-control': true, 'password': true, 'BorderRed': this.props.validateUser.ConfirmPassword})} type='password' name={ constants.CONFIRM_PASSWORD } ref={ constants.CONFIRM_PASSWORD } pattern='[a-zA-Z0-9@#$%^&*]{8,}$' value={ this.state.userRecord.ConfirmPassword ? this.state.userRecord.ConfirmPassword : '' } onChange={ this.handleChange } required />
                  <div className={classNames({'error': this.props.validateUser.ConfirmPassword, 'displayNone': !this.props.validateUser.ConfirmPassword})} id={ constants.CONFIRMPASSWORD_ERROR }></div>
              </div>
          )
          txtEmail = (<input className={classNames({'form-control': true, 'password': true, 'BorderRed': this.props.validateUser.Email})} type='email' name={ constants.EMAIL } ref={ constants.EMAIL } pattern="[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?" value={ this.state.userRecord.Email ? this.state.userRecord.Email : '' } onChange={ this.handleChange } disabled={ true } required />)
      }
    }
    else {
      lblPassword = (<div className='col-md-3' ref={ constants.LBLPASSWORD }><label id={ constants.PASSWORD_LABEL } className='control-label'>{ constants.PASSWORD }</label></div>)
      inputPassword = (
        <div className='col-md-9 form-group' ref={ constants.INPUT_PASSWORD }>
            <input className={classNames({'form-control': true, 'password': true, 'BorderRed': this.props.validateUser.Password})} type='password' id={ constants.PASSWORD } name={ constants.PASSWORD } ref={ constants.PASSWORD } pattern='[a-zA-Z0-9@#$%^&*]{8,}$' value={ this.state.userRecord.Password ? this.state.userRecord.Password : '' } onChange={ this.handleChange } required />
            <div className={classNames({'error': this.props.validateUser.Password, 'displayNone': !this.props.validateUser.Password})} id={ constants.PASSWORD_ERROR }></div>
        </div>
      )
      lblcnfPassword = (<div className='col-md-3' ref={ constants.LBLCONFIRMPASSWORD }><label id={ constants.CONFIRMPASSWORD_LABEL } className='control-label'>{ constants.CONFIRMPASSWORD }</label></div>)
      inputcnfPassword = (
          <div className='col-md-9 form-group' ref={ constants.INPUT_CONFIRM_PASSWORD }>
              <input className={classNames({'form-control': true, 'password': true, 'BorderRed': this.props.validateUser.ConfirmPassword})} type='password' name={ constants.CONFIRM_PASSWORD } ref={ constants.CONFIRM_PASSWORD } pattern='[a-zA-Z0-9@#$%^&*]{8,}$' value={ this.state.userRecord.ConfirmPassword ? this.state.userRecord.ConfirmPassword : '' } onChange={ this.handleChange } required />
              <div className={classNames({'error': this.props.validateUser.ConfirmPassword, 'displayNone': !this.props.validateUser.ConfirmPassword})} id={ constants.CONFIRMPASSWORD_ERROR }></div>
          </div>
      )
      txtEmail = (<input className={classNames({'form-control': true, 'password': true, 'BorderRed': this.props.validateUser.Email})} type='email' name={ constants.EMAIL } ref={ constants.EMAIL } pattern="[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?" value={ this.state.userRecord.Email ? this.state.userRecord.Email : '' } onChange={ this.handleChange } required />)
    }

    if (this.props.user !== undefined && this.props.user.length !== 0) {
      checkbox = (<input type='checkbox' checked={ this.props.user.IsActive } onChange={ this.changeIsActive } />)
    }
    else {
      if (this.state.userRecord !== undefined) {
        if (this.state.userRecord.IsActive === true) {
          checkbox = (<input type='checkbox' checked={ true } onChange={ this.changeIsActive } />)
        }
        else {
          checkbox = (<input type='checkbox' checked={ false } onChange={ this.changeIsActive } />)
        }
      }
    }
    return (
      <div className='form-group col-md-12'>
          <div className='col-md-3'>
              <label id={ constants.FIRSTNAME_LABEL } className='control-label'>{ constants.FIRSTNAME }</label>
          </div>
          <div className='col-md-9 form-group'>
              <input className={classNames({'form-control': true, 'BorderRed': this.props.validateUser.FirstName})} type='text' name={ constants.FIRST_NAME } ref={ constants.FIRST_NAME } onKeyPress={ (e) => this.alphaOnly(e) } value={ this.state.userRecord.FirstName ? this.state.userRecord.FirstName : '' } onChange={ this.handleChange } autoFocus required />
              <div className={classNames({'error': this.props.validateUser.FirstName, 'displayNone': !this.props.validateUser.FirstName})} id={ constants.FIRSTNAME_ERROR }>{ constants.REQUIRED_MESSAGE +' '+ constants.FIRSTNAME }</div>
          </div>

          <div className='col-md-3'>
              <label id={ constants.LASTNAME_LABEL } className='control-label'>{ constants.LASTNAME }</label>
          </div>
          <div className='col-md-9 form-group'>
              <input className={classNames({'form-control': true, 'BorderRed': this.props.validateUser.LastName})} type='text' name={ constants.LAST_NAME } ref={ constants.LAST_NAME } onKeyPress={ (e) => this.alphaOnly(e) } value={ this.state.userRecord.LastName ? this.state.userRecord.LastName : '' } onChange={ this.handleChange } required />
              <div className={classNames({'error': this.props.validateUser.LastName, 'displayNone': !this.props.validateUser.LastName})} id={ constants.LASTNAME_ERROR }>{ constants.REQUIRED_MESSAGE +' '+ constants.LASTNAME }</div>
          </div>

          <div className='col-md-3'>
              <label id={ constants.CONTACTNUMBER_LABEL } className='control-label'>{ constants.CONTACTNUMBER }</label>
          </div>
          <div className='col-md-9 form-group'>
              <input className={classNames({'form-control': true, 'BorderRed': this.props.validateUser.ContactNumber})} type='text' name={ constants.CONTACT_NUMBER } ref={ constants.CONTACT_NUMBER } onKeyPress={ (e) => this.numericOnly(e) } pattern='^\d{10}$' value={ this.state.userRecord.ContactNumber ? this.state.userRecord.ContactNumber : '' } onChange={ this.handleChange } required />
              <div className={classNames({'error': this.props.validateUser.ContactNumber, 'displayNone': !this.props.validateUser.ContactNumber})} id={ constants.CONTACTNUMBER_ERROR }></div>
          </div>

          <div className='col-md-3'>
              <label id={ constants.EMAIL_LABEL } className='control-label'>{ constants.EMAIL }</label>
          </div>
          <div className='col-md-9 form-group' ref={ constants.INPUT_EMAIL }>
              {txtEmail}
              <div className={classNames({'error': this.props.validateUser.Email, 'displayNone': !this.props.validateUser.Email})} id={ constants.EMAIL_ERROR }></div>
          </div>

          {lblPassword}
          {inputPassword}

          {lblcnfPassword}
          {inputcnfPassword}

          <div className='col-md-3'>
              <label className='control-label'>{ constants.STATUS }</label>
          </div>
          <div className='col-md-9 form-group'>
              { checkbox }
          </div>
      </div>
    );
  }
}