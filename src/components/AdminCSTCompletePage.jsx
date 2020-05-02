import React, { Component } from 'react';
import '../App.css';
import Button from '@material-ui/core/Button';

class AdminCSTCompletePage extends Component {

    onSubmitClicked = e => {
        window.location.href = "/admin";
    }

    onAddClicked = e => {
        //go to edit survey template page
        window.location.href = "/admin/surveytypeid=" + this.props.match.params.surveytypeid + "/edittemplate";
    }

    render() {
        return(
            <div>
                <header className = "TopBlankSpace">
                     {/*creates space between header and rest of page*/} 
                </header>

                <header className = "Body">
                    <h1>Survey Template Saved!</h1>
                    
                    <Button variant="contained"
                        onClick={this.onAddClicked}>
                    Add Survey or make changes to Survey Template</Button>

                    <br></br>
                    <br></br>

                    <Button variant="contained"
                        onClick={this.onSubmitClicked}>
                    Return to Admin Home</Button>

                </header>

                <header className = "BottomBlankSpace">
                    {/*creates space between page and footer*/} 
                </header>
               
            </div>
        )
    }
}

export default AdminCSTCompletePage;