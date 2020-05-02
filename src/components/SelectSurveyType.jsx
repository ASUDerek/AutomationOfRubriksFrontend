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

const SERVICE_API_URL = "https://automation-of-rubriks-service.herokuapp.com";
var SURVEY_TYPES_API_URL = "";   // Will be set when page loads

var surveyTypeSelected = false; //true if a survey type has been selected

var surveyTypeObjectToReturn = {

    surveytypeid: Number,
    type: String,
    description: String

};

class SelectSurveyType extends Component {

    constructor(props) {
        super(props)
        this.state = {

            surveyTypes: [{
                surveytypeid: Number,
                type: String,
                description: String
            }],
            selectedValue: 0

        }
        this.refreshSurvey.bind(this)
    }

    componentDidMount() {
        this.refreshSurvey();
    }

    refreshSurvey() {

        SURVEY_TYPES_API_URL = SERVICE_API_URL + "/surveytypes/showhidden=" + String(false);
        
        axios.get(SURVEY_TYPES_API_URL).then(
            response => {
                console.log(response);
                this.setState({ surveyTypes: response.data })
            }
        )
    }

    onSurveyTypeSelect = e =>{
        this.setState({selectedValue: e.target.value});
        this.state.surveyTypes.map (
            surveyType => {
                if(surveyType.type === e.target.id) {
                    surveyTypeObjectToReturn.surveytypeid = surveyType.surveytypeid;
                    surveyTypeObjectToReturn.type = surveyType.type;
                    surveyTypeObjectToReturn.description = surveyType.description;
                    console.log("SURVEY TYPE " + surveyTypeObjectToReturn.type + " WITH DECRIPTION " + String(surveyTypeObjectToReturn.description) + " WAS SELECTED!");
                }
                return 0;
            }
        )
        surveyTypeSelected = true;
    }

    onSubmitClicked = e => {

        if (surveyTypeSelected === false) { //no survey type has been selected

            console.log("NOT READY");
            this.setState({ showError: true });
        } 
        else {
            window.location.href = "/teamid=" + this.props.match.params.teamid + "/surveytypeid=" + String(surveyTypeObjectToReturn.surveytypeid) + "/surveys";
        }
    }

    render() {
        return (
            <div>
                <header className = "TopBlankSpace">
                    {/*creates space between header and rest of page*/} 
                </header>

                <header className = "Body">
                    <p>Choose <b>ONE</b> type of survey to take.</p>

                    <header className = "SurveyTypeSelectTable">
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Survey Type</TableCell>
                                        <TableCell>Survey Description</TableCell>
                                        <TableCell align="center">Select</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        this.state.surveyTypes.map(
                                            surveyType => (
                                                <TableRow key={surveyType.type}>
                                                    <TableCell>{surveyType.type}</TableCell>
                                                    <TableCell>{surveyType.description}</TableCell>
                                                    <TableCell>
                                                        <RadioGroup value={this.state.selectedValue} onChange={this.onSurveyTypeSelect}>
                                                            <Radio style={{color: '#F01716'}} value={surveyType.type} control={<Radio />} label={surveyType.type} id={surveyType.type}/>
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

                    <h1 style={{ color: 'red' }}>{ this.state.showError ? "Please select a survey type" : null }</h1>

                </header>

                <header className = "BottomBlankSpace">
                    {/*creates space between page and footer*/} 
                </header>

            </div>
        )
    }
}

export default SelectSurveyType;