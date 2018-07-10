
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
        { pattern: Patterns.PCanvas, name: 'Draw Canvas'}
    ];

    state = {
        layers: [],
        activeLayer: {},
        activeBrush: ''
    };

    clear = () => {
        canopy.clear();
        this.state.layers.splice(0, this.state.layers.length);
        this.setState({layers: this.state.layers});
        this.props.updateLayers(this.state.layers);
    };

    addLayer = (pattern, name) => {
        this.state.layers.splice(0,0,{ pattern: new pattern(), name });
        this.setState({layers: this.state.layers});
        this.props.updateLayers(this.state.layers);
    };

    removeLayer = (i) => {
        this.state.layers.splice(i, 1);
        this.setState({layers: this.state.layers});
        this.props.updateLayers(this.state.layers);
    }

    moveLayerUp = (i) => {
        [this.state.layers[i], this.state.layers[i-1]] = [this.state.layers[i-1], this.state.layers[i]];
        this.setState({layers: this.state.layers});
        this.props.updateLayers(this.state.layers);
    }

    moveLayerDown = (i) => {
        [this.state.layers[i], this.state.layers[i+1]] =   [this.state.layers[i+1], this.state.layers[i]];
        this.setState({layers: this.state.layers});
        this.props.updateLayers(this.state.layers);
    }

    setActiveLayer = (i) => {
        this.setState({activeLayer: this.state.layers[i]});
        this.props.setActiveLayer(i);
    }

    getActiveLayer = () => { return this.state.layers.indexOf(this.state.activeLayer); }

    render () {
        const { classes } = this.props;
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

                <Brushes activateBrush={(name) => { this.setState({activeBrush: name}); this.props.setBrush(name) }} />
                <ActiveLayers layers={this.state.layers} 
                    moveLayerUp={this.moveLayerUp} 
                    moveLayerDown={this.moveLayerDown} 
                    removeLayer={this.removeLayer}
                    setLayer={this.setActiveLayer}
                    activeLayer={this.getActiveLayer()}
                />
                <RenderSelection />
            </Drawer>
        );
    }
}

export const initialize = (updateLayers, setBrush, setActiveLayer) => {
    ReactDOM.render(
        <Menu updateLayers={updateLayers} setBrush={setBrush} setActiveLayer={setActiveLayer}/>,
        document.getElementById('idControls')
    );
};