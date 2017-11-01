import React from 'react';
import applicationActions from '../../actions/ApplicationActions';
import constants from '../../constants/Constants';
import classNames from 'classnames';
var applicationData = [];
let checkbox;

export default class ApplicationForm extends React.Component {
  constructor() {
    super();
    this.state = { application: [] };
    this.handleChange = this.handleChange.bind(this);
    this.save = this.save.bind(this);
    this.changeIsActive = this.changeIsActive.bind(this);
  }
  componentDidMount() {
    applicationData = [];
    applicationData['IsActive'] = true;
    this.setState({ application: applicationData });
  }
  componentWillReceiveProps(props) {
    if (props.application !== undefined && props.application !== this.state.application && props.application.length !== 0) {
      this.setState({ application: props.application }, function() {
        applicationData = this.state.application;
      });
    }
  }
  handleChange(e) {
    e.target.value = e.target.value.replace(/^\s+/, '');
    const currentState = this.props.validateApplication;
    applicationData[e.target.name] = e.target.value;
    if(e.target.value === '') {
      currentState[e.target.name] = true;
    }
    else {
      currentState[e.target.name] = false;
    }

    this.setState({ validateApplication : currentState });
    this.setState({ application : applicationData });
  }
  save() {
    if (this.state.application._id) {
      applicationActions.applicationUpdate(this.state.application);
      if (this.props.onSaved) {
        this.props.onSaved();
      }
    }
    else {
      applicationActions.applicationInsert(this.state.application);
    }
  }
  changeIsActive(e) {
    applicationData['IsActive'] = e.target.checked;
    this.setState({ application : applicationData });
  }
  render() {
    if (this.props.application !== undefined && this.props.application.length !== 0) {
      checkbox = (<input type='checkbox' checked={ this.props.application.IsActive } onChange={ this.changeIsActive } />)
    }
    else {
      if (this.state.application !== undefined) {
        if (this.state.application.IsActive === true) {
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
              <label id={ constants.APPLICATIONNAME_LABEL } className='control-label'>{ constants.APPLICATION }</label>
          </div>
          <div className='col-md-9 form-group'>
              <input className={classNames({'form-control': true, 'BorderRed': this.props.validateApplication.ApplicationName})} type='text' name={ constants.APPLICATIONNAME } ref={ constants.APPLICATIONNAME } value={ this.state.application.ApplicationName ? this.state.application.ApplicationName : '' } onChange={ this.handleChange } autoFocus required />
              <div className={classNames({'error': this.props.validateApplication.ApplicationName, 'displayNone': !this.props.validateApplication.ApplicationName})} id={ constants.APPLICATIONNAME_ERROR }>{ constants.REQUIRED_MESSAGE +' '+ constants.APPLICATION }</div>
          </div>

          <div className='col-md-3'>
              <label id={ constants.STATUS_LABEL } className='control-label'>{ constants.STATUS }</label>
          </div>
          <div className='col-md-9 form-group'>
              { checkbox }
          </div>
      </div>
    );
  }
}