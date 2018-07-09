
import React from 'react';
import PropTypes from 'prop-types';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';


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
    },
});

class Layer extends React.Component {
    static propTypes = {
        layer: PropTypes.shape({
            name: PropTypes.string
        }).isRequired,
        layers: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string
        }))
    };

    renderButtons () {
        const { layer, layers } = this.props;
        const index = layers.indexOf(layer);

        const buttons = [];

        if (index !== 0) buttons.push(<KeyboardArrowUp key="up" />);
        if (index !== layers.length - 1) buttons.push(<KeyboardArrowDown key="down" />);
        buttons.push(<DeleteIcon key="delete" />);

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

    render () {
        const { name } = this.props.layer;
        return (
            <ListItem>
                <ListItemText primary={name} />
                <ListItemSecondaryAction>
                    {this.renderButtons()}
                </ListItemSecondaryAction>
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
                        <List classes={{
                            root: classes.list
                        }}>
                            {layers.map(layer => <Layer layer={layer} layers={layers} />)}
                        </List>
                    </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}
