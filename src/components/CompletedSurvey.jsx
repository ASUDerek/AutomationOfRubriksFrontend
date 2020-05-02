import React, { Component } from 'react';
import axios from 'axios'
import '../App.css';
import Button from '@material-ui/core/Button';

const SERVICE_API_URL = "https://automation-of-rubriks-service.herokuapp.com";

var RESULTS_API_URL = "";   // Will be set when the page loads

const END_OF_RESULTS_URL = "/results"

var today = new Date();
var date = today.getMonth()+1+'-'+today.getDate()+'-'+today.getFullYear();

class CompletedSurvey extends Component {

    constructor(props) {
        super(props)
        this.state = {
            score: 0,
            message: null
        }
        this.refreshSurvey.bind(this)

    }

    componentDidMount() {
        this.refreshSurvey();
    }

    refreshSurvey() {

        RESULTS_API_URL = SERVICE_API_URL + "/teamid=" + this.props.match.params.teamid + "/surveyid=" + this.props.match.params.surveyid + END_OF_RESULTS_URL;

        axios.get(RESULTS_API_URL).then(
            response => {
                console.log(response);
                this.setState({ score: response.data })
            }
        )
    }

    onReturnClicked() {
        window.location.href = "/";
    }

    render() {
        return (
            <div>
                <header className = "TopBlankSpace">
                    {/*creates space between header and rest of page*/} 
                </header>
                
                <header className = "Body">
                    <b>Survey completed on {date}</b>

                    <br></br>
                    <br></br>

                    <Button variant="contained"
                        onClick={this.onReturnClicked}>
                    Return Home</Button>

                </header>

                <header className = "BottomBlankSpace">
                    {/*creates space between page and footer*/} 
                </header>

            </div>
        )
    }
}

export default CompletedSurvey;