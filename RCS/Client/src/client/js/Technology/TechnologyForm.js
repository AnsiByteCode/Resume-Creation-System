import React from 'react';
import technologyActions from '../../actions/TechnologyActions';
import constants from '../../constants/Constants';
import classNames from 'classnames';
var technologyData = [];
let checkbox;

export default class TechnologyForm extends React.Component {
  constructor() {
    super();
    this.state = { technology: [] };
    this.handleChange = this.handleChange.bind(this);
    this.save = this.save.bind(this);
    this.changeIsActive = this.changeIsActive.bind(this);
  }
  componentDidMount() {
    technologyData = [];
    technologyData['IsActive'] = true;
    this.setState({ technology: technologyData });
  }
  componentWillReceiveProps(props) {
    if (props.technology !== undefined && props.technology !== this.state.technology && props.technology.length !== 0) {
      this.setState({ technology: props.technology }, function() {
        technologyData = this.state.technology;
      });
    }
  }
  handleChange(e) {
    e.target.value = e.target.value.replace(/^\s+/, '');
    const currentState = this.props.validateTechnology;
    technologyData[e.target.name] = e.target.value;
    if(e.target.value === '') {
      currentState[e.target.name] = true;
    }
    else {
      currentState[e.target.name] = false;
    }

    this.setState({ validateTechnology : currentState });
    this.setState({ technology : technologyData });
  }
  save() {
    if (this.state.technology._id) {
      technologyActions.technologyUpdate(this.state.technology);
      if (this.props.onSaved) {
        this.props.onSaved();
      }
    }
    else {
      technologyActions.technologyInsert(this.state.technology);
    }
  }
  changeIsActive(e) {
    technologyData['IsActive'] = e.target.checked;
    this.setState({ technology : technologyData });
  }
  render() {
    if (this.props.technology !== undefined && this.props.technology.length !== 0) {
      checkbox = (<input type='checkbox' checked={ this.props.technology.IsActive } onChange={ this.changeIsActive } />)
    }
    else {
      if (this.state.technology !== undefined) {
        if (this.state.technology.IsActive === true) {
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
              <label id={ constants.TECHNOLOGYNAME_LABEL } className='control-label'>{ constants.TECHNOLOGY }</label>
          </div>
          <div className='col-md-9 form-group'>
              <input className={classNames({'form-control': true, 'BorderRed': this.props.validateTechnology.TechnologyName})} type='text' name={ constants.TECHNOLOGYNAME } ref={ constants.TECHNOLOGYNAME } value={ this.state.technology.TechnologyName ? this.state.technology.TechnologyName : '' } onChange={ this.handleChange } autoFocus required />
              <div className={classNames({'error': this.props.validateTechnology.TechnologyName, 'displayNone': !this.props.validateTechnology.TechnologyName})} id={ constants.TECHNOLOGYNAME_ERROR }>{ constants.REQUIRED_MESSAGE +' '+ constants.TECHNOLOGY }</div>
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