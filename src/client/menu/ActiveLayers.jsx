
import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import messenger from '../messenger';
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
        display: 'block'
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

const SaveButtonStyles = theme => ({
    root: {
        margin: `${theme.spacing.unit}px 0 ${theme.spacing.unit}px 24px`
    },
    card: {
        backgroundColor: '#626262',
        padding: '1rem',
        display: 'flex',
        alignItems: 'baseline'
    },
    saveButton: {
        marginLeft: theme.spacing.unit
    }
});

const MenuPopoverStyles = theme => ({
    root: {
        marginLeft: theme.spacing.unit
    }
});

const MenuPopover = withStyles(MenuPopoverStyles)(
    props => (
        <Popover
            open={!!props.anchorEl}
            anchorEl={props.anchorEl}
            onClose={props.onClose}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            PaperProps={{
                classes: props.classes
            }}
        >
            {props.children}
        </Popover>
    )
);

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

        messenger.updateProps(this.props.pattern.id, props);

        // Force an update because the props have changed, but React doesn't know about it
        this.forceUpdate();
    };

    render () {
        const { pattern } = this.props;
        return (
            <ListItem button className="layer">
                <ListItemText onClick={this.handleClick} primary={pattern.name} />
                <ListItemSecondaryAction>
                    <DeleteIcon onClick={() => this.props.removePattern(pattern.id)} />
                </ListItemSecondaryAction>
                
                <MenuPopover
                  anchorEl={this.state.anchorEl}
                  onClose={this.handleClose}
                >
                    <PatternProps
                      propTypes={pattern.instance.constructor.propTypes}
                      values={pattern.instance.props}
                      onChange={this.updateProps}
                    />
                </MenuPopover>
            </ListItem>
        );
    }
}

@withStyles(SaveButtonStyles)
class SaveButton extends React.Component {
    state = {
        anchorEl: null,
        patternSetName: ''
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    savePatternSet = () => {
        messenger.savePatternSet(this.state.patternSetName);
    };
    
    updateName = (event) => {
        this.setState({ patternSetName: event.target.value });
    };

    render () {
        const { classes } = this.props;

        // Can't save the pattern set if no name is entered
        const disabled = this.state.patternSetName === '';

        return [
            <Button
              className={classes.root}
              color="primary"
              key="button"
              onClick={this.handleClick}
              size="small"
              variant="contained"
            >
                Save Pattern Set
            </Button>,
            <MenuPopover
              anchorEl={this.state.anchorEl}
              key="popover"
              onClose={this.handleClose}
            >
                <Card className={classes.card}>
                    <TextField
                      id="pattern-set-name"
                      label="Name"
                      onChange={this.updateName}
                      value={this.state.patternSetName}
                    />

                    <Button
                      className={classes.saveButton}
                      color="primary"
                      disabled={disabled}
                      onClick={this.savePatternSet}
                      size="small"
                      variant="contained"
                    >
                        Save
                    </Button>
                </Card>
            </MenuPopover>
        ];
    }
}

@withStyles(styles)
export default class ActivePatterns extends React.Component {
    static propTypes = {
        patterns: PropTypes.array
    };

    renderSaveButton () {
        const { patterns } = this.props;

        if (patterns.length === 0) return null;

        return <SaveButton />;
    }

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

                    {this.renderSaveButton()}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}
