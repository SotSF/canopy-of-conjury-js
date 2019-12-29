
import * as _ from 'lodash';
import * as React from 'react';
import ReactDOM from 'react-dom';
import * as PubSub from 'pubsub-js';

import Drawer from '@material-ui/core/Drawer';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';

import * as patterns from '../../patterns';
import events from '../events';
import messenger from '../messenger';
import { updatePatterns } from '../state';
import theme from '../theme';

import ActivePatterns from './ActiveLayers';
import Patterns from './Patterns';
import PatternSets from './PatternSets';


const styles = theme => ({
    column: {
        active: '33.33%',
    },
    drawerPaper: {
        width: 240
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    list: {
        width: '100%',
    },
    panelDetails: {
        padding: 0,
    },
});

@withStyles(styles)
class Menu extends React.Component {
    subscription = null;

    static presets = [
        { pattern: patterns.TestLEDs, name: 'Test LEDs' }
    ];

    state = {
        patterns: [],
        activeBrush: ''
    };

    componentDidMount () {
        this.subscription = PubSub.subscribe(events.updatePatterns, (event, patterns) => {
            this.setState({ patterns });
        });
    }

    componentWillUnmount () {
        PubSub.unsubscribe(this.subscription);
    }

    clear = () => {
        this.props.canopy.clear();
        this.setState({ patterns: [] });
        updatePatterns([]);
        messenger.clearPatterns();
    };

    addPattern = (pattern, props) => {
        const instance = new pattern();
        instance.initialize({ props });
        const newPatterns = [instance, ...this.state.patterns];

        messenger.addPattern(instance);

        this.setState({ patterns: newPatterns }, () => updatePatterns(newPatterns));
    };

    removePattern = (patternId) => {
        const patternToRemove = _.find(this.state.patterns, { id: patternId });
        const newPatterns = _.without(this.state.patterns, patternToRemove);

        messenger.removePattern(patternId);
        this.setState({ patterns: newPatterns }, () => updatePatterns(newPatterns));
    };

    render () {
        const { classes } = this.props;
        return (
            <MuiThemeProvider theme={theme}>
                <Drawer
                  variant="permanent"
                  classes={{
                      paper: classes.drawerPaper
                  }}
                  anchor="left"
                >
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Presets</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails classes={{
                            root: classes.panelDetails
                        }}>
                            <List dense disablePadding classes={{
                                root: classes.list
                            }}>
                                <ListItem button>
                                    <ListItemText primary="Clear" onClick={this.clear} />
                                </ListItem>

                                {Menu.presets.map(({ pattern, name }) =>
                                    <ListItem button key={name}>
                                        <ListItemText
                                          primary={name}
                                          onClick={() => this.addPattern(pattern, name)}
                                        />
                                    </ListItem>
                                )}
                            </List>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                    <Patterns addPattern={this.addPattern} />

                    <ActivePatterns
                      patterns={this.state.patterns}
                      removePattern={this.removePattern}
                    />

                    <PatternSets
                      patterns={this.state.patterns}
                    />
                </Drawer>
            </MuiThemeProvider>
        );
    }
}

export const initialize = (canopy) => {
    ReactDOM.render(
        <Menu canopy={canopy} />,
        document.getElementById('controls')
    );
};
