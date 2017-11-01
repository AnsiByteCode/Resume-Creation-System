import React from 'react';
import databaseActions from '../../actions/DatabaseActions';
import constants from '../../constants/Constants';
import classNames from 'classnames';
var databaseData = [];
let checkbox;

export default class DatabaseForm extends React.Component {
  constructor() {
    super();
    this.state = { database: [] };
    this.handleChange = this.handleChange.bind(this);
    this.save = this.save.bind(this);
    this.changeIsActive = this.changeIsActive.bind(this);
  }
  componentDidMount() {
    databaseData = [];
    databaseData['IsActive'] = true;
    this.setState({ database: databaseData });
  }
  componentWillReceiveProps(props) {
    if (props.database !== undefined && props.database !== this.state.database && props.database.length !== 0) {
      this.setState({ database: props.database }, function() {
        databaseData = this.state.database;
      });
    }
  }
  handleChange(e) {
    e.target.value = e.target.value.replace(/^\s+/, '');
    const currentState = this.props.validateDatabase;
    databaseData[e.target.name] = e.target.value;
    if(e.target.value === '') {
      currentState[e.target.name] = true;
    }
    else {
      currentState[e.target.name] = false;
    }

    this.setState({ validateDatabase : currentState });
    this.setState({ database : databaseData });
  }
  save() {
    if (this.state.database._id) {
      databaseActions.databaseUpdate(this.state.database);
      if (this.props.onSaved) {
        this.props.onSaved();
      }
    }
    else {
      databaseActions.databaseInsert(this.state.database);
    }
  }
  changeIsActive(e) {
    databaseData['IsActive'] = e.target.checked;
    this.setState({ database : databaseData });
  }
  render() {
    if (this.props.database !== undefined && this.props.database.length !== 0) {
      checkbox = (<input type='checkbox' checked={ this.props.database.IsActive } onChange={ this.changeIsActive } />)
    }
    else {
      if (this.state.database !== undefined) {
        if (this.state.database.IsActive === true) {
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
              <label id={ constants.DATABASENAME_LABEL } className='control-label'>{ constants.DATABASE }</label>
          </div>
          <div className='col-md-9 form-group'>
              <input className={classNames({'form-control': true, 'BorderRed': this.props.validateDatabase.DatabaseName})} type='text' name={ constants.DATABASENAME } ref={ constants.DATABASENAME } value={ this.state.database.DatabaseName ? this.state.database.DatabaseName : '' } onChange={ this.handleChange } autoFocus required />
              <div className={classNames({'error': this.props.validateDatabase.DatabaseName, 'displayNone': !this.props.validateDatabase.DatabaseName})} id={ constants.DATABASENAME_ERROR }>{ constants.REQUIRED_MESSAGE +' '+ constants.DATABASE }</div>
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