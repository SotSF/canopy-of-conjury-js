
import * as React from 'react';
import * as PubSub from 'pubsub-js';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { PatternInstance } from '../../../types';
import events from '../../events';
import messenger from '../../messenger';
import ApplyPatternSetButton from './ApplyPatternSetButton';
import SaveButton from './SaveButton';


const PatternSetsStyles = (theme: Theme) => createStyles({
  formControl: {
    minWidth: 120
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  panelDetails: {
    display: 'block'
  },
});

interface PatternSetsProps extends WithStyles<typeof PatternSetsStyles> {
  patterns: PatternInstance[]
}

interface PatternSetsState {
  patternSets: string[]
  loadedSets: boolean
}

export default withStyles(PatternSetsStyles)(
  class PatternSets extends React.Component<PatternSetsProps, PatternSetsState> {
    subscription = null;
    state = {
      patternSets: [],
      loadedSets: false
    };

    /**
     * On component mount, send a request to the server to load the existing pattern sets
     */
    componentDidMount () {
      messenger.fetchPatternSets();
      this.subscription = PubSub.subscribe(events.syncPatternSets, (event, patternSets: string[]) => {
          this.setState({
            patternSets,
            loadedSets: true
          });
      });
    }

    componentWillUnmount () {
        PubSub.unsubscribe(this.subscription);
    }
    
    render () {
      const { classes, patterns } = this.props;
      const { patternSets } = this.state;

      return (
        <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>Pattern Sets</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails classes={{
              root: classes.panelDetails
            }}>
              <ApplyPatternSetButton patternSets={patternSets} />
              <SaveButton disabled={patterns.length === 0} />
            </ExpansionPanelDetails>
        </ExpansionPanel>
      );
    }
  }
);
