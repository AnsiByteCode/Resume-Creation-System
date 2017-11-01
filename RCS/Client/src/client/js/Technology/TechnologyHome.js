import React from 'react';
import { HomeHeader } from '../components/PageHeader';
import TechnologyFormWindow from './TechnologyFormWindow';
import TechnologyFormWrapper from './TechnologyFormWrapper';
import TechnologyList from './TechnologyList';
import { NotificationManager } from 'react-notifications';
import technologyStore from '../../stores/TechnologyStore';
import technologyActions from '../../actions/TechnologyActions';
import constants from '../../constants/Constants';

export default class TechnologyHome extends React.Component {
  constructor() {
    super();
    this.state = { technologies: [], technologyList: [], technology: [], addingTechnology: false, updateTechnology: false };
    this.newHandler = this.newHandler.bind(this);
    this.onTechnologyStoreChange = this.onTechnologyStoreChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
  }
  componentDidMount() {
    technologyStore.addChangeListener(this.onChange);
    technologyStore.addChangeListener(this.onTechnologyStoreChange);
    technologyActions.getAllTechnologies();
  }
  componentWillUnmount() {
    technologyStore.removeChangeListener(this.onChange);
    technologyStore.removeChangeListener(this.onTechnologyStoreChange);
  }
  newHandler() {
    this.setState({ addingTechnology: true });
  }
  onTechnologyStoreChange() {
    this.setState({ technologies: technologyStore.getTechnologies() });
    this.setState({ technology: technologyStore.getTechnology() }, function() {
      this.setState({ updateTechnology: technologyStore.getTechnologyStatus() });
    });

    var technologyList = this.state.technologies;
    for (var i = 0; i < technologyList.length; i++) {
      if (technologyList[i].IsActive === true || technologyList[i].IsActive === constants.LBL_ACTIVE) {
        technologyList[i].IsActive = constants.LBL_ACTIVE;
      }
      else {
        technologyList[i].IsActive = constants.LBL_INACTIVE;
      }
    }

    this.setState({ technologyList: technologyList });
  }
  onChange() {
    if (this.state.addingTechnology) {
      this.setState({ addingTechnology: false });
      this.setState({ technologyInsertStatus : technologyStore.getTechnologyInsertStatus() }, function() {
        if (this.state.technologyInsertStatus === constants.CONFLICT) {
          NotificationManager.error(constants.TECHNOLOGY_EXIST, '', 2000);
          technologyStore.resetStatus();
        }
        else if (this.state.technologyInsertStatus === constants.OK) {
          NotificationManager.success(constants.INSERT_SUCCESS_MESSAGE, '', 2000);
          technologyStore.resetStatus();
        }
      });
    }

    if (this.state.updateTechnology) {
      this.setState({ updateTechnology: false });
      this.setState({ technologyUpdateStatus: technologyStore.getTechnologyUpdateStatus() }, function() {
        if (this.state.technologyUpdateStatus === constants.CONFLICT) {
          NotificationManager.error(constants.TECHNOLOGY_EXIST, '', 2000);
          technologyStore.resetStatus();
        }
        else if (this.state.technologyUpdateStatus === constants.OK) {
          NotificationManager.success(constants.UPDATE_SUCCESS_MESSAGE, '', 2000);
          technologyStore.resetStatus();
        }
      });
    }
  }
  cancelHandler() {
    this.setState({ addingTechnology: false, updateTechnology: false });
  }
  render() {
    return (
      <div>
          <HomeHeader newLabel={ constants.NEW_TECHNOLOGY }
                      actions={[{ value: constants.LBL_NEW, label: constants.NEW_TECHNOLOGY }]}
                      itemCount={ this.state.technologies.length }
                      views={[{ id: 1, name: constants.TECHNOLOGY_LIST }]}
                      viewId={ constants.LBL_ONE }
                      onNew={ this.newHandler } />
          <TechnologyList technologies={ this.state.technologyList } />
          { this.state.addingTechnology ? <TechnologyFormWindow onCancel={ this.cancelHandler } /> : null }
          { this.state.updateTechnology ? <TechnologyFormWrapper technology={ this.state.technology } onCancel={ this.cancelHandler } /> : null }
      </div>
    );
  }
}