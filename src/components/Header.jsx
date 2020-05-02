import React, { Component } from 'react';
import '../App.css';
import logo from '../StateFarmLogo.png';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

function SimpleMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLoginClicked = e => {
    window.location.href = "/login";
  }

  const onHomeClicked = e => {
    window.location.href = "/admin";
  }

  const onReportsClicked = e => {
    window.location.href = "/admin/reports";
  }

  const onTemplatesClicked = e => {
    window.location.href = "/admin/surveytemplates";
  }

  return (
    <div>
      <Button variant="contained" style={{backgroundColor: '#F01716'}} aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        Admin Options
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem value="login" onClick={onLoginClicked}>Login</MenuItem>
        <MenuItem value="home" onClick={onHomeClicked}>Home</MenuItem>
        <MenuItem value="reports" onClick={onReportsClicked}>Reports</MenuItem>
        <MenuItem value="templates" onClick={onTemplatesClicked}>Survey Templates</MenuItem>
      </Menu>
    </div>
  );
}

class Header extends Component {

  onLogoClicked() {
    window.location.href = "/";
  } 

    render() {
        return (
            <div>
                <Grid container className ="NavMenu" spacing={2} alignItems="flex-end" justify="space-between">
                    <Grid item xs={0.1}></Grid>
                    <Grid item xs={3.5}>
                        <img src = {logo} width="400" height="55" alt = "Logo" onClick={this.onLogoClicked}/>
                    </Grid>
                    <Grid item xs={5}>
                        <SimpleMenu />
                    </Grid>
                    <Grid item xs={3}>
                        <p align="right"> 
                            <b>Continuous Delivery Dojo<br>
                            </br>Team/Agile Maturity Evaluation</b>
                        </p>
                    </Grid>
                    <Grid item xs={0.1}></Grid>
                </Grid>
            </div>
        )
    }
}

export default Header;