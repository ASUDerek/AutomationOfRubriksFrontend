import React, { Component } from 'react';
import '../App.css';

class Footer extends Component {
    render() {
        return (
            <div>
                <header className = "App-footer">
                    <p>FOR INTERNAL STATE FARM USE ONLY</p>
                    <p>Contains information that may be disclosed outside State Farm without authorization.</p>
                    <p>Last Updated 04/24/2020</p>
                </header>
            </div>
        )
    }
}

export default Footer;