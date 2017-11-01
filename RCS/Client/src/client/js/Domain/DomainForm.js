import React from 'react';
import domainActions from '../../actions/DomainActions';
import constants from '../../constants/Constants';
import classNames from 'classnames';
var domainData = [];
let checkbox;

export default class DomainForm extends React.Component {
  constructor() {
    super();
    this.state = { domain: [] };
    this.handleChange = this.handleChange.bind(this);
    this.save = this.save.bind(this);
    this.changeIsActive = this.changeIsActive.bind(this);
  }
  componentDidMount() {
    domainData = [];
    domainData['IsActive'] = true;
    this.setState({ domain: domainData });
  }
  componentWillReceiveProps(props) {
    if (props.domain !== undefined && props.domain !== this.state.domain && props.domain.length !== 0) {
      this.setState({ domain: props.domain }, function() {
        domainData = this.state.domain;
      });
    }
  }
  handleChange(e) {
    e.target.value = e.target.value.replace(/^\s+/, '');
    const currentState = this.props.validateDomain;
    domainData[e.target.name] = e.target.value;
    if(e.target.value === '') {
      currentState[e.target.name] = true;
    }
    else {
      currentState[e.target.name] = false;
    }

    this.setState({ validateDomain : currentState });
    this.setState({ domain : domainData });
  }
  save() {
    if (this.state.domain._id) {
      domainActions.domainUpdate(this.state.domain);
      if (this.props.onSaved) {
        this.props.onSaved();
      }
    }
    else {
      domainActions.domainInsert(this.state.domain);
    }
  }
  changeIsActive(e) {
    domainData['IsActive'] = e.target.checked;
    this.setState({ domain : domainData });
  }
  render() {
    if (this.props.domain !== undefined && this.props.domain.length !== 0) {
      checkbox = (<input type='checkbox' checked={ this.props.domain.IsActive } onChange={ this.changeIsActive } />)
    }
    else {
      if (this.state.domain !== undefined) {
        if (this.state.domain.IsActive === true) {
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
              <label id={ constants.DOMAINNAME_LABEL } className='control-label'>{ constants.DOMAIN }</label>
          </div>
          <div className='col-md-9 form-group'>
              <input className={classNames({'form-control': true, 'BorderRed': this.props.validateDomain.DomainName})} type='text' name={ constants.DOMAINNAME } ref={ constants.DOMAINNAME } value={ this.state.domain.DomainName ? this.state.domain.DomainName : '' } onChange={ this.handleChange } autoFocus required />
              <div className={classNames({'error': this.props.validateDomain.DomainName, 'displayNone': !this.props.validateDomain.DomainName})} id={ constants.DOMAINNAME_ERROR }>{ constants.REQUIRED_MESSAGE +' '+ constants.DOMAIN }</div>
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