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

const TEAMS_API_URL = "https://automation-of-rubriks-service.herokuapp.com/teams";

var teamSelected = false; //true if a team has been selected
var teamIDSelected = 0;
var teamNameSelected;

class TeamSelect extends Component {

    constructor(props) {
        super(props)
        this.state = {

            teams: [{
                
                teamid: Number,
                teamName: String

            }],
            selectedValue: 0
        }
        this.refreshSurvey.bind(this)
    }

    componentDidMount() {
        this.refreshSurvey();
    }

    refreshSurvey() {

        axios.get(TEAMS_API_URL).then(
            response => {
                console.log(response);
                this.setState({ teams: response.data })
            }
        )
    }

    onSubmitClicked = e => {

        if (teamSelected === false) { //no team has been selected
            console.log("NOT READY");
            this.setState({ showError: true });
        } 
        else {
            window.location.href = "/teamid=" + String(teamIDSelected) + "/surveytypes";
        }
    }

    onTeamSelect = e => {
        this.setState({selectedValue: e.target.value});
        this.state.teams.map (
            team => {
                if(team.teamName === e.target.id) {
                    teamNameSelected = team.teamName;
                    teamIDSelected = team.teamid;
                    console.log("TEAM " + teamNameSelected + " WITH TEAM ID OF " + String(teamIDSelected) + " WAS SELECTED!");
                }

                return 0;
            }
        )
        teamSelected = true;
    }

    render() {
        return (
            <div>
                <header className = "TopBlankSpace">
                    {/*creates space between header and rest of page*/} 
                </header>

                <header className = "Body">
                    <p>Choose <b>ONE</b> development team.</p>
                    
                    <header className = "TeamSelectTable">
                        <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Team Name</TableCell>
                                    <TableCell align="center">Select</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    this.state.teams.map(
                                        team=> (
                                            <TableRow key={team.teamName}>
                                                <TableCell>{team.teamName}</TableCell>
                                                <TableCell>
                                                    <RadioGroup value={this.state.selectedValue} onChange={this.onTeamSelect} >
                                                        <Radio style={{color: '#F01716'}} value={team.teamName} control={<Radio />} label={team.teamName} id={team.teamName}/>
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

                    <h1 style={{ color: 'red' }}>{ this.state.showError ? "Please select a team" : null }</h1>

                </header>
          
                <header className = "BottomBlankSpace">
                    {/*creates space between page and footer*/} 
                </header>
            </div>
        )
    }
}

export default TeamSelect;