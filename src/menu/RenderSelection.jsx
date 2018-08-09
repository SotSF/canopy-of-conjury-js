
import React from 'react';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    formControl: {
        flexShrink: 0,
        margin: theme.spacing.unit,
        marginTop: theme.spacing.unit * 3,
        minWidth: 120
    },
});

@withStyles(styles)
export default class RenderSelection extends React.Component {
    state = {
        selection: '3D'
    };

    changeSelection = event => this.setState({ selection: event.target.value });

    render () {
        return (
            <FormControl className={this.props.classes.formControl}>
                <InputLabel htmlFor="render-selection">Render Mode</InputLabel>
                <Select
                    value={this.state.selection}
                    onChange={this.changeSelection}
                    inputProps={{
                        id: 'render-selection',
                    }}
                >
                    <MenuItem value="3D">3D</MenuItem>
                    <MenuItem value="Polar">Polar</MenuItem>
                    <MenuItem value="Cartesian">Cartesian</MenuItem>
                </Select>
            </FormControl>
        )
    }
}
