
import React from 'react';
import ReactDOM from 'react-dom';

import Drawer from '@material-ui/core/Drawer';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import canopy from '../canopy';
import * as Patterns from '../patterns';

import ActiveLayers from './ActiveLayers';
import Brushes from './Brushes';
import RenderSelection from './RenderSelection';


const styles = theme => ({
     column: {
         active: '33.33%',
     },
    drawerPaper: {
        position: 'relative',
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
    static presets = [
        { pattern: Patterns.TestLEDs, name: 'Test LEDs' },
        { pattern: Patterns.TestCanvas, name: 'Test Canvas' },
        { pattern: Patterns.GradientPulse, name: 'Gradient Pulse' },
        { pattern: Patterns.PCanvas, name: 'Add Canvas'}
    ];

    state = {
        abcd: true,
        layers: []
    };

    clear = () => {
        canopy.clear();

        // FIXME: mutating props is a total anti-pattern
        this.props.layers.splice(0, this.props.layers.length);
        this.setState({layers: this.props.layers});
    };

    addLayer = (pattern, name) => {
        this.props.layers.push({ pattern: new pattern(), name });
        this.setState({layers: this.props.layers});
    };

    removeLayer = () => {

    }

    moveLayerUp = () => {

    }

    moveLayerDown = () => {
        
    }

    render () {
        const { classes, layers } = this.props;
        return (
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
                        <List classes={{
                            root: classes.list
                        }}>
                            <ListItem button>
                                <ListItemText primary="Clear" onClick={this.clear} />
                            </ListItem>

                            {Menu.presets.map(({ pattern, name }) =>
                                <ListItem button key={name}>
                                    <ListItemText
                                      primary={name}
                                      onClick={() => this.addLayer(pattern, name)}
                                    />
                                </ListItem>
                            )}
                        </List>
                    </ExpansionPanelDetails>
                </ExpansionPanel>

                <Brushes activateBrush={() => { alert('Implement me!'); }} />
                <ActiveLayers layers={this.state.layers} 
                    moveLayerUp={this.moveLayerUp} 
                    moveLayerDown={this.moveLayerDown} 
                    removeLayer={this.removeLayer}/>

                <RenderSelection />
            </Drawer>
        );
    }
}

export const initialize = (layers) => {
    ReactDOM.render(
        <Menu layers={layers} />,
        document.getElementById('idControls')
    );
};
