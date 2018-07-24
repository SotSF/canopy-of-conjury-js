
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Canopy from '../canopy/Canopy';
import { GradientPulse } from '../patterns';
import { ColorPicker } from './components';



const concentricCirclesStyles = {
    canopy: {
        marginLeft: '0.2rem',
    },
    card: {
        backgroundColor: '#626262',
    },
    fab: {
        position: 'absolute',
        right: '-20px',
        top: '10px',
    },
    parameters: {
        padding: '1rem'
    },
    patternWrapper: {
        display: 'flex',
        alignItems: 'flex-start',
    },
    popover: {
        backgroundColor: 'transparent',
        overflow: 'visible',
    },
    title: {
        marginBottom: 16,
        fontSize: 14,
    },
};

@withStyles(concentricCirclesStyles)
class ConcentricCircles extends React.Component {
    static propTypes = {
        addPattern: PropTypes.func.isRequired
    };

    state = {
        anchorEl: null
    };

    handleClick = event => {
        this.setState({
            anchorEl: event.currentTarget,
            pattern: new GradientPulse()
        });
    };

    handleClose = () => {
        this.setState({
            anchorEl: null,
            pattern: null
        });
    };

    addPattern = () => {
        this.props.addPattern();
    };

    render () {
        const { classes } = this.props;
        const { anchorEl, pattern } = this.state;

        return (
            <ListItem key={name} button>
                <ListItemText
                  primary="Concentric Circles"
                  onClick={this.handleClick}
                />
                <Popover
                  open={!!anchorEl}
                  anchorEl={anchorEl}
                  elevation={0}
                  onClose={this.handleClose}
                  anchorOrigin={{
                      vertical: 'center',
                      horizontal: 'right',
                  }}
                  transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                  }}
                  PaperProps={{
                      classes: { root: classes.popover }
                  }}
                >
                    <div className={classes.patternWrapper}>
                        <Card className={classNames(classes.card, classes.parameters)} raised>
                            <ColorPicker />
                        </Card>

                        <Card className={classNames(classes.card, classes.canopy)} raised>
                            <Canopy mini pattern={pattern} />
                        </Card>

                        <Button
                          className={classes.fab}
                          color="primary"
                          mini
                          onClick={this.addPattern}
                          variant="fab"
                        >
                            <AddIcon />
                        </Button>
                    </div>
                </Popover>
            </ListItem>
        )
    }
}

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
                            <ConcentricCircles addPattern={this.props.addLayer} />
                        </List>
                    </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}
