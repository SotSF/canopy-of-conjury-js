
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
                    <Typography className={classes.heading}>Brushes</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{
                        root: classes.panelDetails
                    }}>
                        <List dense classes={{
                            root: classes.list
                        }}>
                            <ListItem button>
                                <ListItemText
                                  primary="Ring"
                                  onClick={() => this.activateBrush('ring')}
                                />
                            </ListItem>
                            <ListItem button>
                                <ListItemText
                                  primary="Radial"
                                  onClick={() => this.activateBrush('radial')}
                                />
                            </ListItem>
                            <ListItem button>
                                <ListItemText
                                  primary="Line"
                                  onClick={() => this.activateBrush('line')}
                                />
                            </ListItem>
                        </List>
                    </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}
