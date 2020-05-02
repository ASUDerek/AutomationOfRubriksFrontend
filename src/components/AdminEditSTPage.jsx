import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

const SERVICE_API_URL = "https://automation-of-rubriks-service.herokuapp.com";
const GET_QUESTIONS_BASE_API_URL = "https://automation-of-rubriks-service.herokuapp.com/admin/createtemplate/getquestions/questiontypeid=";
const NEW_QUESTION_API_URL = "https://automation-of-rubriks-service.herokuapp.com/admin/questiontypeid=";
const EDIT_TEMPLATE_API_URL = "https://automation-of-rubriks-service.herokuapp.com/admin/edittemplate";

var SURVEYS_API_URL = "";   // Will be set when page loads
var SURVEY_TEMPLATE_API_URL = "";   // Will be set when page loads
const END_OF_SURVEYS_URL = "/surveys";

const ERROR_SELECT = "Please make sure to add a survey name, description and select questions";
const ERROR_NO_QUESTIONS = "There are no questions with the selected question type and keywords";

var tempTypeOfQuestion = 0;

var currentTemplateQuestions = new Set();

/**********************************************************************************************************
 * Figures available on Capstone Google Drive
 * 
 * More info on the set data type here:
 *      https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
 * 
 * Figure 1: Data comes via backend API's and fills
 *           the connected data structures.
 *           currentTemplateQuestions is populated
 *           with the previously selected questions.
 *           The logic is defined below:
 * 
 *              for question in this.state.surveyTemplate.questions:
 *                  currentTemplateQuestions.add(question.questionid)
 * 
 * Figure 2: currentTemplateQuestions, which 
 *           holds the questionids in the template, is
 *           used with allQuestions array to populate
 *           check boxes for users.  The logic is
 *           shown below:
 * 
 *              for question in this.state.allQuestions:
 *                  if currentTemplateQuestions.has(question.questionid):
 *                      checkbox = checked
 *                  else: 
 *                      checkbox = not checked
 * 
 *              surveyTemplate.questions = []   // Set to empty array for easier manipulation later
 * 
 * Figure 3: The user makes the given changes (i.e
 *           adding questions, editting questions, 
 *           putting questions in the survey, deleting 
 *           questions from the survey, chaging survey
 *           type, changing description).  When a 
 *           question box is pressed, an event handler
 *           will take the questionid (found with variable
 *           e.target.id) and performs the following
 *           check in the currentTemplateQuestions:
 * 
 *              if currentTemplateQuestions.has(e.target.id):
 *                  currentTemplateQuestions.delete(e.target.id)
 *              else:
 *                  currentTemplateQuestions.add(e.target.id)
 * 
 * Figure 4: The user presses the submit button.  Then, 
 *           the following logic is performed:
 * 
 *              if text boxes and questions are checked:
 * 
 *                  this.state.surveyTemplate.typeOfSurvey.type = type text box
 *                  this.state.surveyTemplate.typeOfSurvey.description = description text box
 * 
 *                  for question in this.state.allQuestions:
 *                      if currentTemplateQuestions.has(question.questionid):
 *                          this.state.surveyTemplate.questions.push(question)
 * 
 *                  axios.put(EDIT_TEMPLATE_API_URL, this.state.surveyTemplate)
 ***********************************************************************************************************/

var surveySelected = false;

//change to surveys instead of surveytypes once AdminSurveyTemplatesPage has been fixed
var surveyObjectToReturn = {

    surveyid: Number,
    typeOfSurvey: {
        surveytypeid: Number,
        type: String,
        description: String
    },
     name: String

};

var question = {
    question: String
};


class AdminEditSTPage extends Component {

