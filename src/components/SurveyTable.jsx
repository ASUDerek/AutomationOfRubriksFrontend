import React, { Component } from 'react';
import '../App.css';
import Popup from './Popup';
import axios from 'axios'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';

const SERVICE_API_URL = "https://automation-of-rubriks-service.herokuapp.com";
var SURVEY_API_URL = "";   // Will be set when page loads
const END_OF_SURVEY_URL = "/survey";
const END_OF_RESULTS_URL = "/results";
var RESULTS_API_URL = "";   // Will be set before PUT request is made

class SurveyTable extends Component {

    constructor(props) {
        super(props)
        this.state = {

            data: {
                survey: {
                    surveyid: Number,
                    typeOfSurvey: {
                        surveytypeid: Number,
                        type: String,
                        description: String, 
                    },
                    name: String
                },
                questions: [{
                    typeOfQuestion: {
                        type: String,   // change this to "type" to match tblquestiontype
                        description: String,
                        numberOfOptions: Number
                    },
                    question: String,
                    questionScore: Number
                }],
                totalScore: Number
            },
            message: null,
            showPopup: true

        }

        this.refreshSurvey.bind(this)
    }

    componentDidMount() {
        this.refreshSurvey();
    }

    refreshSurvey() {

        SURVEY_API_URL = SERVICE_API_URL + "/teamid=" + this.props.match.params.teamid + "/surveyid=" + this.props.match.params.surveyid + END_OF_SURVEY_URL;

        axios.get(SURVEY_API_URL).then(
            response => {
                console.log(response);
                this.setState({ data: response.data })
            }
        )
    }

    handleScoreChange = e => {
        
        this.state.data.questions.map(
            question => 
            {
                // eslint-disable-next-line
                if (question.question == e.target.name) {
                    question.questionScore = e.target.id;
                    console.log("QUESTION " + question.question + " SCORE CHANGED TO " + String(question.questionScore));
                }
                return true;
            }
        );

        return false;

    }

    onSubmitClicked = e => {

        var readyToSubmit = true;

        this.state.data.questions.map(
            question =>
            {
                // eslint-disable-next-line
                if (question.questionScore != -1) {
                    return 1;
                } else {
                    readyToSubmit = false;
                    return -1;
                }
            }
        );

        if(readyToSubmit === true) {
            console.log("READY!");

            let scores = [];

            var finalScore = 0;

            var numberOfQuestions = 0;

            this.state.data.questions.map(
                question =>
                {
                    scores.push(question.questionScore);
                    finalScore += Number(question.questionScore);
                    numberOfQuestions++;
                    return 0;
                }
            )

            console.log("Total before division: ", finalScore);

            finalScore = finalScore / numberOfQuestions;

            finalScore = finalScore.toFixed(2);

            console.log("Final Score: " + finalScore);

            this.state.data.totalScore = finalScore;

            RESULTS_API_URL = SERVICE_API_URL + "/teamid=" + this.props.match.params.teamid + "/surveyid=" + this.props.match.params.surveyid + END_OF_RESULTS_URL;

            axios.post(RESULTS_API_URL, this.state.data).then(
                response => {
                    console.log(response.data);
                    window.location.href = "/teamid=" + this.props.match.params.teamid + "/surveyid=" + this.props.match.params.surveyid + "/surveycomplete";
                }
            );

        } else {
            console.log("NOT READY!");
            this.setState({ showError: true });
        }
        
        return 0;
    }

    togglePopup(){ //rating scale
        this.setState({
            showPopup: !this.state.showPopup
        })
    }

    render() {

        var optionHeaders = [];

        const numberOfOptions = this.state.data.questions[0].typeOfQuestion.numberOfOptions;

        for(var i = 0; i < numberOfOptions; i++) {
            optionHeaders.push(i);
        }

        let optionHeaderList = optionHeaders.length > 0
            && optionHeaders.map((item, i) => {
                return (
                    <TableCell>{i}</TableCell>
                )
            }, this);

        var displayQuestions = [];

        var createdQuestion;

        this.state.data.questions.map(
            question => {

                var questionComponents = [];

                questionComponents.push(question.question);

                for(var i = 0; i < question.typeOfQuestion.numberOfOptions; i++) {
                    questionComponents.push(i);
                }

                createdQuestion = questionComponents.length > 0
                    && questionComponents.map(
                        component => {
                            if(typeof component == 'string') {
                                return(
                                    <TableCell>{question.question}</TableCell>
                                )
                            } else {
                                return(
                                    <TableCell>
                                        <input name={question.question} type="radio" value="false" onChange={this.handleScoreChange} id = {component}></input>
                                    </TableCell>
                                )
                            }

                    }, this);

                displayQuestions.push(createdQuestion);
                
            }
        )

        return (
            <div>
                <header className = "TopBlankSpace">
                    {/*creates space between header and rest of page*/} 
                </header>

                <header className = "Body">
                    <header className = "App-SurveyTitle">
                        <p>{this.state.data.survey.typeOfSurvey.type}: {this.state.data.survey.name}</p>
                    </header>

                    <header className = "App-Ratingtable">
                        <Button variant="contained"
                            onClick={this.togglePopup.bind(this)}>
                        Rating Scale</Button>

                        {this.state.showPopup ?
                        <Popup
                            closePopup={this.togglePopup.bind(this)}
                        />: null}
                    </header>

                    <p>Choose <b>ONE</b> rating for each item below based on your observations of the development team.</p>

                    <br></br>

                    <header className = "SurveyTable">
                        <TableContainer>
                            <Table size="medium">
                                <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        {optionHeaderList}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        this.state.data.questions.map(
                                            (question, i)=> (
                                                <TableRow>{displayQuestions[i]}</TableRow>
                                            )
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </header>

                    <br></br>

                    <Button variant="contained"
                        onClick={this.onSubmitClicked}>
                    Submit</Button>

                    <h1 style={{ color: 'red' }}>{ this.state.showError ? "Please complete the survey" : null }</h1>

                </header>

                <header className = "BottomBlankSpace">
                    {/*creates space between page and footer*/} 
                </header>

            </div>
        )
    }
}

export default SurveyTable;