import React, { Component } from 'react';
import '../App.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';

class Popup extends Component {
    render() {
        return (
            <div className='popup'>
                <p>Click "Rating Scale" to close</p>
                <header className = "RatingScale">
                    <TableContainer>
                        <Table size="small">
                            <TableBody>
                                <TableRow>
                                    <TableCell>0</TableCell>
                                    <TableCell>No Capability</TableCell>
                                    <TableCell>Not currently exhibiting behavior</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>1</TableCell>
                                    <TableCell>Beginning</TableCell>
                                    <TableCell>Beginning to exhibit practice or behavior</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>2</TableCell>
                                    <TableCell>Developing</TableCell>
                                    <TableCell>Applies new learning to develop practice or behavior</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>3</TableCell>
                                    <TableCell>Practicing</TableCell>
                                    <TableCell>Exhibits practice regularly</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>4</TableCell>
                                    <TableCell>Measuring</TableCell>
                                    <TableCell>Exhibits practice and measures effectiveness</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>5</TableCell>
                                    <TableCell>Innovating</TableCell>
                                    <TableCell>Actively experiments with new methodologies/practices <br></br>and uses metrics to measure the effects</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </header>
            </div>
        );
    }
}

export default Popup;