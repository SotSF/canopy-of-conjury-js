
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

import { Gif } from '../../patterns';
import Slider from '@material-ui/lab/Slider';

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
export class PatternItem extends React.Component {
    state = {
        anchorEl: null,
        params: {}
    };

    constructor(props) {
        super(props);
        props.pattern.menuParams.forEach((control) => {
            this.state.params[control.name] = control.defaultVal
        });
    }

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
        if (this.props.isBrush) { this.props.activateBrush(); }
    };

    handleClose = () => {
        this.setState({ anchorEl: null }); 
        if (this.props.pattern == Gif) { 
            this.setState((prevState) => {
                prevState.params["Filepath"] = "";
                return { params: prevState.params }
            });
        }
    };

    addPattern = () => {
        this.props.addLayer(this.props.pattern, this.state.params);
            if (this.props.pattern == Gif) { this.setState((prevState) => {
                prevState.params["Filepath"] = "";
                return { params: prevState.params }
            });
        }
    }

    updateParam = (name, val) => {
        this.setState((prevState) => {
            prevState.params[name] = val;
            return { params: prevState.params }
        }, () => {
            if (this.props.isBrush) {
                for(var key in this.state.params) {
                    this.props.pattern.setParams[key] = this.state.params[key];
                }
            }
        });
    }

    renderAddPattern() {
        if (!this.props.isBrush) {
            return(
                <CardActions>
                    <Button variant="contained" size="small" color="primary" onClick={this.addPattern}>Add</Button>
                </CardActions>
            );
        }
    }

    renderControls = () => {
        const { key, pattern } = this.props;
        if (pattern.menuParams == null) return;
        const controls = [];
        pattern.menuParams.map(control => {
            if (control.type == "GIF") {
                controls.push(
                    <input type="file" accept="image/gif" value={this.state.params[control.name]} 
                    onChange={
                        (e) => { 
                            this.updateParam(control.name,e.target.value) 
                            this.updateParam("Blob", e.target.files[0]);
                        }
                    }
                    />
                )
            }
            else if (typeof control.defaultVal == "object") {
                controls.push(<ChromePicker key={key + "-" + control.name} disableAlpha={true} color={this.state.params[control.name]} 
                    onChange={(val) => this.updateParam(control.name,val.rgb)} />)
            }
            else if (typeof control.defaultVal == "number") {
                controls.push(
                <div key={key + "-" + control.name}>
                    <Typography variant="caption">{control.name}: {this.state.params[control.name]}</Typography>
                    <Slider value={this.state.params[control.name]} min={control.min} max={control.max} step={1} 
                        onChange={(e,val)=>this.updateParam(control.name, val)}/>
                </div>
                )
            }
            else if (typeof control.defaultVal == "boolean") {
                controls.push(
                    <FormControlLabel key={key + "-" + control.name} label={control.name} control={
                        <Checkbox label={control.name} checked={this.state.params[control.name]} color="primary" 
                        onChange={() => this.updateParam(control.name,!this.state.params[control.name])} />} 
                    />
                )
        }});
        return controls;
    }
    render () {
        const { classes, pattern, key } = this.props;
        const { anchorEl } = this.state;

        return (
            <ListItem key={pattern.displayName} button>
                <ListItemText
                  primary={pattern.displayName}
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
                           {this.renderControls()}
                        </CardContent>
                        {this.renderAddPattern()}
                    </Card>
                </Popover>
            </ListItem>
        )
    }
}