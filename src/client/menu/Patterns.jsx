
import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { allPatterns } from '../../patterns';
import { CanopySvg } from '../canopy';
import PatternProps from './PatternProps';


const patternOptionStyles = {
    button: {
        width: '100%'
    },
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
        const props = this.props.pattern.defaultProps();
        const patternInstance = new this.props.pattern().initialize({ props });

        this.setState({
            anchorEl: event.currentTarget,
            patternInstance,
            patternProps: props
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

                <Fab
                  className={classes.fab}
                  color="primary"
                  onClick={this.addPattern}
                >
                    <AddIcon />
                </Fab>
            </div>
        );
    }

    render () {
        const { classes, pattern } = this.props;
        const { anchorEl } = this.state;

        return (
            <Grid item sm={6} key={name}>
                <ButtonBase onClick={this.handleClick} className={classes.button}>
                <p>{pattern.displayName}</p>
                </ButtonBase>
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
            </Grid>
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
        padding: 0
    }

});

@withStyles(styles)
export default class Patterns extends React.Component {
    static propTypes = {
        addPattern: PropTypes.func.isRequired
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
                    <Grid container spacing={0}>
                        {allPatterns.map(Pattern =>
                            <PatternOption
                              key={Pattern.displayName}
                              pattern={Pattern}
                              addPattern={this.props.addPattern}
                            />
                        )}
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}
