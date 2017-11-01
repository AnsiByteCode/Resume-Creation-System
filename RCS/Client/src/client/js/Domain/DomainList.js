import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { NotificationManager } from 'react-notifications';
import { confirm } from '../components/Confirm';
import { renderShowsTotal } from '../Common/Common';
import domainActions from '../../actions/DomainActions';
import domainStore from '../../stores/DomainStore';
import constants from '../../constants/Constants';

const LinkEditComponent = (props) => {
  const editHandler = () => {
    domainActions.getDomainById(props.rowData._id);
  };
  return (
    <a href='#' onClick={editHandler}><center><span className='glyphicon glyphicon-edit'></span></center></a>
  );
};

//// Delete link component
const LinkDeleteComponent = (props) => {
  const deleteHandler = () => {
    confirm(constants.DELETE_CONFIRMATION).then(() => {
      domainActions.domainDelete(props.rowData._id);
    });
  };
  return (
    <div>
      <a href='#' onClick={ deleteHandler }><center><span className='glyphicon glyphicon-remove'></span></center></a>
    </div>
  );
};

//// Edit method
const linkEditData = (cell, row) => {
  return (
    <LinkEditComponent rowData={ row } moduleUrl={constants.DOMAIN_URL} />
  );
};

//// Delete method
const linkDeleteData = (cell, row) => {
  return (
    <LinkDeleteComponent rowData={ row } />
  );
};

export default class DomainList extends React.Component {
  constructor() {
    super();
    this.onDeleteChange = this.onDeleteChange.bind(this);
  }
  componentDidMount() {
    domainStore.addChangeListener(this.onDeleteChange);
  }
  onDeleteChange() {
    this.setState({ domainDeleteStatus: domainStore.getDomainDeleteStatus() }, function() {
      if (this.state.domainDeleteStatus === constants.CONFLICT) {
        NotificationManager.error(constants.REFERENCE_EXIST_MESSAGE, '', 2000);
        domainStore.resetStatus();
      }
      else if (this.state.domainDeleteStatus === constants.OK) {
        NotificationManager.success(constants.DELETE_SUCCESS_MESSAGE, '', 2000);
        domainStore.resetStatus();
      }
    });
  }
  render() {
    const options = {
      page: 1,  // which page you want to show as default
      sizePerPageList: [{
        text: '5', value: 5
      }, {
        text: '10', value: 10
      }, {
        text: 'All', value: this.props.domains.length
      }], // you can change the dropdown list for size per page
      sizePerPage: 10,  // which size per page you want to locate as default
      pageStartIndex: 1, // where to start counting the pages
      paginationSize: 3,  // the pagination bar size.
      prePage: 'Prev', // Previous page button text
      nextPage: 'Next', // Next page button text
      firstPage: 'First', // First page button text
      lastPage: 'Last', // Last page button text
      paginationShowsTotal: renderShowsTotal,  // Accept bool or function
      hideSizePerPage: true // You can hide the dropdown for sizePerPage
    };
    return (
      <div>
          <BootstrapTable className='domainGrid' data={ this.props.domains } striped hover search pagination={ true } options={ options } searchPlaceholder={ constants.FILTER }>
              <TableHeaderColumn isKey hidden dataField='RowNumber' width='30%' headerAlign='center' dataAlign='center'>{ constants.SR }</TableHeaderColumn>
              <TableHeaderColumn dataField='link' dataFormat={ linkEditData } width='20' headerAlign='center'>{ constants.EDIT }</TableHeaderColumn>
              <TableHeaderColumn dataField='link' dataFormat={ linkDeleteData } width='20' headerAlign='center'>{ constants.DELETE }</TableHeaderColumn>
              <TableHeaderColumn dataField='DomainName' dataSort={ true } width='110'>{ constants.DOMAIN }</TableHeaderColumn>
              <TableHeaderColumn dataField='IsActive' width='30' headerAlign='center' dataAlign='center'>{ constants.STATUS }</TableHeaderColumn>
          </BootstrapTable>
      </div>
    );
  }
}