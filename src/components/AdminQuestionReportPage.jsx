import React, { Component } from 'react';
import axios from 'axios';
import '../App.css';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

const REPORT_QUESTION_API = "https://automation-of-rubriks-service.herokuapp.com/admin/report/questionid=";
const GET_QUESTION_TYPES_API_URL = "https://automation-of-rubriks-service.herokuapp.com/admin/createtemplate/getquestiontypes";
const GET_QUESTIONS_BASE_API_URL = "https://automation-of-rubriks-service.herokuapp.com/admin/createtemplate/getquestions/questiontypeid=";

var questionIDSelected = 0;
var questionSelected = "";

class AdminQuestonReportPage extends Component {

    constructor(props) {
        super(props)
        this.state = {


            questiontypes: [{
                
                questiontypeid: Number,
                type: String,
                description: String,
                numberOfOptions: Number

            }],

            questions: [{
                
                questionid: Number,
                typeOfQuestion: {
                    questiontypeid : Number,
                    type: String,
                    description: String,
                    numberOfOptions: Number
                },
                question: String,
                questionScore: Number

            }],

            questionAverage: Number
            
        }
        this.refreshQuestionOptions.bind(this);
    }

    componentDidMount() {
        this.refreshQuestionOptions();
    }

    refreshQuestionOptions() {

        axios.get(GET_QUESTION_TYPES_API_URL).then(
            response => {
                console.log(response.data);
                this.setState({ questiontypes: response.data });
                var getInitialQuestions = GET_QUESTIONS_BASE_API_URL + this.state.questiontypes[0].questiontypeid + "/keyword=" + encodeURI(this.keyword.value);

                axios.get(getInitialQuestions).then(
                    response => {
                        console.log(response.data);
                        this.setState({ questions: response.data })
                    }
                )
            }
        )
    }

    onSubmitClicked = e => {

        var questionDropDown = document.getElementById("QuestionSelect")

        // We need to check if there is anything in the drop down, because it will throw an error if there is not.
        if(questionDropDown.options.length != 0) {

            questionIDSelected = questionDropDown.options[questionDropDown.selectedIndex].value;
        
            this.state.questions.map(
                question => {
                    if (question.questionid == questionIDSelected){
                        questionSelected = question.question;
                    }
                }
            )
            
            console.log("QUESTION " + String(questionIDSelected) + " SELECTED!");

            var fetchQuestionReport = REPORT_QUESTION_API + questionIDSelected;

            axios.get(fetchQuestionReport).then(
                response => {
                    console.log(response.data);
                    var roundedQuestionAverage = Math.round(response.data*100)/100;
                    this.setState({ questionAverage: roundedQuestionAverage});
                }
            )
            
        } else {
            console.log("No options; No API call made.");
        }
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

    onQuestionTypeSelect = e => {

        console.log("Question Type Selected!");

    }

    onSearchClicked = e => {
        
        var questionTypeDropDown = document.getElementById("QuestionTypeSelect");
        var QuestionTypeSelected = questionTypeDropDown[questionTypeDropDown.selectedIndex].value;
        var getQuestions = GET_QUESTIONS_BASE_API_URL + QuestionTypeSelected + "/keyword=" + encodeURI(this.keyword.value);
        console.log("Question Type Selected " + QuestionTypeSelected);
        console.log("Here's the URL: " + getQuestions);

        axios.get(getQuestions).then(
            response => {
                console.log(response.data);
                this.setState({ questions: response.data })
                if(this.state.questions.length != 0) {
                    console.log("I did get anything");
                    this.setState({ showError: false });
                } else {
                    console.log("I didn't get something");
                    this.setState({ showError: true });
                }
            }
        )
    }

    onShowAllQClicked = e => {
        
        var questionTypeDropDown = document.getElementById("QuestionTypeSelect");
        var QuestionTypeSelected = questionTypeDropDown[questionTypeDropDown.selectedIndex].value;
        var getQuestions = GET_QUESTIONS_BASE_API_URL + QuestionTypeSelected + "/keyword=";
        console.log("Question Type Selected " + QuestionTypeSelected);
        console.log("Here's the URL: " + getQuestions);

        axios.get(getQuestions).then(
            response => {
                console.log(response.data);
                this.setState({ questions: response.data })
                if(this.state.questions.length != 0) {
                    console.log("I did get anything");
                    this.setState({ showError: false });
                } else {
                    console.log("I didn't get something");
                    this.setState({ showError: true });
                }
            }
        )

        document.getElementById("keyword").value = "";
    }

    render() {
        
        const { questiontypes } = this.state;
        let questionTypeList = questiontypes.length > 0
            && questiontypes.map((item, i) => {
                return (
                    <option key={i} value={item.questiontypeid}>{item.type}</option>
                )
            }, this);

        const { questions } = this.state;
        let questionsList = questions.length > 0
            && questions.map((item, i) => {
                return (
                    <option key={i} value={item.questionid}>{item.question}</option>
                )
            }, this);
        

        return(
            <div>
                <header className = "TopBlankSpace">
                     {/*creates space between header and rest of page*/} 
                </header>

                <header className = "Body">
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

                    <h2>By Question:</h2>

                    <label>Question Type: </label> &nbsp;
                    <select id="QuestionTypeSelect" onChange={this.onQuestionTypeSelect}> 
                        {questionTypeList}
                    </select>

                    <label style={{paddingLeft: 45}}>Keyword(s): </label>
                    <input ref={(input) => {this.keyword = input}} type="text" name="keyword" id="keyword"></input>
                    <Button variant="contained"
                        onClick={this.onSearchClicked}>
                    Search</Button>
                    <Button variant="contained"
                        onClick={this.onShowAllQClicked}>
                    Show All Questions</Button>

                    <br></br>
                    <br></br>

                    <label>Question: </label> &nbsp;
                    <select id="QuestionSelect">
                        {questionsList}
                    </select>

                    <Button variant="contained"
                        onClick={this.onSubmitClicked}>
                    Submit</Button>
                    
                    <br></br>
                    <br></br>

                    <h2>Question Average: {this.state.questionAverage}</h2>

                    <h1 style={{ color: 'red' }}>{ this.state.showError ? "There are no questions with the selected question type and keywords." : null }</h1>

                </header>

                <header className = "BottomBlankSpace">
                    {/*creates space between page and footer*/} 
                </header>
            </div>
        );
    }
}

export default AdminQuestonReportPage;