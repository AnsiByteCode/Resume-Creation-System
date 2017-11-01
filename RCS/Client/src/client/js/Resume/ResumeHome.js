import React from 'react';
import { HomeHeader } from './../components/PageHeader';
import ResumeList from './ResumeList';
import { NotificationManager } from 'react-notifications';
import constants from './../../constants/Constants';
import resumeStore from './../../stores/ResumeStore';
import resumeActions from './../../actions/ResumeAction';

export default class ResumeHome extends React.Component {
    constructor() {
        super();
        this.state = { resumeList: [] };
        this.onChange = this.onChange.bind(this);
        this.newHandler = this.newHandler.bind(this);
    }
    componentDidMount() {
        var data = [];
        data['IsActive'] = true;
        data['ResumeName'] = 'Test1';
        var x = [];
        x.push(data);
        this.setState({ resumes: x });
        resumeStore.addChangeListener(this.onChange);
        resumeActions.getAllResumes();
    }
    componentWillUnmount() {
        resumeStore.removeChangeListener(this.onChange);
    }
    onChange() {
        this.setState({ resumeList: resumeStore.getResumes() });
        this.setState({
            resumeInsertStatus : resumeStore.getResumeInsertStatus()
        }, function() {
              if (this.state.resumeInsertStatus === constants.CONFLICT)
              {
                  NotificationManager.error(constants.RESUME_EXIST, '', 2000)
                  resumeStore.resetStatus();
              }
              else if (this.state.resumeInsertStatus === constants.OK)
              {
                  NotificationManager.success(constants.INSERT_SUCCESS_MESSAGE, '', 2000)
                  resumeStore.resetStatus();
              }
        });

        this.setState({
            resumeUpdateStatus : resumeStore.getResumeUpdateStatus()
        }, function() {
              if (this.state.resumeUpdateStatus === constants.CONFLICT)
              {
                  NotificationManager.error(constants.RESUME_EXIST, '', 2000)
                  resumeStore.resetStatus();
              }
              else if (this.state.resumeUpdateStatus === constants.OK)
              {
                  NotificationManager.success(constants.UPDATE_SUCCESS_MESSAGE, '', 2000)
                  resumeStore.resetStatus();
              }
        });
    }
    newHandler() {
        this.props.router.push('/resume/create');
    }
    render() {
        return (
            <div>
                <HomeHeader type={ constants.RESUME }
                            title={ 'abc' }
                            newLabel={ constants.NEW_RESUME }
                            actions={[{ value: constants.NEW_RESUME, label: constants.NEW_RESUME }]}
                            itemCount={ 1 }
                            views={[{ id: 1, name: constants.RESUME_LIST }]}
                            viewId='1'
                            onNew={ this.newHandler }
                            />
                <ResumeList resumes={ this.state.resumeList } />
            </div>
        );
    }
}
