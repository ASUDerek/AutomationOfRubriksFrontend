import React, { Component } from 'react';
import axios from 'axios'
import '../App.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from '@material-ui/core/Button';

const GET_QUESTION_TYPES_API_URL = "https://automation-of-rubriks-service.herokuapp.com/admin/createtemplate/getquestiontypes";

var selected = false; //true if a question type has been selected
var questionTypeSelected = "";
var questionTypeIDSelected = 0;

class AdminCreateSurveyTemplatePage extends Component {

    constructor(props) {
        super(props)
        this.state = {

            questiontypes: [{
                
                questiontypeid: Number,
                type: String,
                description: String,
                numberOfOptions: Number

            }],
            selectedValue: 0
        }

        this.refreshSurvey.bind(this)
    }

    componentDidMount() {
        this.refreshSurvey();
    }

    refreshSurvey() {

        axios.get(GET_QUESTION_TYPES_API_URL).then(
            response => {
                console.log(response);
                this.setState({ questiontypes: response.data })
            }
        )
    }

    onQuestionTypeSelect = e => {
        this.setState({selectedValue: e.target.value});
        this.state.questiontypes.map (
            questiontype => {
                if(questiontype.questiontypeid == e.target.id) {
                    questionTypeSelected = questiontype.type;
                    questionTypeIDSelected = questiontype.questiontypeid;
                    console.log("TEAM " + questionTypeSelected + "WITH QUESTION TYPE ID OF " + String(questionTypeIDSelected) + " WAS SELECTED!");
                }
                return 0;
            }
        )
        selected = true;
    }

    onSubmitClicked = e => {

        this.setState({ showError: false });

        if (selected === false) { //no question type was selected

            console.log("NOT READY");
            this.setState({ showError: true });
        } 
        else {
            window.location.href = "/admin/selectquestions/questiontypeid=" + String(questionTypeIDSelected);
        }
    }

    render() {
        return(
            <div>
                <header className = "TopBlankSpace">
                     {/*creates space between header and rest of page*/} 
                </header>

                <header className = "Body">
                    <h1>New Survey Template</h1>

                    <h2>Select a Question Type</h2>

                    <header className = "QuestionTypeTable">
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Rating Scale</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell align="center">Select</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        this.state.questiontypes.map(
                                            questiontype => (
                                                <TableRow key={questiontype.type}>
                                                    <TableCell>{questiontype.type} </TableCell>
                                                    <TableCell>{questiontype.description} </TableCell>
                                                    <TableCell>
                                                        <RadioGroup value={this.state.selectedValue} onChange={this.onQuestionTypeSelect} >
                                                            <Radio style={{color: '#F01716'}} value={questiontype.type} control ={<Radio />} label={questiontype.questiontypeid} id={questiontype.questiontypeid} />
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
                    
                    <Button variant="contained"
                        onClick={this.onSubmitClicked}>
                    Submit</Button>

                    <h1 style={{ color: 'red' }}>{ this.state.showError ? "Please select a question type" : null }</h1>

                </header>
  
                <header className = "BottomBlankSpace">
                    {/*creates space between page and footer*/} 
                </header>
                
            </div>
        )
    }
}

export default AdminCreateSurveyTemplatePage;