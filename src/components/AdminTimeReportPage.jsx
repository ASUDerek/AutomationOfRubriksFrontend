import React, { Component } from 'react';
import axios from 'axios'
import '../App.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

const REPORT_OPTIONS_API_URL = "https://automation-of-rubriks-service.herokuapp.com/admin/reportoptions";
const REPORT_API_URL = "https://automation-of-rubriks-service.herokuapp.com/admin/report/"

var date1 = ""
var date2 = ""

class AdminTimeReportPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            reportOptions: {
                teams: [{
                    teamid: Number,
                    teamName: String
                }],

                surveys: [{
                    surveyid: Number,
                    typeOfSurvey: {
                        surveytypeid: Number,
                        type: String,
                        description: String
                    },
                    name: String
                }]
            },
            
            results: [{
                questions: [{
                    questionid: Number,
                    typeOfQuestion: {
                        type: String,
                        description: String,
                        numberOfOptions: Number
                    },
                    question: String,
                    questionScore: Number
                }],
                totalScore: Number
            }],
            sendDate: new Date(),
            endDate: new Date()
            
        }
        this.refreshReportOptions.bind(this);
    }

    componentDidMount() {
        this.refreshReportOptions();
    }

    refreshReportOptions() {

        axios.get(REPORT_OPTIONS_API_URL).then(
            response => {
                console.log(response);
                this.setState({ reportOptions: response.data });
            }
        )
    }

    onSubmitClicked = e => {
        if(this.state.startDate != null && this.state.endDate != null)
        {
            this.setState({ showChooseTimeError: false });
            var month1 = this.state.startDate.getMonth() + 1;
            date1 = String(this.state.startDate.getFullYear() + "-" + month1 + "-" + this.state.startDate.getDate());
            var month2 = this.state.endDate.getMonth() + 1;
            date2 = String(this.state.endDate.getFullYear() + "-" + month2 + "-" + this.state.endDate.getDate());
            console.log(date1 + ", " + date2);

            var surveyDropDown = document.getElementById("SurveySelect");
            var surveySelected = surveyDropDown.options[surveyDropDown.selectedIndex].value;
            console.log(surveySelected);

            if (this.state.startDate <= this.state.endDate) {
                console.log("CORRECT");
                this.setState({ showChangeStartError: false });
                var REPORT_TIME_API_URL = REPORT_API_URL + "time1=" + date1 + "/time2=" + date2 + "/surveyid=" + String(surveySelected);
                axios.get(REPORT_TIME_API_URL).then(
                    response => {
                        console.log(response.data);
                        this.setState({ results: response.data});
                    }
                )

            }
            else { //startDate comes after endDate
                console.log("INCORRECT");
                this.setState({ showChangeStartError: true });
            }
        }

        else {
            this.setState({ showChooseTimeError: true });
        }
    }

    onStartChange = startDate => {
        this.setState({ startDate })
        console.log(startDate);
    }

    onEndChange = endDate => {
        this.setState({ endDate })
        console.log(endDate);
    }

    onTeamsClicked = e => {
        window.location.href = "/admin/reports";
    }

    onTimePeriodClicked = e => {
        window.location.href = "/admin/timereport";
    }

    onQuestionsClicked = e => {
        window.location.href = "/admin/questionreport";
    }

    render() {
        const { surveys } = this.state.reportOptions;
        let surveyList = surveys.length > 0
            && surveys.map((item, i) => {
                return (
                    <option key={i} value={item.surveyid}>{item.name}</option>
                )
            }, this);

        let questionList;

        this.state.results.map(
            result => {

                const { questions } = result
                if(questions.length != 1) {

                    questionList = questions.length > 0 && questions.map((question, i) => {
                        if(i < questions.length - 1) {

                            return (
                                <TableRow>
                                    <TableCell style={{width: 125, float: 'left'}}>Question {i + 1}:</TableCell>
                                </TableRow>
                            )

                        } else { // Last element
                            return (
                                <>
                                    <TableRow>
                                        <TableCell style={{width: 125, float: 'left'}}>Question {i + 1}:</TableCell>
                                    </TableRow>
                                    <TableCell><b>Total Score:</b></TableCell>
                                </>
                            )
                        }
                    }, this);
                }
            }
        )

        var answers = [];
        var answerList;

        this.state.results.map(
            result => {

                const { questions } = result
                if(questions.length != 1) {

                    answerList = questions.length > 0 && questions.map((question, i) => {
                        if(i < questions.length - 1) {
                            return (
                                <TableRow>
                                    <TableCell>{question.questionScore}</TableCell>
                                </TableRow>
                            )
                        } else { // Last element
                            return (
                                <>
                                    <TableRow>
                                        <TableCell>{question.questionScore}</TableCell>
                                    </TableRow>
                                    <TableCell><b>{result.totalScore.toFixed(2)}</b></TableCell>
                                </>
                            )
                        }
                    }, this);

                }

                answers.push(answerList);
            }
        )

        if(this.state.results[0] !== undefined) {

            var averages = [];
            var question_average = 0.0;
            var totalAverage = 0.0;

            for(var i = 0; i < this.state.results[0].questions.length; i++) {
                this.state.results.map(
                    result => {
                        var { questions } = result;
                        
                        question_average += questions[i].questionScore;

                    }
                )

                question_average /= this.state.results.length;

                totalAverage += question_average;

                question_average = question_average.toFixed(2);

                averages.push(question_average);

                question_average = 0.0;

            }

            totalAverage /= this.state.results[0].questions.length;

            totalAverage = totalAverage.toFixed(2);

            var returnAverages = this.state.results[0].questions.length > 0 && this.state.results[0].questions.map((question, i) => {
                if(this.state.results[0].questions.length != 1) {

                    if(i < this.state.results[0].questions.length - 1) {
                        return (
                            <TableRow>
                                <TableCell>{averages[i]}</TableCell>
                            </TableRow>
                        )
                    } else { // Last element
                        return (
                            <>
                                <TableRow>
                                    <TableCell>{averages[i]}</TableCell>
                                </TableRow>
                                <TableCell><b>{totalAverage}</b></TableCell>
                            </>
                        )
                    }
                    
                }
            }, this);
        }
        return(
            <div>
                <header className = "TopBlankSpace">
                     {/*creates space between header and rest of page*/} 
                </header>

                <header className="Body">
                    <h1>Score Reporting</h1>

                    <label>Sort by: </label>

                    <Button variant="contained"
                        onClick={this.onTeamsClicked}>
                    Teams</Button>

                    <Button variant="contained"
                        onClick={this.onTimePeriodClicked}>
                    Time Period</Button>

                    <Button variant="contained"
                        onClick={this.onQuestionsClicked}>
                    Questions</Button>

                    <br></br>
                    <br></br>

                    <Divider />

                    <h2>By Time:</h2>

                    <header className = "CalendarDates">
                        <p>Start Date: </p>
                        <div>
                            <Calendar
                            onChange={this.onStartChange}
                            value={this.state.startDate}
                            />
                        </div>
                    
                        <p>End Date: </p>
                        <div>
                            <Calendar
                            onChange={this.onEndChange}
                            value={this.state.endDate}
                            />
                        </div>

                        <br></br>

                        <header className = "BottomBlankSpace">
                            {/*creates space between page and footer*/} 
                        </header>

                    </header>

                    <header className = "CalendarReport">
                        <br></br>
                        <label>Survey: </label> &nbsp;
                        <select id="SurveySelect">
                            {surveyList}
                        </select>

                        <Button variant="contained"
                            onClick={this.onSubmitClicked}>
                        Submit</Button>

                        <h1 style={{ color: 'red' }}>{ this.state.showChooseTimeError ? "Please choose a time" : null }</h1>
                        <h1 style={{ color: 'red' }}>{ this.state.showChangeStartError ? "Please make sure the Start Date is before the End Date" : null }</h1>

                        <br></br>

                        <header className = "ResultsTable">
                            <TableContainer>
                                <Table size="small">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Question</TableCell>
                                            <TableCell>Team Scores</TableCell>
                                            <TableCell>Average</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>{questionList}</TableCell>
                                            <TableCell>
                                            {
                                                this.state.results.map(
                                                    (result, i) => (
                                                        <TableCell>{answers[i]}</TableCell>
                                                    )
                                                )
                                            }
                                            </TableCell>
                                            <TableCell>{returnAverages}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </header>

                        <header className = "BottomBlankSpace">
                            {/*creates space between page and footer*/} 
                        </header>

                    </header>

                </header>
                
                <header className = "BottomBlankSpace">
                    {/*creates space between page and footer*/} 
                </header>
                
            </div>
        );
    }
}

export default AdminTimeReportPage;