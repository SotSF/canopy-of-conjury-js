
import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

//import { ConcentricCircles } from '../patterns';


const concentricCirclesStyles = {
    card: {
        backgroundColor: '#626262',
        minWidth: 275,
    },
    title: {
        marginBottom: 16,
        fontSize: 14,
    },
};

@withStyles(concentricCirclesStyles)
class ConcentricCircles extends React.Component {
    state = {
        anchorEl: null
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render () {
        const { classes } = this.props;
        const { anchorEl } = this.state;

        return (
            <ListItem key={name} button>
                <ListItemText
                  primary="Concentric Circles"
                  onClick={this.handleClick}
                />
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
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography>Color</Typography>
                        </CardContent>
                        <CardActions>
                            <Button variant="contained" size="small" color="primary">Add</Button>
                        </CardActions>
                    </Card>
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
                            <ConcentricCircles />
                        </List>
                    </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}
