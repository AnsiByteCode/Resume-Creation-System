import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { NotificationManager } from 'react-notifications';
import { confirm } from '../components/Confirm';
import { renderShowsTotal } from '../Common/Common';
import projectActions from '../../actions/ProjectActions';
import projectStore from '../../stores/ProjectStore';
import constants from '../../constants/Constants';

const LinkEditComponent = (props) => {
  const editHandler = () => {
    projectActions.getProjectById(props.rowData._id);
  };
  return (
    <a href='#' onClick={editHandler}><center><span className='glyphicon glyphicon-edit'></span></center></a>
  );
};

//// Delete link component
const LinkDeleteComponent = (props) => {
  const deleteHandler = () => {
    confirm(constants.DELETE_CONFIRMATION).then(() => {
      projectActions.projectDelete(props.rowData._id);
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
    <LinkEditComponent rowData={ row } moduleUrl={constants.PROJECT_URL} />
  );
};

//// Delete method
const linkDeleteData = (cell, row) => {
  return (
    <LinkDeleteComponent rowData={ row } />
  );
};

export default class ProjectList extends React.Component {
  constructor() {
    super();
    this.onDeleteChange = this.onDeleteChange.bind(this);
  }
  componentDidMount() {
    projectStore.addChangeListener(this.onDeleteChange);
  }
  onDeleteChange() {
    this.setState({ projectDeleteStatus: projectStore.getProjectDeleteStatus() }, function() {
      if (this.state.projectDeleteStatus === constants.CONFLICT) {
        NotificationManager.error(constants.REFERENCE_EXIST_MESSAGE, '', 2000);
        projectStore.resetStatus();
      }
      else if (this.state.projectDeleteStatus === constants.OK) {
        NotificationManager.success(constants.DELETE_SUCCESS_MESSAGE, '', 2000);
        projectStore.resetStatus();
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
        text: 'All', value: this.props.projects.length
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
          <BootstrapTable className='projectGrid' data={ this.props.projects } striped hover search pagination={ true } options={ options } searchPlaceholder={ constants.FILTER }>
              <TableHeaderColumn isKey hidden dataField='RowNumber' width='10' headerAlign='center' dataAlign='center'>{ constants.SR }</TableHeaderColumn>
              <TableHeaderColumn dataField='link' dataFormat={ linkEditData } width='20' headerAlign='center'>{ constants.EDIT }</TableHeaderColumn>
              <TableHeaderColumn dataField='link' dataFormat={ linkDeleteData } width='20' headerAlign='center'>{ constants.DELETE }</TableHeaderColumn>
              <TableHeaderColumn dataField='ProjectName' dataSort={ true } width='50'>{ constants.PROJECT }</TableHeaderColumn>
              <TableHeaderColumn dataField='DomainName' dataSort={ true } width='30'>{ constants.DOMAIN }</TableHeaderColumn>
              <TableHeaderColumn dataField='OperatingSystemName' dataSort={ true } width='30'>{ constants.OPERATINGSYSTEM }</TableHeaderColumn>
              <TableHeaderColumn dataField='DatabaseName' dataSort={ true } width='30'>{ constants.DATABASE }</TableHeaderColumn>
              <TableHeaderColumn dataField='TechnologyName' dataSort={ true } width='30'>{ constants.TECHNOLOGY }</TableHeaderColumn>
              <TableHeaderColumn dataField='TeamSize' dataSort={ true } width='20' dataAlign='center'>{ constants.TEAMSIZE }</TableHeaderColumn>
              <TableHeaderColumn dataField='IsActive' width='20' headerAlign='center' dataAlign='center'>{ constants.STATUS }</TableHeaderColumn>
          </BootstrapTable>
      </div>
    );
  }
}