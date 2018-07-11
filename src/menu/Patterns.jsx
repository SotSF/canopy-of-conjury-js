
import React from 'react';
import { ChromePicker } from 'react-color';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Slider from '@material-ui/lab/Slider';

import * as patterns from '../patterns';



const styles = theme => ({
    heading: {
        fontSize: theme.typography.pxToRem(15),
    },
    list: {
        width: '100%',
    },
    panelDetails: {
        padding: 0,
    },
});

const patternMenustyles = {
    card: {
        backgroundColor: '#626262',
        minWidth: 275,
    },
    title: {
        marginBottom: 16,
        fontSize: 14,
    },
};

@withStyles(patternMenustyles)
class PatternMenu extends React.Component {
    state = {
        anchorEl: null,
        params: {}
    };

    constructor(props) {
        super(props);
        props.controls.forEach((control) => {
            this.state.params[control.name] = control.defaultVal
        });
    }

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    addPattern = () => {
        this.props.addLayer(this.props.pattern, this.props.name, this.state.params);
    }

    updateParam = (name, val) => {
        this.setState((prevState) => {
            prevState.params[name] = val;
            return { params: prevState.params }
        });
    }

    renderControls(control) {
        if (typeof control.defaultVal == "string") {
            return (<ChromePicker disableAlpha={true} color={this.state.params[control.name]} 
                onChange={(val) => this.updateParam(control.name,val.hex)} />)
        }
        else if (typeof control.defaultVal == "number") {
            return (
            <div>
                <Typography variant="caption">{control.name}: {this.state.params[control.name]}</Typography>
                <Slider value={this.state.params[control.name]} min={control.min} max={control.max} step={1} 
                    onChange={(e,val)=>this.updateParam(control.name, val)}/>
            </div>
            )
        }
        else if (typeof control.defaultVal == "boolean") {
            return (
                <FormControlLabel label={control.name} control={
                    <Checkbox label={control.name} checked={this.state.params[control.name]} color="primary" 
                    onChange={() => this.updateParam(control.name,!this.state.params[control.name])} />} 
                />
            )
        }
    }
    render () {
        const { classes, pattern, name } = this.props;
        const { anchorEl } = this.state;

        return (
            <ListItem key={name} button>
                <ListItemText
                  primary="Concentric Circles"
                  onClick={this.handleClick}
                />
                <Popover
                  open={!!anchorEl}
                  anchorEl={anchorEl}
                  onClose={this.handleClose}
                  anchorOrigin={{
                      vertical: 'center',
                      horizontal: 'right',
                  }}
                  transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                  }}
                >
                    <Card className={classes.card}>
                        <CardContent>
                           {this.props.controls.map(control =>
                                this.renderControls(control)
                           )}
                        </CardContent>
                        <CardActions>
                            <Button variant="contained" size="small" color="primary" onClick={this.addPattern}>Add</Button>
                        </CardActions>
                    </Card>
                </Popover>
            </ListItem>
        )
    }
}

@withStyles(styles)
export default class Patterns extends React.Component {
    static propTypes = {
        addLayer: PropTypes.func.isRequired
    };

    render () {
        const { classes } = this.props;
        return (
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Patterns</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{
                        root: classes.panelDetails
                    }}>
                        <List dense disablePadding classes={{
                            root: classes.list
                        }}>
                            <PatternMenu pattern={patterns.ConcentricCircles} name="Circles" addLayer={this.props.addLayer} 
                                controls={[
                                    {name: "Color", defaultVal: "#fff"},
                                    {name: "Qty", defaultVal: 1, min: 1, max: 10},
                                    {name: "Width", defaultVal: 1, min: 1, max: 5},
                                    {name: "Velocity", defaultVal: 1, min: 1, max: 5},
                                    {name: "GrowOut", defaultVal: true}
                                ]}
                            />
                        </List>
                    </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}
