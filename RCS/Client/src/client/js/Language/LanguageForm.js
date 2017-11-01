import React from 'react';
import languageActions from '../../actions/LanguageActions';
import constants from '../../constants/Constants';
import classNames from 'classnames';
var languageData = [];
let checkbox;

export default class LanguageForm extends React.Component {
  constructor() {
    super();
    this.state = { language: [] };
    this.handleChange = this.handleChange.bind(this);
    this.save = this.save.bind(this);
    this.changeIsActive = this.changeIsActive.bind(this);
  }
  componentDidMount() {
    languageData = [];
    languageData['IsActive'] = true;
    this.setState({ language: languageData });
  }
  componentWillReceiveProps(props) {
    if (props.language !== undefined && props.language !== this.state.language && props.language.length !== 0) {
      this.setState({ language: props.language }, function() {
        languageData = this.state.language;
      });
    }
  }
  handleChange(e) {
    e.target.value = e.target.value.replace(/^\s+/, '');
    const currentState = this.props.validateLanguage;
    languageData[e.target.name] = e.target.value;
    if(e.target.value === '') {
      currentState[e.target.name] = true;
    }
    else {
      currentState[e.target.name] = false;
    }

    this.setState({ validateLanguage : currentState });
    this.setState({ language : languageData });
  }
  save() {
    if (this.state.language._id) {
      languageActions.languageUpdate(this.state.language);
      if (this.props.onSaved) {
        this.props.onSaved();
      }
    }
    else {
      languageActions.languageInsert(this.state.language);
    }
  }
  changeIsActive(e) {
    languageData['IsActive'] = e.target.checked;
    this.setState({ language : languageData });
  }
  render() {
    if (this.props.language !== undefined && this.props.language.length !== 0) {
      checkbox = (<input type='checkbox' checked={ this.props.language.IsActive } onChange={ this.changeIsActive } />)
    }
    else {
      if (this.state.language !== undefined) {
        if (this.state.language.IsActive === true) {
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
              <label id={ constants.LANGUAGENAME_LABEL } className='control-label'>{ constants.LANGUAGE }</label>
          </div>
          <div className='col-md-9 form-group'>
              <input className={classNames({'form-control': true, 'BorderRed': this.props.validateLanguage.LanguageName})} type='text' name={ constants.LANGUAGENAME } ref={ constants.LANGUAGENAME } value={ this.state.language.LanguageName ? this.state.language.LanguageName : '' } onChange={ this.handleChange } autoFocus required />
              <div className={classNames({'error': this.props.validateLanguage.LanguageName, 'displayNone': !this.props.validateLanguage.LanguageName})} id={ constants.LANGUAGENAME_ERROR }>{ constants.REQUIRED_MESSAGE +' '+ constants.LANGUAGE }</div>
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