    constructor(props) {
        super(props)
        this.state = {

            surveyTemplate: {
                typeOfSurvey: {
                    surveytypeid: Number,
                    type: String,
                    description: String
                },
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
                questionSelected: 0
            },

            allQuestions: [{
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

            surveys: [{
                surveyid: Number,
                typeOfSurvey: {
                    surveytypeid: Number,
                    type: String,
                    description: String
                },
                name: String
            }]
        }

        this.refreshSurvey.bind(this)
    }

    componentDidMount() {
        this.refreshSurvey();
    }

    refreshSurvey() {

        {/*this probably needs to be changed to surveys instead of survey types once AdminSurveyTemplatesPage has been
        fixed to pass in the survey type that is being edited*/}
        
        // First, we call the Survey Template API URL to get the survey template info for the text boxes.
        SURVEY_TEMPLATE_API_URL = SERVICE_API_URL + "/admin/gettemplateinformation/surveytypeid=" + this.props.match.params.surveytypeid;

        axios.get(SURVEY_TEMPLATE_API_URL).then(
            response => {
                console.log(response.data);
                this.setState({ surveyTemplate: response.data })

                this.state.surveyTemplate.questions.map(
                    question => {
                        currentTemplateQuestions.add(question.questionid);
                    }
                );
                console.log(currentTemplateQuestions);

                 // We will now get all of the questions with the corresponding question type from the database (same call as AdminCTS2Page).
                // Note: This must be done AFTER we set allQuestions because it is used in the path.
                this.getQuestionsAPICall();
                
            }
        )

        // Lastly, we call the Surveys API URL to get the surveys that are of this survey type.
        SURVEYS_API_URL = SERVICE_API_URL + "/teamid=" + 0 + "/surveytypeid=" + this.props.match.params.surveytypeid + END_OF_SURVEYS_URL;
        
        axios.get(SURVEYS_API_URL).then(
            response => {
                console.log(response.data);
                this.setState({ surveys: response.data })
            }
        )
    }

    getQuestionsAPICall() {

        if(tempTypeOfQuestion == 0) {
            tempTypeOfQuestion = this.state.surveyTemplate.questions[0].typeOfQuestion.questiontypeid;
        }

        var GET_QUESTIONS_API_URL = GET_QUESTIONS_BASE_API_URL + tempTypeOfQuestion + "/keyword=" + encodeURI(this.keyword.value);
        axios.get(GET_QUESTIONS_API_URL).then(
            response => {
                console.log(response.data);
                this.setState({ allQuestions: response.data })

                // If there are no questions returned by the API, we need to show ERROR_NO_QUESTIONS.
                if(this.state.allQuestions.length == 0) {
                    this.setState({ showError: true, errorText: ERROR_NO_QUESTIONS });
                } else {
                    this.setState({ showError: false });
                }

                this.state.surveyTemplate.questions = [];
            }
        )

    }

    onSurveySelect = e => {

        this.state.surveys.map (
            survey => {
                if(survey.surveyid == e.target.id) {
                    surveyObjectToReturn.surveyid = survey.surveyid;
                    surveyObjectToReturn.typeOfSurvey = survey.typeOfSurvey;
                    surveyObjectToReturn.name = survey.name;
                    console.log("SURVEY " + surveyObjectToReturn.name + " WITH ID " + String(surveyObjectToReturn.surveyid) + " WAS SELECTED!");
                }
                return 0;
            }
        )
        surveySelected = true;
    }

    onAddSurveyButtonClicked(e) {
        console.log("ADD SURVEY BUTTON CLICKED!");
        this.setState({ showEmptyTextBoxError: false });
        this.setState({ showSurveyExistError: false });
        this.setState({ showChooseSurveyError: false});
        this.setState({ showDeleteSurveyError: false});

        if(this.newSurvey.value !== "") {

            surveyObjectToReturn.name = this.newSurvey.value;
            var ADD_SURVEY_API_URL = SERVICE_API_URL + "/admin/addsurvey/" + String(this.props.match.params.surveytypeid);

            axios.post(ADD_SURVEY_API_URL, surveyObjectToReturn).then(
                response => {
                    console.log(response.data);
                    if(response.data === true) {
                        console.log("Added the survey!");
                        this.refreshSurvey();
                    } else {
                        console.log("There is already a survey with that name.");
                        this.setState({ showSurveyExistError: true });
                    }
                }
            )

            this.newSurvey.value = "";
        } else {
            console.log("Please enter a survey to add.");
            this.setState({ showEmptyTextBoxError: true });
        }

    }

    onUpdateSurveyButtonClicked = e => {
        console.log("UPDATE SURVEY BUTTON CLICKED!");
        this.setState({ showEmptyTextBoxError: false });
        this.setState({ showSurveyExistError: false });
        this.setState({ showChooseSurveyError: false});
        this.setState({ showDeleteSurveyError: false});

        if(this.newSurvey.value !== "" && surveySelected === true) {

            var UPDATE_SURVEY_API_URL = SERVICE_API_URL + "/admin/editsurvey/" + encodeURI(surveyObjectToReturn.name);
            surveyObjectToReturn.name = this.newSurvey.value;

            axios.put(UPDATE_SURVEY_API_URL, surveyObjectToReturn).then(
                response => {
                    console.log(response.data);
                    if(response.data === true) {
                        console.log("The survey was updated!");
                        this.refreshSurvey();
                    } else {
                        console.log("A survey with the name: " +surveyObjectToReturn.name + " is already in the database.");
                        this.setState({ showSurveyExistError: true });
                    }
                }
            )

            this.newSurvey.value = "";
        } else {
            if(this.newSurvey.value === "") {
                console.log("Please enter a new survey name before updating.");
                this.setState({ showEmptyTextBoxError: true });
            }
            if(surveySelected === false) {
                console.log("Please select a survey to be updated.");
                this.setState({ showChooseSurveyError: true});
            }
        }
    }

    onDeleteSurveyButtonClicked = e => {
        console.log("DELETE SURVEY BUTTON CLICKED!");
        this.setState({ showEmptyTextBoxError: false });
        this.setState({ showSurveyExistError: false });
        this.setState({ showChooseSurveyError: false});
        this.setState({ showDeleteSurveyError: false});

        if(surveySelected === true) {

            var DELETE_SURVEY_API_URL = SERVICE_API_URL + "/admin/deletesurvey/" + String(surveyObjectToReturn.surveyid);

            axios.put(DELETE_SURVEY_API_URL).then(
                response => {
                    console.log(response.data);
                    if(response.data === true) {
                        console.log("Deleted the survey!");
                        this.refreshSurvey();
                    } else {
                        console.log("The survey could not be deleted.");
                    }
                }
            )
        } else {
            console.log("Please select a survey to delete.");
            this.setState({ showDeleteSurveyError: true})
        }
    }

    onSaveButtonClicked = e => { //saves changes in name, desc, and questions

        this.setState({ showError: false});

        if (currentTemplateQuestions.size == 0 || this.newName.value === "" || this.newDesc.value === "" ) { 
            //no question are selected, no name was given, or no description was given
            console.log("NOT READY");
            this.setState({ showError: true, errorText: ERROR_SELECT });
        }
        else{
            this.state.surveyTemplate.typeOfSurvey.type = this.newName.value;
            this.state.surveyTemplate.typeOfSurvey.description = this.newDesc.value;

            this.state.allQuestions.map(
                question => {
                    if(currentTemplateQuestions.has(question.questionid)) {
                        this.state.surveyTemplate.questions.push(question);
                    }

                }
            )
            console.log(this.state.surveyTemplate);
            axios.put(EDIT_TEMPLATE_API_URL, this.state.surveyTemplate).then(
                response => {
                    console.log(response.data);
                    if(response.data === true) {
                        console.log("EDIT SUCCESSFUL!");
                        window.location.href = "/admin/surveytypeid=" + this.props.match.params.surveytypeid + "/cstcomplete";
                    }
                    else {
                        console.log("EDIT UNSUCCESSFUL!");
                    }
                }
            )
        }

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
    }

    onAddQClicked = e => {
        this.setState({ showQuestionExistError: false });
        if(this.newQ.value !== ""){
            question.question = this.newQ.value;

            var ADD_QUESTION_API_URL = NEW_QUESTION_API_URL + String(this.state.allQuestions[0].typeOfQuestion.questiontypeid) + "/addquestion";
            
            axios.post(ADD_QUESTION_API_URL, question).then(
                response => {
                    console.log(response.data);
                    if(response.data === true) {

                        this.refreshSurvey();

                    } else {    // The question is already in the database
                        console.log("QUESTION ALREADY EXISTS!");
                        this.setState({ showQuestionExistError: true });
                    }
                }
            )
        }

    }

    onShowAllQClicked() {

        var GET_QUESTIONS_API_URL = GET_QUESTIONS_BASE_API_URL + tempTypeOfQuestion + "/keyword=";
        axios.get(GET_QUESTIONS_API_URL).then(
            response => {
                console.log(response.data);
                this.setState({ allQuestions: response.data })

                // If there are no questions returned by the API, we need to show ERROR_NO_QUESTIONS.
                if(this.state.allQuestions.length == 0) {
                    this.setState({ showError: true, errorText: ERROR_NO_QUESTIONS });
                } else {
                    this.setState({ showError: false });
                }

                this.state.surveyTemplate.questions = [];
            }
        )

        document.getElementById("keyword").value = "";
    }

    render() {
        var questionList;
        questionList = this.state.allQuestions.map((q, i) => {
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

        return (
            <div>
                <header className = "TopBlankSpace">
                    {/*creates space between header and rest of page*/} 
                </header>

                <header className = "Body">
                    <h1>Edit Survey Template</h1>

                    <form className="form-inline">
                        <label>Survey Template Name: </label> &nbsp;
                        <input ref={(input) => {this.newName = input}} type="text" defaultValue={this.state.surveyTemplate.typeOfSurvey.type} name="changeTemplateName" id="changeTemplateName"></input> 
                    </form>

                    <form className="form-inline">
                        <label>Survey Template Description: </label> &nbsp;
                        <input ref={(input) => {this.newDesc = input}} type="text" defaultValue={this.state.surveyTemplate.typeOfSurvey.description} name="changeTemplateDesc" id="changeTemplateDesc"></input> 
                    </form>

                    <br></br>

                    <Button variant="contained"
                        onClick={(e) => {this.onSaveButtonClicked(e)}}>
                    Save All</Button>

                    <header className = "SurveySide">
                        <h2>Surveys</h2>

                        <header className = "SurveyTable">
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Survey</TableCell>
                                            <TableCell allign="center">Select</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            this.state.surveys.map(
                                                survey => (
                                                    <TableRow key={survey.surveyid}>
                                                        <TableCell>{survey.name}</TableCell>
                                                        <TableCell>
                                                            <RadioGroup value={this.state.selectedValue} onChange={this.onSurveySelect}>
                                                                <Radio style={{color: '#F01716'}} value={survey.name} control={<Radio />} label={survey.surveyid} id={survey.surveyid} />
                                                            </RadioGroup>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </header>
                        
                        <br></br>
                        <form className="form-inline" onSubmit={(e) => {this.onAddTeamButtonClicked(e)}}>
                            <label>New Survey Name: </label> &nbsp;
                            <input ref={(input) => {this.newSurvey = input}} type="text" name="newSurvey" id="newSurvey"></input>

                            <br></br>
                            <br></br>

                            <Button variant="contained"
                                onClick={(e) => {this.onAddSurveyButtonClicked(e)}}>
                            Add Survey</Button>

                            <Button variant="contained"
                                onClick={this.onUpdateSurveyButtonClicked}>
                            Update Survey</Button>

                            <Button variant="contained"
                                onClick={this.onDeleteSurveyButtonClicked}>
                            Delete Survey</Button>
                        </form>

                        <p>To add a survey, enter survey name and click "add survey."</p>
                        <p>To edit a survey, select survey then enter new survey name <br></br>and click "edit survey."</p>
                        <p>To delete a survey, select survey then click "delete survey."</p>

                        <h1 style={{ color: 'red' }}>{ this.state.showEmptyTextBoxError ? "Please input a new Survey Name" : null }</h1>
                        <h1 style={{ color: 'red' }}>{ this.state.showSurveyExistError ? "This Survey Name already exists" : null }</h1>
                        <h1 style={{ color: 'red' }}>{ this.state.showChooseSurveyError ? "Please choose a Survey to update" : null }</h1>
                        <h1 style={{ color: 'red' }}>{ this.state.showDeleteSurveyError ? "Please choose a Survey to delete" : null }</h1>         
                    </header>

                    <header className = "QuestionsSide">
                        <h2>Questions</h2>

                        <h1 style={{ color: 'red' }}>{ this.state.showError ? this.state.errorText : null }</h1>
                    
                        <header className = "QuestionsTable">
                            <label>Keyword(s): </label>
                            <input ref={(input) => {this.keyword = input}} type="text" name="keyword" id="keyword"></input>
                            <Button variant="contained"
                                onClick={this.getQuestionsAPICall.bind(this)}>
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

                        <h1 style={{ color: 'red' }}>{ this.state.showQuestionExistError ? "This Question already exists" : null }</h1>        

                        <header className = "BottomBlankSpace">
                            {/*creates space between page and footer*/} 
                        </header>
                    </header>

                    <header className = "BottomBlankSpace">
                        {/*creates space between page and footer*/} 
                    </header>

                </header>

            </div>
        )
    }
}

export default AdminEditSTPage;