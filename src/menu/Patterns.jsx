
import React from 'react';

import PropTypes from 'prop-types';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { PatternItem } from './components/PatternItem';

import * as patterns from '../patterns';



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
                            <PatternItem key={patterns.ConcentricCircles.displayName} 
                                pattern={patterns.ConcentricCircles} 
                                addLayer={this.props.addLayer} 
                                isBrush={false}
                            />
                            <PatternItem key={patterns.GradientPulse.displayName} 
                                pattern={patterns.GradientPulse} 
                                addLayer={this.props.addLayer} 
                                isBrush={false}
                            />
                            <PatternItem key={patterns.Fireflies.displayName} 
                                pattern={patterns.Fireflies} 
                                addLayer={this.props.addLayer} 
                                isBrush={false}
                            />
                            <PatternItem key={patterns.Radar.displayName} 
                                pattern={patterns.Radar} 
                                addLayer={this.props.addLayer} 
                                isBrush={false}
                            />
                            <PatternItem key={patterns.ShootingStars.displayName} 
                                pattern={patterns.ShootingStars} 
                                addLayer={this.props.addLayer} 
                                isBrush={false}
                            />
                            <PatternItem key={patterns.SineRing.displayName} 
                                pattern={patterns.SineRing} 
                                addLayer={this.props.addLayer} 
                                isBrush={false}
                            />
                            <PatternItem key={patterns.Swirly.displayName} 
                                pattern={patterns.Swirly} 
                                addLayer={this.props.addLayer} 
                                isBrush={false}
                            />
                            <PatternItem key={patterns.SwirlyZig.displayName} 
                                pattern={patterns.SwirlyZig} 
                                addLayer={this.props.addLayer} 
                                isBrush={false}
                            />
                        </List>
                    </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}
