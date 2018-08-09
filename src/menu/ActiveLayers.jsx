
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Card from '@material-ui/core/Card';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
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
        }).isRequired,
        layers: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string
        }))
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

    renderButtons () {
        const { layer, layers } = this.props;
        const index = layers.indexOf(layer);

        const buttons = [];

        if (index !== 0) buttons.push(<KeyboardArrowUp key="up" onClick={() => this.props.moveLayerUp(index)}/>);
        if (index !== layers.length - 1) buttons.push(<KeyboardArrowDown key="down" onClick={() => this.props.moveLayerDown(index)}/>);
        buttons.push(<DeleteIcon key="delete" onClick={() => this.props.removeLayer(index)}/>);

        return (
            <div>
                {buttons.map(button => <IconButton key={button}>{button}</IconButton>)}
            </div>
        );
    }

    getIndex () {
        return this.props.layers.indexOf(this.props.layer);
    }

    updateProp = (props) => this.props.layer.pattern.updateProps(props);

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
                      onChange={this.updateProp}
                    />
                </Card>
            </Popover>
        )
    }

    render () {
        const { key, name } = this.props.layer;
        const i = this.getIndex();
        const className = classNames('layer', {
            active: this.props.isActive
        });

        return (
            <ListItem className={className} onClick={() => this.props.setLayer(i)}>
                <ListItemText primary={`${name}: ${key}`} onClick={this.handleClick} />
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
                        {layers.map((layer, i) =>
                            <Layer
                              key={layer.key}
                              layer={layer}
                              layers={layers}
                              isActive={this.props.activeLayer === i}
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
