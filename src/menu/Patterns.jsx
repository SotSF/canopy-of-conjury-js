
import * as React from 'react';
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

import { CanopySvg } from '../canopy';
import * as patterns from '../patterns';
import PatternProps from './PatternProps';


const patternOptionStyles = {
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

@withStyles(patternOptionStyles)
class PatternOption extends React.Component {
    static propTypes = {
        addPattern: PropTypes.func.isRequired,
        pattern: PropTypes.func.isRequired
    };
    
    state = {
        anchorEl: null,
        patternInstance: null,
        patternProps: null
    };

    handleClick = event => {
        const patternProps = this.props.pattern.defaultProps();
        this.setState({
            anchorEl: event.currentTarget,
            patternInstance: new this.props.pattern(patternProps),
            patternProps
        });
    };

    handleClose = () => {
        this.setState({
            anchorEl: null,
            patternInstance: null,
            patternProps: null
        });
    };

    addPattern = () => {
        this.props.addPattern(this.props.pattern, this.state.patternProps);
        this.handleClose();
    };

    updateProps = (patternProps) => {
        this.setState({ patternProps });
        this.state.patternInstance.updateProps(patternProps);
    };

    renderPattern () {
        const { classes, pattern } = this.props;
        const { patternInstance, patternProps } = this.state;

        if (!patternInstance) return null;

        return (
            <div className={classes.patternWrapper}>
                <PatternProps
                  propTypes={pattern.propTypes}
                  values={patternProps}
                  onChange={this.updateProps}
                />

                <Card className={classNames(classes.card, classes.canopy)} raised>
                    <CanopySvg mini pattern={patternInstance} patternProps={patternProps} />
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
        );
    }

    render () {
        const { classes, pattern } = this.props;
        const { anchorEl } = this.state;

        return (
            <ListItem key={name} button>
                <ListItemText
                  primary={pattern.displayName}
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
                    {this.renderPattern()}
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
                        <PatternOption
                          pattern={patterns.Bubbles}
                          addPattern={this.props.addLayer}
                        />
                        <PatternOption
                          pattern={patterns.ConcentricCircles}
                          addPattern={this.props.addLayer}
                        />
                        <PatternOption
                          pattern={patterns.Fade}
                          addPattern={this.props.addLayer}
                        />
                        <PatternOption
                          pattern={patterns.Fireflies}
                          addPattern={this.props.addLayer}
                        />
                        <PatternOption
                          pattern={patterns.GradientFlow}
                          addPattern={this.props.addLayer}
                        />
                        <PatternOption
                          pattern={patterns.GradientPulse}
                          addPattern={this.props.addLayer}
                        />
                        <PatternOption
                          pattern={patterns.Heartbeat}
                          addPattern={this.props.addLayer}
                        />
                        <PatternOption
                          pattern={patterns.Kaleidoscope}
                          addPattern={this.props.addLayer}
                        />
                        <PatternOption
                          pattern={patterns.Map}
                          addPattern={this.props.addLayer}
                        />
                        <PatternOption
                          pattern={patterns.RainbowSpiral}
                          addPattern={this.props.addLayer}
                        />
                        <PatternOption
                          pattern={patterns.Radar}
                          addPattern={this.props.addLayer}
                        />
                        <PatternOption
                          pattern={patterns.ShootingStars}
                          addPattern={this.props.addLayer}
                        />
                        <PatternOption
                          pattern={patterns.SineRing}
                          addPattern={this.props.addLayer}
                        />
                        <PatternOption
                          pattern={patterns.Snake}
                          addPattern={this.props.addLayer}
                        />
                        <PatternOption
                          pattern={patterns.Swirly}
                          addPattern={this.props.addLayer}
                        />
                        <PatternOption
                          pattern={patterns.SwirlyZig}
                          addPattern={this.props.addLayer}
                        />
                        <PatternOption
                          pattern={patterns.Triangles}
                          addPattern={this.props.addLayer}
                        />
                    </List>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}
