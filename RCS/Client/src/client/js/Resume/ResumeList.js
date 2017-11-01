import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { NotificationManager } from 'react-notifications';
import constants from './../../constants/Constants';
import { confirm } from './../components/Confirm';
import { LinkEditComponent, renderShowsTotal } from '../Common/Common.js';
import axios from 'axios';
import appConstants from './../../constants/AppConstants';
import resumeAction from './../../actions/ResumeAction';
import resumeStore from './../../stores/ResumeStore';

// Resume download link component
const LinkResumeComponent = (props) => {
    const resumeDownloadHandler = () => {
        var candidateName = props.rowData['CandidateName'];
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.RESUMEDOWNLOAD +'/'+ props.rowData['CandidateName'],
            method: 'GET',
            crossOrigin: true
        })
        .then(function (resume) {
          if (resume.data == null)
          {
                NotificationManager.error(constants.RESUME_NOT_EXIST, '', 2000);
          }
          else {
                window.open(appConstants.RESUMEDOWNLOAD + '/' + candidateName,'_self');
          }

          document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    };
    return (
      <a href='#' onClick={ resumeDownloadHandler }><center><span className='glyphicon glyphicon-save'></span></center></a>
    );
};

///// Resume Create link component
const LinkResumeCreationComponent = (props) => {
    const resumeCreateHandler = () => {
      resumeAction.resumeCreation(props.rowData._id);
    };
    return (
         <a href='#' onClick={ resumeCreateHandler }><center><span className='glyphicon glyphicon-open-file'></span></center></a>
    );
};

//// Delete link component
const LinkDeleteComponent = (props) => {
    const deleteHandler = () => {
        confirm(constants.DELETE_CONFIRMATION).then(() => {
            resumeAction.resumeDelete(props.rowData._id);
        });
    };
    return (
        <div>
            <a href='#' onClick={ deleteHandler }><center><span className='glyphicon glyphicon-remove'></span></center></a>
        </div>
    );
};

//// Edit method
function linkEditData(cell, row) {
    return (
        <LinkEditComponent rowData={ row } moduleUrl={constants.RESUME_URL} />
    );
}

//// Delete method
function linkDeleteData(cell, row) {
    return (
        <LinkDeleteComponent rowData={ row } />
    );
}

function linkResumeCreationData(cell, row) {
    if (row.Resume !== null) {
        return (
            <LinkResumeCreationComponent rowData={ row } />
        );
    }
}

function linkResumeData(cell, row) {
    if (row.Resume !== null) {
        return (
            <LinkResumeComponent rowData={ row } />
        );
    }
}

export default class ResumeList extends React.Component {
    constructor() {
        super();
        this.onDeleteChange = this.onDeleteChange.bind(this);
    }
    componentDidMount() {
        resumeStore.addChangeListener(this.onDeleteChange);
    }
    onDeleteChange() {
        this.setState({
            resumeDeleteStatus: resumeStore.getResumeDeleteStatus()
        }, function() {
              if (this.state.resumeDeleteStatus === constants.CONFLICT)
              {
                  NotificationManager.error(constants.REFERENCE_EXIST_MESSAGE, '', 2000)
                  resumeStore.resetStatus();
              }
              else if (this.state.resumeDeleteStatus === constants.OK)
              {
                  NotificationManager.success(constants.DELETE_SUCCESS_MESSAGE, '', 2000)
                  resumeStore.resetStatus();
              }
        });

        this.setState({
            resumeFileCreateStatus: resumeStore.getResumeFileCreateStatus()
        }, function() {
            if (this.state.resumeFileCreateStatus === constants.CONFLICT)
            {
                NotificationManager.error(constants.RESUME_CREATE_ERROR_MESSAGE, '', 2000)
                resumeStore.resetStatus();
            }
            else if (this.state.resumeFileCreateStatus === constants.OK)
            {
                NotificationManager.success(constants.RESUME_CREATE_SUCCESS_MESSAGE, '', 2000)
                resumeStore.resetStatus();
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
              //text: 'All', value: this.props.languages.length
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
            <BootstrapTable className='resumeGrid' data={ this.props.resumes } striped hover search pagination={ false } options={ options } searchPlaceholder={ constants.FILTER }>
                <TableHeaderColumn isKey dataField='link' dataFormat={ linkEditData } width='30' headerAlign='center'>{ constants.EDIT }</TableHeaderColumn>
                <TableHeaderColumn dataField='link' width='30' dataFormat={ linkDeleteData } headerAlign='center'>{ constants.DELETE }</TableHeaderColumn>
                <TableHeaderColumn dataField='link' dataFormat={ linkResumeData } width='30' headerAlign='center'>{ constants.RESUME }</TableHeaderColumn>
                <TableHeaderColumn dataField='link' dataFormat={ linkResumeCreationData } width='50' headerAlign='center'>{ constants.RESUME_CREATION }</TableHeaderColumn>
                <TableHeaderColumn dataField='CandidateName' dataSort={ true } width='90'>{ constants.CANDIDATE_NAME }</TableHeaderColumn>
                <TableHeaderColumn dataField='EducationDescription' dataSort={ true } width='90'>{ constants.EDUCATION_DESCRIPTION }</TableHeaderColumn>
                <TableHeaderColumn dataField='Experience' dataSort={ true } width='50'>{ constants.EXPERIENCE }</TableHeaderColumn>
                <TableHeaderColumn dataField='TeamSize' dataSort={ true } width='50'>{ constants.TEAM_SIZE }</TableHeaderColumn>
                <TableHeaderColumn dataField='ProjectCount' dataSort={ true } width='50'>{ constants.PROJECT_COUNT }</TableHeaderColumn>
            </BootstrapTable>
          </div>
        );
    }
}