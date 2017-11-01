import React from 'react';
import { HomeHeader } from '../components/PageHeader';
import LanguageFormWindow from './LanguageFormWindow';
import LanguageFormWrapper from './LanguageFormWrapper';
import LanguageList from './LanguageList';
import { NotificationManager } from 'react-notifications';
import languageStore from '../../stores/LanguageStore';
import languageActions from '../../actions/LanguageActions';
import constants from '../../constants/Constants';

export default class LanguageHome extends React.Component {
  constructor() {
    super();
    this.state = { languages: [], languageList: [], language: [], addingLanguage: false, updateLanguage: false };
    this.newHandler = this.newHandler.bind(this);
    this.onLanguageStoreChange = this.onLanguageStoreChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
  }
  componentDidMount() {
    languageStore.addChangeListener(this.onChange);
    languageStore.addChangeListener(this.onLanguageStoreChange);
    languageActions.getAllLanguages();
  }
  componentWillUnmount() {
    languageStore.removeChangeListener(this.onChange);
    languageStore.removeChangeListener(this.onLanguageStoreChange);
  }
  newHandler() {
    this.setState({ addingLanguage: true });
  }
  onLanguageStoreChange() {
    this.setState({ languages: languageStore.getLanguages() });
    this.setState({ language: languageStore.getLanguage() }, function() {
      this.setState({ updateLanguage: languageStore.getLanguageStatus() });
    });

    var languageList = this.state.languages;
    for (var i = 0; i < languageList.length; i++) {
      if (languageList[i].IsActive === true || languageList[i].IsActive === constants.LBL_ACTIVE) {
        languageList[i].IsActive = constants.LBL_ACTIVE;
      }
      else {
        languageList[i].IsActive = constants.LBL_INACTIVE;
      }
    }

    this.setState({ languageList: languageList });
  }
  onChange() {
    if (this.state.addingLanguage) {
      this.setState({ addingLanguage: false });
      this.setState({ languageInsertStatus : languageStore.getLanguageInsertStatus() }, function() {
        if (this.state.languageInsertStatus === constants.CONFLICT) {
          NotificationManager.error(constants.LANGUAGE_EXIST, '', 2000);
          languageStore.resetStatus();
        }
        else if (this.state.languageInsertStatus === constants.OK) {
          NotificationManager.success(constants.INSERT_SUCCESS_MESSAGE, '', 2000);
          languageStore.resetStatus();
        }
      });
    }

    if (this.state.updateLanguage) {
      this.setState({ updateLanguage: false });
      this.setState({ languageUpdateStatus: languageStore.getLanguageUpdateStatus() }, function() {
        if (this.state.languageUpdateStatus === constants.CONFLICT) {
          NotificationManager.error(constants.LANGUAGE_EXIST, '', 2000);
          languageStore.resetStatus();
        }
        else if (this.state.languageUpdateStatus === constants.OK) {
          NotificationManager.success(constants.UPDATE_SUCCESS_MESSAGE, '', 2000);
          languageStore.resetStatus();
        }
      });
    }
  }
  cancelHandler() {
    this.setState({ addingLanguage: false, updateLanguage: false });
  }
  render() {
    return (
      <div>
          <HomeHeader newLabel={ constants.NEW_LANGUAGE }
                      actions={[{ value: constants.LBL_NEW, label: constants.NEW_LANGUAGE }]}
                      itemCount={ this.state.languages.length }
                      views={[{ id: 1, name: constants.LANGUAGE_LIST }]}
                      viewId={ constants.LBL_ONE }
                      onNew={ this.newHandler } />
          <LanguageList languages={ this.state.languageList } />
          { this.state.addingLanguage ? <LanguageFormWindow onCancel={ this.cancelHandler } /> : null }
          { this.state.updateLanguage ? <LanguageFormWrapper language={ this.state.language } onCancel={ this.cancelHandler } /> : null }
      </div>
    );
  }
}