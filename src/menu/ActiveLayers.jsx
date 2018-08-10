
import React from 'react';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import PatternProps from './PatternProps';


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

const LayerStyles = {
    topText: {
        verticalAlign: "top"
    },
    card: {
        display: "inline-block"
    }
};

@withStyles(LayerStyles)
class Layer extends React.Component {
    static propTypes = {
        layer: PropTypes.shape({
            name: PropTypes.string
        }).isRequired
    };

    state = {
        anchorEl: null,
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    updateProps = (props) => {
        this.props.layer.pattern.updateProps(props);

        // Force an update because the props have changed, but React doesn't know about it
        this.forceUpdate();
    };

    removeFilter (filter) {
        const { pattern } = this.props.layer;
        const i = pattern.filters.indexOf(filter);
        pattern.filters.splice(i, 1);
    }

    renderPopover() {
        const { layer } = this.props;
        const { anchorEl } = this.state;
        return (
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
                <Card className={this.props.classes.card}>
                    <PatternProps
                      propTypes={layer.pattern.constructor.propTypes}
                      values={layer.pattern.props}
                      onChange={this.updateProps}
                    />
                </Card>
            </Popover>
        )
    }

    render () {
        const { layer } = this.props;
        return (
            <ListItem button className="layer">
                <ListItemText onClick={this.handleClick} primary={layer.name} />
                <ListItemSecondaryAction>
                    <DeleteIcon onClick={() => this.props.removeLayer(layer)} />
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
                        {layers.map((layer, i) =>
                            <Layer
                              key={i}
                              layer={layer}
                              removeLayer={this.props.removeLayer}
                            />
                        )}
                    </List>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}
