
import * as React from 'react';

import Card from '@material-ui/core/Card';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { WithStyles, createStyles } from '@material-ui/core';

import Popover from '../../util/Popover';
import Oscillator from './Oscillator';


const styles = createStyles({
    card: {
        margin: '1rem'
    }
});

interface OscillatorsProps extends WithStyles<typeof styles> {}

class Oscillators extends React.Component<OscillatorsProps> {
    render () {
        const { classes } = this.props;
        return (
            <Card classes={{ root: classes.card }} raised>
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="body2">Oscillators</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Popover buttonText="New">
                            <Oscillator />
                        </Popover>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </Card>
        );
    }
}

export default withStyles(styles)(Oscillators);
