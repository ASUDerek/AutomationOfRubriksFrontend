import React, { Component } from 'react';
import axios from 'axios';
import '../App.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

const GET_QUESTIONS_BASE_API_URL = "https://automation-of-rubriks-service.herokuapp.com/admin/createtemplate/getquestions/questiontypeid=";
const NEW_QUESTION_API_URL = "https://automation-of-rubriks-service.herokuapp.com/admin/questiontypeid=";

const CREATE_TEMPLATE = "https://automation-of-rubriks-service.herokuapp.com/admin/createtemplate";

var selected = false; //true if a question has been selected
var nameGiven = false;
var descGiven = false;

const ERROR_SELECT = "Please make sure to add a survey name, description and select questions";
const ERROR_NO_QUESTIONS = "There are no questions with the selected question type and keywords";

var currentTemplateQuestions = new Set();

var question = {
    question: String
};

var template = {
        typeOfSurvey : {
            surveytypeid : Number, // NULL when sent from frontend
            type : String,
            description : String
        },
        questions: [{
            questionid : Number,
            typeOfQuestion : {
                questiontypeid : Number,
                type : String,
                description : String,
                numberOfOptions : Number
            },
            question : String,
            questionScore : Number // NULL when sent from frontend
        }]
};

class AdminCST2Page extends Component {

    constructor(props) {
        super(props)
        this.state = {

            selectedQuestiontypeid: Number,
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
            checkedValue: 0
        }

        this.refreshSurvey.bind(this)
    }

    componentDidMount() {
        this.refreshSurvey();
    }

    refreshSurvey() {

        console.log("Here's the param: " + this.props.match.params.questiontypeid);

        var GET_QUESTIONS_API_URL = GET_QUESTIONS_BASE_API_URL + String(this.props.match.params.questiontypeid) + "/keyword=" + encodeURI(this.keyword.value);

        axios.get(GET_QUESTIONS_API_URL).then(
            response => {
                console.log(response);
                this.setState({ questions: response.data });
                if(this.state.questions.length !== 0) {
                    this.setState({ showError: false });
                } else {
                    this.setState({ showError: true, errorText: ERROR_NO_QUESTIONS});
                }
                template.questions.splice(0, 1);
            }
        )
    }

    handleQuestionSelect = e => {

        var selectedQ = Number(e.target.id);
        
        if(currentTemplateQuestions.has(selectedQ)) {
            currentTemplateQuestions.delete(selectedQ);
        }
        else {
            currentTemplateQuestions.add(selectedQ);
        }
        console.log(currentTemplateQuestions);
        this.forceUpdate();

        selected = true;

    }

    onNameButtonClicked(e) { //reads in survey template name
        
        e.preventDefault();
        
        if (this.newName.value !== ""){
            template.typeOfSurvey.type = this.newName.value;
            nameGiven = true;
        }

        else {
            this.setState({ showError: true, errorText: ERROR_SELECT});
        }
    }

    onDescButtonClicked(e) { //reads in survey template description
        
        e.preventDefault();
        
        if (this.newDesc.value !== ""){
            template.typeOfSurvey.description = this.newDesc.value;
            descGiven = true;
        }

        else {
            this.setState({ showError: true, errorText: ERROR_SELECT});
        }
    }

    onAddQClicked = e => {
        
        if(this.newQ.value !== ""){
            question.question = this.newQ.value;

            var ADD_QUESTION_API_URL = NEW_QUESTION_API_URL + String(this.props.match.params.questiontypeid) + "/addquestion";
            
            axios.post(ADD_QUESTION_API_URL, question).then(
                response => {
                    console.log(response.data);
                    if(response.data === true) {

                        this.refreshSurvey();

                    } else {    // The question is already in the database
                        console.log("QUESTION ALREADY EXISTS!");
                    }
                }
            )
        }

    }

