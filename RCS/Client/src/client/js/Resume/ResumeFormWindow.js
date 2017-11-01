import React from 'react';
import ResumeTabs from './ResumeTabs';

export default class ResumeFormWindow extends React.Component {
    render() {
        return (
            <div className='slds-m-around--medium'>
                <ResumeTabs ref='form' resume={ this.props.resume } databases={ this.props.databases } designations={ this.props.designations } technologies={ this.props.technologies } domains={ this.props.domains } os={ this.props.os } languages={ this.props.languages } applications={ this.props.applications } frameworks={ this.props.frameworks } projects={ this.props.projects } roles={ this.props.roles } />
            </div>
        );
    }
}