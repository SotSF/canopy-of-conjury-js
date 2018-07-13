
import React from 'react';
import PropTypes from 'prop-types';
import { ChromePicker } from 'react-color';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';

import Slider from '@material-ui/lab/Slider';


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
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    summaryCount: {
        flexShrink: 0
    },
    summaryHeader: {
        flexGrow: 1
    }
});

const LayerStyles = theme => ({
    topText: {
        verticalAlign: "top"
    },
    card: {
        display: "inline-block"
    }
})
@withStyles(LayerStyles)
class Layer extends React.Component {
    state = {
        anchorEl: null
    }

    static propTypes = {
        layer: PropTypes.shape({
            name: PropTypes.string
        }).isRequired,
        layers: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string
        }))
    };

    constructor(props) {
        super(props);
        this.state.pattern = props.layer.pattern;
    }

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    renderButtons () {
        const { layer, layers } = this.props;
        const index = layers.indexOf(layer);

        const buttons = [];

        if (index !== 0) buttons.push(<KeyboardArrowUp key="up" onClick={() => this.props.moveLayerUp(index)}/>);
        if (index !== layers.length - 1) buttons.push(<KeyboardArrowDown key="down" onClick={() => this.props.moveLayerDown(index)}/>);
        buttons.push(<DeleteIcon key="delete" onClick={() => this.props.removeLayer(index)}/>);

        return (
            <div>
                {buttons.map(button =>
                    <IconButton>
                        {button}
                    </IconButton>
                )}
            </div>
        );
    }

    getIndex() {
        return this.props.layers.indexOf(this.props.layer);
    }

    // NEED TO PASS THESE CHANGES UP TO INDEX
    updateParam(name, val) {
        this.setState((prevState) => {
            prevState.pattern.params[name] = val;
            return { pattern: prevState.pattern }
        });
    }

    removeFilter(filter) {
        const {pattern} = this.props.layer;
        const i = pattern.filters.indexOf(filter);
        pattern.filters.splice(i, 1);
    }

    renderControls = () => {
        const { pattern, key } = this.props.layer;
        const controls = [];
        pattern.constructor.menuParams.map(control => {
        if (typeof control.defaultVal == "string") {
            controls.push(<ChromePicker key={key + "-" + control.name} disableAlpha={true} color={pattern.params[control.name]} 
                onChange={(val) => this.updateParam(control.name,val.hex)} />)
        }
        else if (typeof control.defaultVal == "number") {
            controls.push(
            <div key={key + "-" + control.name}>
                <Typography variant="caption">{control.name}: {pattern.params[control.name]}</Typography>
                <Slider value={pattern.params[control.name]} min={control.min} max={control.max} step={1} 
                    onChange={(e,val)=>this.updateParam(control.name, val)}/>
            </div>
            )
        }
        else if (typeof control.defaultVal == "boolean") {
            controls.push(
                <FormControlLabel key={key + "-" + control.name} label={control.name} control={
                    <Checkbox label={control.name} checked={pattern.params[control.name]} color="primary" 
                    onChange={() => this.updateParam(control.name,!pattern.params[control.name])} />} 
                />
            )
        }});
        return controls;
    }

    renderFilters() {
        const {pattern} = this.props.layer;
        if (pattern.filters.length == 0) return;
        return(<Card className={[this.props.classes.card, this.props.classes.topText]}>
            <CardContent>
                {pattern.filters.map(filter => 
                <IconButton>
                    <Typography>{filter.constructor.displayName}</Typography>
                    <DeleteIcon key="delete" onClick={() => this.removeFilter(filter)}/>
                </IconButton>
                )}
            </CardContent>
        </Card>);
    }

    renderPopover() {
        const { pattern } = this.props.layer;
        const { anchorEl } = this.state;
        return (<Popover
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
                <Card className={this.props.classes.card}>
                    <CardContent>
                        {this.renderControls()}
                        <Typography variant="caption">Brightness: {pattern.params.Brightness}</Typography>
                        <Slider value={pattern.params.Brightness} min={1} max={100} step={1} 
                            onChange={(e,val)=>this.updateParam("Brightness", val)}/>
                    </CardContent>
                </Card>
                {this.renderFilters()}
            </Popover>
        )
    }

    render () {
        const { key, name } = this.props.layer;
        const i = this.getIndex();
        return (
            <ListItem className={this.props.isActive ? "layer active" : "layer"} onClick={() => this.props.setLayer(i)}>
                <ListItemText primary={name + ":" + key} onClick={this.handleClick} />
                <ListItemSecondaryAction>
                    {this.renderButtons()}
                </ListItemSecondaryAction>
                {this.renderPopover()}
                
            </ListItem>
        );
    }
}

@withStyles(styles)
export default class ActiveLayers extends React.Component {
    static propTypes = {
        layers: PropTypes.array
    };

    render () {
        const { classes, layers } = this.props;
        return (
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <div className={classes.summaryHeader}>
                        <Typography className={classes.heading}>Active Layers</Typography>
                    </div>
                    <div className={classes.summaryCount}>
                        <Typography className={classes.secondaryHeading}>{layers.length}</Typography>
                    </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{
                        root: classes.panelDetails
                    }}>
                        <List dense disablePadding classes={{
                            root: classes.list
                        }}>
                            {layers.map((layer,i) => 
                                <Layer 
                                    key={layer.key}
                                    layer={layer} 
                                    layers={layers} 
                                    isActive={this.props.activeLayer == i}
                                    moveLayerUp={this.props.moveLayerUp} 
                                    moveLayerDown={this.props.moveLayerDown} 
                                    removeLayer={this.props.removeLayer}
                                    setLayer={this.props.setLayer}
                                />
                            )}
                        </List>
                    </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}
