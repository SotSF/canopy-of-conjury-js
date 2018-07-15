
import React from 'react';
import PropTypes from 'prop-types';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { PatternItem } from './components/PatternItem';
import * as brushes from '../brushes';

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
export default class Brushes extends React.Component {
    static propTypes = {
        activateBrush: PropTypes.func.isRequired
    };

    activateBrush (type) {
        this.props.activateBrush(type);
    }

    render () {
        const { classes } = this.props;
        return (
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Click to Draw</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{
                        root: classes.panelDetails
                    }}>
                        <List dense disablePadding classes={{
                            root: classes.list
                        }}>
                            <PatternItem key={brushes.RingBrush.displayName} 
                                pattern={brushes.RingBrush} 
                                isBrush={true}
                                activateBrush={() => this.activateBrush('ring')}
                            />
                            <PatternItem key={brushes.RadialBrush.displayName} 
                                pattern={brushes.RadialBrush} 
                                isBrush={true}
                                activateBrush={() => this.activateBrush('radial')}
                            />
                            <PatternItem key={brushes.LineBrush.displayName} 
                                pattern={brushes.LineBrush} 
                                isBrush={true}
                                activateBrush={() => this.activateBrush('line')}
                            />
                        </List>
                    </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}
