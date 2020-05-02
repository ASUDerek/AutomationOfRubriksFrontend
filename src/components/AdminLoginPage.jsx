import React, { Component } from 'react';
import axios from 'axios';
import '../App.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const ADMIN_LOGIN_API_URL = "https://automation-of-rubriks-service.herokuapp.com/admin/login";

class AdminLoginPage extends Component {

    constructor(props) {
        super(props)
        this.state = {

            credentials: {
                username: String,
                password: String
            }

        }
    }

    componentDidMount() {
        this.setState({

            credentials: {
                username : "",
                hidden: true,
                password : ""
            }

        });
    }

    onAdminLoginClicked() {

        this.state.credentials.username = document.getElementById("username").value;
        this.state.credentials.password = document.getElementById("password").value;

        this.setState({ showError: false });
        this.setState({ showBlankError: false });

        if(this.state.credentials.username !== "" && this.state.credentials.password !== "") {

            var SEND_CREDENTIALS = ADMIN_LOGIN_API_URL + "/username=" + this.state.credentials.username + "/password=" + this.state.credentials.password;

            axios.get(SEND_CREDENTIALS).then(
                response => {
                    console.log(response.data);
                    
                    if(response.data === true) {    // If the username and password are valid
    
                        window.location.href = "/admin"; 

                    } else {    // If the username or password are invalid
    
                        console.log("INCORRECT CREDENTIALS!");

                        document.getElementById("username").value = "";
                        document.getElementById("password").value = "";

                        this.setState({ showError: true });
                    }
                }
            )
            
        } else {
            console.log("Enter the username and password to login.");
            this.setState({ showBlankError: true });
        }
    }

    render() {
        return(
            <div>
                <header className = "TopBlankSpace">
                    {/*creates space between header and rest of page*/} 
                </header>

                <header className = "Body">
                    <h1>Admin Login</h1>

                    <br></br>

                    <TextField id="username" label="username" />

                    <br></br>

                    <TextField id="password" label="password" type="password" />

                    <br></br>
                    <br></br>

                    <Button variant="contained"
                        onClick={this.onAdminLoginClicked.bind(this)}>
                    Login</Button>

                    <h1 style={{ color: 'red' }}>{ this.state.showBlankError ? "Please enter both fields" : null }</h1>
                    <h1 style={{ color: 'red' }}>{ this.state.showError ? "Incorrect Username or Password" : null }</h1>
               
                </header>

                <header className = "BottomBlankSpace">
                    {/*creates space between page and footer*/} 
                </header>

            </div>
        )
    }
}

export default AdminLoginPage;