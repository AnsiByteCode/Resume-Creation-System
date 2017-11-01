import React from 'react';
import frameworkActions from '../../actions/FrameworkActions';
import constants from '../../constants/Constants';
import classNames from 'classnames';
var frameworkData = [];
let checkbox;

export default class FrameworkForm extends React.Component {
  constructor() {
    super();
    this.state = { framework: [] };
    this.handleChange = this.handleChange.bind(this);
    this.save = this.save.bind(this);
    this.changeIsActive = this.changeIsActive.bind(this);
  }
  componentDidMount() {
    frameworkData = [];
    frameworkData['IsActive'] = true;
    this.setState({ framework: frameworkData });
  }
  componentWillReceiveProps(props) {
    if (props.framework !== undefined && props.framework !== this.state.framework && props.framework.length !== 0) {
      this.setState({ framework: props.framework }, function() {
        frameworkData = this.state.framework;
      });
    }
  }
  handleChange(e) {
    e.target.value = e.target.value.replace(/^\s+/, '');
    const currentState = this.props.validateFramework;
    frameworkData[e.target.name] = e.target.value;
    if(e.target.value === '') {
      currentState[e.target.name] = true;
    }
    else {
      currentState[e.target.name] = false;
    }

    this.setState({ validateFramework : currentState });
    this.setState({ framework : frameworkData });
  }
  save() {
    if (this.state.framework._id) {
      frameworkActions.frameworkUpdate(this.state.framework);
      if (this.props.onSaved) {
        this.props.onSaved();
      }
    }
    else {
      frameworkActions.frameworkInsert(this.state.framework);
    }
  }
  changeIsActive(e) {
    frameworkData['IsActive'] = e.target.checked;
    this.setState({ framework : frameworkData });
  }
  render() {
    if (this.props.framework !== undefined && this.props.framework.length !== 0) {
      checkbox = (<input type='checkbox' checked={ this.props.framework.IsActive } onChange={ this.changeIsActive } />)
    }
    else {
      if (this.state.framework !== undefined) {
        if (this.state.framework.IsActive === true) {
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
              <label id={ constants.FRAMEWORKNAME_LABEL } className='control-label'>{ constants.FRAMEWORK }</label>
          </div>
          <div className='col-md-9 form-group'>
              <input className={classNames({'form-control': true, 'BorderRed': this.props.validateFramework.FrameworkName})} type='text' name={ constants.FRAMEWORKNAME } ref={ constants.FRAMEWORKNAME } value={ this.state.framework.FrameworkName ? this.state.framework.FrameworkName : '' } onChange={ this.handleChange } autoFocus required />
              <div className={classNames({'error': this.props.validateFramework.FrameworkName, 'displayNone': !this.props.validateFramework.FrameworkName})} id={ constants.FRAMEWORKNAME_ERROR }>{ constants.REQUIRED_MESSAGE +' '+ constants.FRAMEWORK }</div>
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