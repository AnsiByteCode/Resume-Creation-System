import React from 'react';
import { HomeHeader } from '../components/PageHeader';
import DesignationFormWindow from './DesignationFormWindow';
import DesignationFormWrapper from './DesignationFormWrapper';
import DesignationList from './DesignationList';
import { NotificationManager } from 'react-notifications';
import designationStore from '../../stores/DesignationStore';
import designationActions from '../../actions/DesignationActions';
import constants from '../../constants/Constants';

export default class DesignationHome extends React.Component {
  constructor() {
    super();
    this.state = { designations: [], designationList: [], designation: [], addingDesignation: false, updateDesignation: false };
    this.newHandler = this.newHandler.bind(this);
    this.onDesignationStoreChange = this.onDesignationStoreChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
  }
  componentDidMount() {
    designationStore.addChangeListener(this.onChange);
    designationStore.addChangeListener(this.onDesignationStoreChange);
    designationActions.getAllDesignations();
  }
  componentWillUnmount() {
    designationStore.removeChangeListener(this.onChange);
    designationStore.removeChangeListener(this.onDesignationStoreChange);
  }
  newHandler() {
    this.setState({ addingDesignation: true });
  }
  onDesignationStoreChange() {
    this.setState({ designations: designationStore.getDesignations() });
    this.setState({ designation: designationStore.getDesignation() }, function() {
      this.setState({ updateDesignation: designationStore.getDesignationStatus() });
    });

    var designationList = this.state.designations;
    for (var i = 0; i < designationList.length; i++) {
      if (designationList[i].IsActive === true || designationList[i].IsActive === constants.LBL_ACTIVE) {
        designationList[i].IsActive = constants.LBL_ACTIVE;
      }
      else {
        designationList[i].IsActive = constants.LBL_INACTIVE;
      }
    }

    this.setState({ designationList: designationList });
  }
  onChange() {
    if (this.state.addingDesignation) {
      this.setState({ addingDesignation: false });
      this.setState({ designationInsertStatus : designationStore.getDesignationInsertStatus() }, function() {
        if (this.state.designationInsertStatus === constants.CONFLICT) {
          NotificationManager.error(constants.DESIGNATION_EXIST, '', 2000);
          designationStore.resetStatus();
        }
        else if (this.state.designationInsertStatus === constants.OK) {
          NotificationManager.success(constants.INSERT_SUCCESS_MESSAGE, '', 2000);
          designationStore.resetStatus();
        }
      });
    }

    if (this.state.updateDesignation) {
      this.setState({ updateDesignation: false });
      this.setState({ designationUpdateStatus: designationStore.getDesignationUpdateStatus() }, function() {
        if (this.state.designationUpdateStatus === constants.CONFLICT) {
          NotificationManager.error(constants.DESIGNATION_EXIST, '', 2000);
          designationStore.resetStatus();
        }
        else if (this.state.designationUpdateStatus === constants.OK) {
          NotificationManager.success(constants.UPDATE_SUCCESS_MESSAGE, '', 2000);
          designationStore.resetStatus();
        }
      });
    }
  }
  cancelHandler() {
    this.setState({ addingDesignation: false, updateDesignation: false });
  }
  render() {
    return (
      <div>
          <HomeHeader newLabel={ constants.NEW_DESIGNATION }
                      actions={[{ value: constants.LBL_NEW, label: constants.NEW_DESIGNATION }]}
                      itemCount={ this.state.designations.length }
                      views={[{ id: 1, name: constants.DESIGNATION_LIST }]}
                      viewId={ constants.LBL_ONE }
                      onNew={ this.newHandler } />
          <DesignationList designations={ this.state.designationList } />
          { this.state.addingDesignation ? <DesignationFormWindow onCancel={ this.cancelHandler } /> : null }
          { this.state.updateDesignation ? <DesignationFormWrapper designation={ this.state.designation } onCancel={ this.cancelHandler } /> : null }
      </div>
    );
  }
}