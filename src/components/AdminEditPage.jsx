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
import TextField from '@material-ui/core/TextField';

const ADD_TEAM_API_URL = "https://automation-of-rubriks-service.herokuapp.com/addteam";
const TEAMS_API_URL = "https://automation-of-rubriks-service.herokuapp.com/teams";
const EDIT_TEAM_API_URL = "https://automation-of-rubriks-service.herokuapp.com/editteam";
const DELETE_TEAM_API_URL = "https://automation-of-rubriks-service.herokuapp.com/deleteteam";

var teamSelected = false; //true if a team has been selected
var teamNameSelected = "";
var teamIDSelected = 0;

var teamObjectToReturn = {
    teamid : Number,
    teamName : String

};

class AdminEditPage extends Component {

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

        teamObjectToReturn.teamName = ""; // Preset the teamName to know if it has been set or not
    }

    onAddTeamButtonClicked(e) {
        
        e.preventDefault();

        this.setState({ showDeleteTeamError: false });
        
        if (teamObjectToReturn.teamName !== ""){
            //teamObjectToReturn.teamName = this.newTeam.value;
            teamObjectToReturn.teamid = 22

            console.log(teamObjectToReturn)
            
            axios.post(ADD_TEAM_API_URL, teamObjectToReturn).then(
                response => {
                    console.log(response.data);
                    this.refreshSurvey();
                }
            )
        }

        else {
            this.setState({ showError: true });
        }
    }

    onUpdateTeamButtonClicked = e => {

        e.preventDefault();

        this.setState({ showError: false });
        this.setState({ showDeleteTeamError: false });
        this.setState({ showUpdateTeamError: false });

        if (teamObjectToReturn.teamName !== ""){
            //teamObjectToReturn.teamName = this.newTeam.value;
            teamObjectToReturn.teamid = 22
    
            if (teamSelected === false) { //no team was selected
                console.log("Not Ready");
                this.setState({ showUpdateTeamError: true });
            }
    
            else {
                var endcoded_team_name = encodeURI(teamNameSelected);
                var send_edit_request = EDIT_TEAM_API_URL + "/" + endcoded_team_name;
    
                axios.put(send_edit_request, teamObjectToReturn).then(
                    response => {
                        console.log(response.data);
                        this.refreshSurvey();
                    }
                )
            }
        }

        else {
            this.setState({ showError: true });
        }
    }

    onDeleteTeamButtonClicked = e => {

        e.preventDefault();

        this.setState({ showError: false });
        this.setState({ showUpdateTeamError: false });

        if (teamSelected === false) { //no team was selected
            console.log("Not Ready");
            this.setState({ showDeleteTeamError: true });
        }

        else {
            var endcoded_team_name = encodeURI(teamNameSelected);
            var send_delete_request = DELETE_TEAM_API_URL + "/" + endcoded_team_name;

            axios.delete(send_delete_request).then(
                response => {
                    console.log(response.data);
                    this.refreshSurvey();
                }
            )
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

    onTeamTextChange = e => {
        teamObjectToReturn.teamName = e.target.value;
    }

    onReportsClicked = e => {
        window.location.href = "/admin/reports";
    }

    onSurveyTemplateClicked = e => {
        window.location.href = "/admin/surveytemplates";
    }

    onDeleteSurveyTemplateClicked = e => {
        window.location.href = "/admin/edittemplate";
    }

    render() {
        return(
            <div>
                <header className = "TopBlankSpace">
                     {/*creates space between header and rest of page*/} 
                </header>

                <header className = "Body">
                    <h1>Admin Edit Page</h1>

                    <Button variant="contained"
                        onClick={this.onReportsClicked}>
                    Reports</Button>

                    <Button variant="contained"
                        onClick={this.onSurveyTemplateClicked}>
                    Survey Templates</Button>

                    <h2>Teams</h2>
                    
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

                    <TextField id="addTeam" label="new name" onChange={this.onTeamTextChange}/>

                    <Button variant="contained"
                        onClick={(e) => {this.onAddTeamButtonClicked(e)}}>
                    Add Team</Button>

                    <Button variant="contained"
                        onClick={this.onUpdateTeamButtonClicked}>
                    Edit Team</Button>

                    <Button variant="contained"
                        onClick={this.onDeleteTeamButtonClicked}>
                    Delete Team</Button>

                    <p>To add a team, enter team name and click "add team."</p>
                    <p>To edit a team, select team then enter new team name and click "edit team."</p>
                    <p>To delete a team, select team then click "delete team."</p>

                    <h1 style={{ color: 'red' }}>{ this.state.showError ? "Please input a new team name" : null }</h1>
                    <h1 style={{ color: 'red' }}>{ this.state.showUpdateTeamError ? "Please choose a team to update" : null }</h1>
                    <h1 style={{ color: 'red' }}>{ this.state.showDeleteTeamError ? "Please choose a team to delete" : null }</h1>
                
                </header>
 
                <header className = "BottomBlankSpace">
                    {/*creates space between page and footer*/} 
                </header>
               
            </div>
        )
    }
}

export default AdminEditPage;