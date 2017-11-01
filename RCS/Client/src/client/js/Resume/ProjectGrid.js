import React from 'react';
import constants from './../../constants/Constants';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

const ProjectGrid = (props) => {
    return (
      <BootstrapTable className='projectGrid' data={ props.projectDetails } striped hover pagination={ false }  selectRow={ props.selectRowProp }  options={ props.options } cellEdit={ props.cellEditProp } deleteRow>
           <TableHeaderColumn dataField='ProjectName' dataSort={ true } width='110'>{ constants.PROJECT }</TableHeaderColumn>
           <TableHeaderColumn dataField='ProjectId' hidden isKey={ true }>Product ID</TableHeaderColumn>
           <TableHeaderColumn dataField='RoleId' hidden >Role ID</TableHeaderColumn>
           <TableHeaderColumn dataField='RoleName' editable={ { type: 'select', options: { values: props.roles !== undefined ? props.roles.map(e => e.ProjectRoleName) : [] } } } dataSort={ true } width='110'>{ constants.ROLE }</TableHeaderColumn>
           <TableHeaderColumn dataField='Responsibilities' editable={ { type: 'textarea' } } dataSort={ true } width='110'>{ constants.RESPONSIBILITIES }</TableHeaderColumn>
      </BootstrapTable>
    );
};

export default ProjectGrid;