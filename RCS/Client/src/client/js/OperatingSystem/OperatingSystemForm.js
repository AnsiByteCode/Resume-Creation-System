import React from 'react';
import operatingSystemActions from '../../actions/OperatingSystemActions';
import constants from '../../constants/Constants';
import classNames from 'classnames';
var operatingSystemData = [];
let checkbox;

export default class OperatingSystemForm extends React.Component {
  constructor() {
    super();
    this.state = { operatingSystem: [] };
    this.handleChange = this.handleChange.bind(this);
    this.save = this.save.bind(this);
    this.changeIsActive = this.changeIsActive.bind(this);
  }
  componentDidMount() {
    operatingSystemData = [];
    operatingSystemData['IsActive'] = true;
    this.setState({ operatingSystem: operatingSystemData });
  }
  componentWillReceiveProps(props) {
    if (props.operatingSystem !== undefined && props.operatingSystem !== this.state.operatingSystem && props.operatingSystem.length !== 0) {
      this.setState({ operatingSystem: props.operatingSystem }, function() {
        operatingSystemData = this.state.operatingSystem;
      });
    }
  }
  handleChange(e) {
    e.target.value = e.target.value.replace(/^\s+/, '');
    const currentState = this.props.validateOperatingSystem;
    operatingSystemData[e.target.name] = e.target.value;
    if(e.target.value === '') {
      currentState[e.target.name] = true;
    }
    else {
      currentState[e.target.name] = false;
    }

    this.setState({ validateOperatingSystem : currentState });
    this.setState({ operatingSystem : operatingSystemData });
  }
  save() {
    if (this.state.operatingSystem._id) {
      operatingSystemActions.operatingSystemUpdate(this.state.operatingSystem);
      if (this.props.onSaved) {
        this.props.onSaved();
      }
    }
    else {
      operatingSystemActions.operatingSystemInsert(this.state.operatingSystem);
    }
  }
  changeIsActive(e) {
    operatingSystemData['IsActive'] = e.target.checked;
    this.setState({ operatingSystem : operatingSystemData });
  }
  render() {
    if (this.props.operatingSystem !== undefined && this.props.operatingSystem.length !== 0) {
      checkbox = (<input type='checkbox' checked={ this.props.operatingSystem.IsActive } onChange={ this.changeIsActive } />)
    }
    else
    {
      if (this.state.operatingSystem !== undefined) {
        if (this.state.operatingSystem.IsActive === true) {
          checkbox = (<input type='checkbox' checked={ true } onChange={ this.changeIsActive } />)
        }
        else {
          checkbox = (<input type='checkbox' checked={ false }  onChange={ this.changeIsActive } />)
        }
      }
    }
    return (
      <div className='form-group col-md-12'>
          <div className='col-md-3'>
              <label id={ constants.OPERATINGSYSTEMNAME_LABEL } className='control-label'>{ constants.OPERATINGSYSTEM }</label>
          </div>
          <div className='col-md-9 form-group'>
              <input className={classNames({'form-control': true, 'BorderRed': this.props.validateOperatingSystem.OperatingSystemName})} type='text' name={ constants.OPERATINGSYSTEMNAME } ref={ constants.OPERATINGSYSTEMNAME } value={ this.state.operatingSystem.OperatingSystemName ? this.state.operatingSystem.OperatingSystemName : '' } onChange={ this.handleChange } autoFocus required />
              <div className={classNames({'error': this.props.validateOperatingSystem.OperatingSystemName, 'displayNone': !this.props.validateOperatingSystem.OperatingSystemName})} id={ constants.OPERATINGSYSTEMNAME_ERROR }>{ constants.REQUIRED_MESSAGE +' '+ constants.OPERATINGSYSTEM }</div>
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