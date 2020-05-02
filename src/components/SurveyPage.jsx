import React, { Component } from 'react';
import '../App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import AdminCreateSurveyTemplatePage from './AdminCreateSurveyTemplatePage';
import AdminCST2Page from './AdminCST2Page';
import AdminCSTCompletePage from './AdminCSTCompletePage';
import AdminDeleteSTPage from './AdminDeleteSTPage';
import AdminEditPage from './AdminEditPage';
import AdminEditSTPage from './AdminEditSTPage';
import AdminLoginPage from './AdminLoginPage';
import AdminReportPage from './AdminReportPage';
import AdminSurveyTemplatesPage from './AdminSurveyTemplatesPage';
import AdminTimeReportPage from './AdminTimeReportPage';
import AdminQuestionReportPage from './AdminQuestionReportPage';
import CompletedSurvey from './CompletedSurvey';
import Footer from './Footer';
import Header from './Header';
import SelectSurvey from './SelectSurvey';
import SelectSurveyType from './SelectSurveyType';
import SurveyTable from './SurveyTable';
import TeamSelect from './TeamSelect';

class SurveyPage extends Component {
    render() {
        return (
            <Router>
                    <Header/>
                    <Switch>
                        <Route path="/" exact component={TeamSelect}/>

                        <Route path="/teamid=:teamid/surveytypes" exact component={SelectSurveyType}/>
                        <Route path="/teamid=:teamid/surveytypeid=:surveytypeid/surveys" exact component={SelectSurvey}/>
                        <Route path="/teamid=:teamid/surveyid=:surveyid/survey" exact component={SurveyTable}/>
                        <Route path="/teamid=:teamid/surveyid=:surveyid/surveycomplete" exact component={CompletedSurvey}/>
                        
                        <Route path="/login" exact component={AdminLoginPage}/>

                        <Route path="/admin" exact component={AdminEditPage}/>
                        <Route path="/admin/surveytemplates" exact component={AdminSurveyTemplatesPage}/>
                        <Route path="/admin/createsurveytemplate" exact component={AdminCreateSurveyTemplatePage}/>
                        <Route path="/admin/selectquestions/questiontypeid=:questiontypeid" exact component={AdminCST2Page}/>
                        <Route path="/admin/surveytypeid=:surveytypeid/cstcomplete" exact component={AdminCSTCompletePage}/>
                        <Route path="/admin/surveytypeid=:surveytypeid/edittemplate" exact component={AdminEditSTPage}/>
                        <Route path="/admin/deletetemplate" exact component={AdminDeleteSTPage}/>
                        <Route path="/admin/reports" exact component={AdminReportPage}/>
                        <Route path="/admin/timereport" exact component={AdminTimeReportPage}/>
                        <Route path="/admin/questionreport" exact component={AdminQuestionReportPage}/>

                    </Switch>
                    <Footer/>
            </Router>
        )
    }
}

export default SurveyPage;