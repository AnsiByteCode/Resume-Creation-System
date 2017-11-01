import React from 'react';
import { HomeHeader } from '../components/PageHeader';
import DomainFormWindow from './DomainFormWindow';
import DomainFormWrapper from './DomainFormWrapper';
import DomainList from './DomainList';
import { NotificationManager } from 'react-notifications';
import domainStore from '../../stores/DomainStore';
import domainActions from '../../actions/DomainActions';
import constants from '../../constants/Constants';

export default class DomainHome extends React.Component {
  constructor() {
    super();
    this.state = { domains: [], domainList: [], domain: [], addingDomain: false, updateDomain: false };
    this.newHandler = this.newHandler.bind(this);
    this.onDomainStoreChange = this.onDomainStoreChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
  }
  componentDidMount() {
    domainStore.addChangeListener(this.onChange);
    domainStore.addChangeListener(this.onDomainStoreChange);
    domainActions.getAllDomains();
  }
  componentWillUnmount() {
    domainStore.removeChangeListener(this.onChange);
    domainStore.removeChangeListener(this.onDomainStoreChange);
  }
  newHandler() {
    this.setState({ addingDomain: true });
  }
  onDomainStoreChange() {
    this.setState({ domains: domainStore.getDomains() });
    this.setState({ domain: domainStore.getDomain() }, function() {
      this.setState({ updateDomain: domainStore.getDomainStatus() });
    });

    var domainList = this.state.domains;
    for (var i = 0; i < domainList.length; i++) {
      if (domainList[i].IsActive === true || domainList[i].IsActive === constants.LBL_ACTIVE) {
        domainList[i].IsActive = constants.LBL_ACTIVE;
      }
      else {
        domainList[i].IsActive = constants.LBL_INACTIVE;
      }
    }

    this.setState({ domainList: domainList });
  }
  onChange() {
    if (this.state.addingDomain) {
      this.setState({ addingDomain: false });
      this.setState({ domainInsertStatus : domainStore.getDomainInsertStatus() }, function() {
        if (this.state.domainInsertStatus === constants.CONFLICT) {
          NotificationManager.error(constants.DOMAIN_EXIST, '', 2000);
          domainStore.resetStatus();
        }
        else if (this.state.domainInsertStatus === constants.OK) {
          NotificationManager.success(constants.INSERT_SUCCESS_MESSAGE, '', 2000);
          domainStore.resetStatus();
        }
      });
    }

    if (this.state.updateDomain) {
      this.setState({ updateDomain: false });
      this.setState({ domainUpdateStatus: domainStore.getDomainUpdateStatus() }, function() {
        if (this.state.domainUpdateStatus === constants.CONFLICT) {
          NotificationManager.error(constants.DOMAIN_EXIST, '', 2000);
          domainStore.resetStatus();
        }
        else if (this.state.domainUpdateStatus === constants.OK) {
          NotificationManager.success(constants.UPDATE_SUCCESS_MESSAGE, '', 2000);
          domainStore.resetStatus();
        }
      });
    }
  }
  cancelHandler() {
    this.setState({ addingDomain: false, updateDomain: false });
  }
  render() {
    return (
      <div>
          <HomeHeader newLabel={ constants.NEW_DOMAIN }
                      actions={[{ value: constants.LBL_NEW, label: constants.NEW_DOMAIN }]}
                      itemCount={ this.state.domains.length }
                      views={[{ id: 1, name: constants.DOMAIN_LIST }]}
                      viewId={ constants.LBL_ONE }
                      onNew={ this.newHandler } />
          <DomainList domains={ this.state.domainList } />
          { this.state.addingDomain ? <DomainFormWindow onCancel={ this.cancelHandler } /> : null }
          { this.state.updateDomain ? <DomainFormWrapper domain={ this.state.domain } onCancel={ this.cancelHandler } /> : null }
      </div>
    );
  }
}