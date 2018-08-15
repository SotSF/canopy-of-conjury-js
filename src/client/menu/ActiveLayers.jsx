
import React from 'react';
import PropTypes from 'prop-types';

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

const PatternStyles = {
    topText: {
        verticalAlign: "top"
    },
    card: {
        display: "inline-block"
    }
};

@withStyles(PatternStyles)
class Pattern extends React.Component {
    static propTypes = {
        pattern: PropTypes.shape({
            instance: PropTypes.object,
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
        this.props.pattern.instance.updateProps(props);

        // Force an update because the props have changed, but React doesn't know about it
        this.forceUpdate();
    };

    renderPopover() {
        const { pattern } = this.props;
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
                <PatternProps
                  propTypes={pattern.instance.constructor.propTypes}
                  values={pattern.instance.props}
                  onChange={this.updateProps}
                />
            </Popover>
        );
    }

    render () {
        const { pattern } = this.props;
        return (
            <ListItem button className="layer">
                <ListItemText onClick={this.handleClick} primary={pattern.name} />
                <ListItemSecondaryAction>
                    <DeleteIcon onClick={() => this.props.removePattern(pattern.id)} />
                </ListItemSecondaryAction>
                {this.renderPopover()}
            </ListItem>
        );
    }
}

@withStyles(styles)
export default class ActivePatterns extends React.Component {
    static propTypes = {
        patterns: PropTypes.array
    };

    render () {
        const { classes, patterns } = this.props;

        return (
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <div className={classes.summaryHeader}>
                        <Typography className={classes.heading}>Active Patterns</Typography>
                    </div>
                    <div className={classes.summaryCount}>
                        <Typography className={classes.secondaryHeading}>{patterns.length}</Typography>
                    </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{
                    root: classes.panelDetails
                }}>
                    <List dense disablePadding classes={{
                        root: classes.list
                    }}>
                        {patterns.map(pattern =>
                            <Pattern
                              key={pattern.id}
                              pattern={pattern}
                              removePattern={this.props.removePattern}
                            />
                        )}
                    </List>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}