    onSubmitClicked = e => {

        this.setState({ showError: false });

        if (selected === false || nameGiven === false || descGiven === false) { 
            //no question was selected, no name was given, or no description was given

            console.log("NOT READY");
            this.setState({ showError: true, errorText: ERROR_SELECT});

        } 
        else {

            console.log(currentTemplateQuestions);

            this.state.questions.map(
                question => {
                    if(currentTemplateQuestions.has(question.questionid)) {
                        template.questions.push(question);
                    }

                }
            )

            axios.post(CREATE_TEMPLATE, template).then(
                response => {
                    console.log(response.data);
                    if(response.data != 0) {

                        window.location.href = "/admin/surveytypeid=" + response.data + "/cstcomplete";

                    } else {    // A template with the same name was already in the database
                        console.log("TEMPLATE ALREADY EXISTS!");
                        console.log(template);
                    }
                }
            )
        }
    }

    onShowAllQClicked() {

        var GET_QUESTIONS_API_URL = GET_QUESTIONS_BASE_API_URL + this.props.match.params.questiontypeid + "/keyword=";
        axios.get(GET_QUESTIONS_API_URL).then(
            response => {
                console.log(response.data);
                this.setState({ questions: response.data })

                // If there are no questions returned by the API, we need to show ERROR_NO_QUESTIONS.
                if(this.state.questions.length == 0) {
                    this.setState({ showError: true, errorText: ERROR_NO_QUESTIONS });
                } else {
                    this.setState({ showError: false });
                }
            }
        )

        document.getElementById("keyword").value = "";
    }

    render() {
        var questionList;
        questionList = this.state.questions.map((q, i) => {
            if(currentTemplateQuestions.has(q.questionid)) {
                return(
                    <tr key={q.question} style={{height: 60}}>
                        <td>{q.question}</td>
                        <th style={{width: 60}}>
                            <input name="QUESTION SELECT" type="checkbox" value="false" onChange={this.handleQuestionSelect} id = {q.questionid} checked={true}></input>
                        </th>
                    </tr>
                )
            }
            else {
                return(
                    <tr key={q.question} style={{height: 60}}>
                        <td>{q.question}</td>
                        <th style={{width: 60}}>
                            <input name="QUESTION SELECT" type="checkbox" value="false" onChange={this.handleQuestionSelect} id = {q.questionid}></input>
                        </th>
                    </tr>
                )
            }
        }, this);
        return(
            <div>
                <header className = "TopBlankSpace">
                     {/*creates space between header and rest of page*/} 
                </header>

                <header className = "Body">
                    <h1>New Survey Template</h1>

                    <form className="form-inline" onChange={(e) => {this.onNameButtonClicked(e)}}>
                        <label>Enter Survey Template Name: </label> &nbsp;
                        <input ref={(input) => {this.newName = input}} type="text" name="addTemplateName" id="addTemplateName"></input> 
                    </form>

                    <form className="form-inline" onChange={(e) => {this.onDescButtonClicked(e)}}>
                        <label>Enter Survey Template Description: </label> &nbsp;
                        <input ref={(input) => {this.newDesc = input}} type="text" name="addTemplateDesc" id="addTemplateDesc"></input> 
                    </form>

                    <h2>Select Questions</h2>

                    <h1 style={{ color: 'red' }}>{ this.state.showError ? this.state.errorText : null }</h1>

                    <header className = "QuestionsTable">
                        <label>Keyword(s): </label>
                        <input ref={(input) => {this.keyword = input}} type="text" name="keyword" id="keyword"></input>
                        <Button variant="contained"
                            onClick={this.refreshSurvey.bind(this)}>
                        Search</Button>
                        <Button variant="contained"
                            onClick={this.onShowAllQClicked.bind(this)}>
                        Show All Questions</Button>

                        <Divider />

                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Questions</TableCell>
                                        <TableCell>Select</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {questionList}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </header>

                    <br></br>

                    <form className="form-inline" onSubmit={(e) => {this.onNewQButtonClicked(e)}}>
                        <label>New Question: </label> &nbsp;
                        <input ref={(input) => {this.newQ = input}} type="text" name="addQ" id="addQ"></input>
                        <Button variant="contained"
                            onClick={this.onAddQClicked}>
                        Add</Button>
                        <p>After adding a new question, remember to select it for use in survey template</p>
                    </form>

                    <br></br>

                    <Button variant="contained"
                        onClick={this.onSubmitClicked}>
                    Submit</Button>

                </header>

                <header className = "BottomBlankSpace">
                    {/*creates space between page and footer*/} 
                </header>

            </div>
        )
    }
}

export default AdminCST2Page;