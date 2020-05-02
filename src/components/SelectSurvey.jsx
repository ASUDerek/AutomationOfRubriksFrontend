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

// http://localhost:8081
const SERVICE_API_URL = "https://automation-of-rubriks-service.herokuapp.com";
var SURVEYS_API_URL = "";   // Will be set when page loads
const END_OF_SURVEYS_URL = "/surveys";

var surveySelected = false;

var surveyObjectToReturn = {

    surveyid: Number,
    typeOfSurvey: {
        surveytypeid: Number,
        type: String,
        description: String
    },
    name: String
};

class SelectSurvey extends Component {

    constructor(props) {
        super(props)
        this.state = {

            surveys: [{
                surveyid: Number,
                typeOfSurvey: {
                    surveytypeid: Number,
                    type: String,
                    description: String
                },
                name: String
            }],
            selectedValue: 0
        }

        this.refreshSurvey.bind(this)
    }

    componentDidMount() {
        this.refreshSurvey();
    }

    refreshSurvey() {

        SURVEYS_API_URL = SERVICE_API_URL + "/teamid=" + this.props.match.params.teamid + "/surveytypeid=" + this.props.match.params.surveytypeid + END_OF_SURVEYS_URL;
        
        axios.get(SURVEYS_API_URL).then(
            response => {
                console.log(response);
                this.setState({ surveys: response.data })
            }
        )
    }

    onSurveySelect = e => {
        this.setState({selectedValue: e.target.value});
        console.log("Here is selectedValue: " + String(this.state.selectedValue));
        console.log(e.target.id);
        this.state.surveys.map (
            survey =>{
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

    onSubmitClicked = e => {

        if (surveySelected === false) { //no survey has been selected

            console.log("NOT READY");
            this.setState({ showError: true });
        } 
        else {
            console.log(surveyObjectToReturn);
            window.location.href = "/teamid=" + this.props.match.params.teamid + "/surveyid=" + String(surveyObjectToReturn.surveyid) + "/survey";
        }
    }

    render() {
        return (
            <div>
                <header className = "TopBlankSpace">
                    {/*creates space between header and rest of page*/} 
                </header>

                <header className = "Body">
                    <p>Choose <b>ONE</b> survey to take.</p>

                    <header className = "SurveySelectTable">
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

                    <Button variant="contained"
                        onClick={this.onSubmitClicked}>
                    Submit</Button>

                    <h1 style={{ color: 'red' }}>{ this.state.showError ? "Please select a survey to take" : null }</h1>

                </header>

                <header className = "BottomBlankSpace">
                    {/*creates space between page and footer*/} 
                </header>

            </div>
        )
    }
}

export default SelectSurvey;