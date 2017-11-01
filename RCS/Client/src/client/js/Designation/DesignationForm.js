import React from 'react';
import designationActions from '../../actions/DesignationActions';
import constants from '../../constants/Constants';
import classNames from 'classnames';
var designationData = [];
let checkbox;

export default class DesignationForm extends React.Component {
  constructor() {
    super();
    this.state = { designation: [] };
    this.handleChange = this.handleChange.bind(this);
    this.save = this.save.bind(this);
    this.changeIsActive = this.changeIsActive.bind(this);
  }
  componentDidMount() {
    designationData = [];
    designationData['IsActive'] = true;
    this.setState({ designation: designationData });
  }
  componentWillReceiveProps(props) {
    if (props.designation !== undefined && props.designation !== this.state.designation && props.designation.length !== 0) {
      this.setState({ designation: props.designation }, function() {
        designationData = this.state.designation;
      });
    }
  }
  handleChange(e) {
    e.target.value = e.target.value.replace(/^\s+/, '');
    const currentState = this.props.validateDesignation;
    designationData[e.target.name] = e.target.value;
    if(e.target.value === '') {
      currentState[e.target.name] = true;
    }
    else {
      currentState[e.target.name] = false;
    }

    this.setState({ validateDesignation : currentState });
    this.setState({ designation : designationData });
  }
  save() {
    if (this.state.designation._id) {
      designationActions.designationUpdate(this.state.designation);
      if (this.props.onSaved) {
        this.props.onSaved();
      }
    }
    else {
      designationActions.designationInsert(this.state.designation);
    }
  }
  changeIsActive(e) {
    designationData['IsActive'] = e.target.checked;
    this.setState({ designation : designationData });
  }
  render() {
    if (this.props.designation !== undefined && this.props.designation.length !== 0) {
      checkbox = (<input type='checkbox' checked={ this.props.designation.IsActive } onChange={ this.changeIsActive } />)
    }
    else {
      if (this.state.designation !== undefined) {
        if (this.state.designation.IsActive === true) {
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
              <label id={ constants.DESIGNATIONNAME_LABEL } className='control-label'>{ constants.DESIGNATION }</label>
          </div>
          <div className='col-md-9 form-group'>
              <input className={classNames({'form-control': true, 'BorderRed': this.props.validateDesignation.DesignationName})} type='text' name={ constants.DESIGNATIONNAME } ref={ constants.DESIGNATIONNAME } value={ this.state.designation.DesignationName ? this.state.designation.DesignationName : '' } onChange={ this.handleChange } autoFocus required />
              <div className={classNames({'error': this.props.validateDesignation.DesignationName, 'displayNone': !this.props.validateDesignation.DesignationName})} id={ constants.DESIGNATIONNAME_ERROR }>{ constants.REQUIRED_MESSAGE +' '+ constants.DESIGNATION }</div>
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