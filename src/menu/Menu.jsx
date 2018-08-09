
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
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';

import canopy from '../canopy';
import * as patterns from '../patterns';
import theme from '../theme';

import ActiveLayers from './ActiveLayers';
import Patterns from './Patterns';
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
        { pattern: patterns.TestLEDs, name: 'Test LEDs' }
    ];
    currentId = 0;
    state = {
        layers: [],
        activeLayer: {},
        activeBrush: ''
    };

    clear = () => {
        canopy.clear();
        this.setState({ layers: [] });
        this.props.updateLayers([]);
    };

    activateBrush = (name) => {
        this.setState({ activeBrush: name });
        this.props.setBrush(name)
        var drawLayer = this.state.layers.find((layer) => {return layer.pattern instanceof patterns.PCanvas});
        if (drawLayer == null) {
            this.addLayer(patterns.PCanvas, "Draw Canvas");
        }
        else {
            this.setActiveLayer(this.state.layers.indexOf(drawLayer));
        }
    };

    addLayer = (pattern, params) => {
        const newLayers = [{
            key: this.currentId,
            pattern: new pattern(Object.assign({}, params)),
            name: pattern.displayName,
            menuParams: pattern.menuParams
        }, ...this.state.layers];

        this.currentId++;
        this.setState({ layers: newLayers }, () => {
            this.setActiveLayer(0);
            this.props.updateLayers(newLayers)
        });
    };

    removeLayer = (i) => {
        const newLayers = [...this.state.layers];
        newLayers.splice(i, 1);
        this.setState({ layers: newLayers }, () =>  this.props.updateLayers(newLayers));
    };

    moveLayerUp = (i) => {
        const newLayers = [...this.state.layers];
        [newLayers[i], newLayers[i - 1]] = [newLayers[i - 1], newLayers[i]];
        this.setState({ layers: newLayers }, () =>  this.props.updateLayers(newLayers));
    };

    moveLayerDown = (i) => {
        const newLayers = [...this.state.layers];
        [newLayers[i], newLayers[i + 1]] = [newLayers[i + 1], newLayers[i]];
        this.setState({ layers: newLayers }, () =>  this.props.updateLayers(newLayers));
    };

    setActiveLayer = (i) => {
        this.setState({ activeLayer: this.state.layers[i] }, () => this.props.setActiveLayer(i));
    };

    getActiveLayer = () => this.state.layers.indexOf(this.state.activeLayer);

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
                                          onClick={() => this.addLayer(pattern, name)}
                                        />
                                    </ListItem>
                                )}
                            </List>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                    <Patterns addLayer={this.addLayer} />
                    
                    <ActiveLayers
                      layers={this.state.layers}
                      moveLayerUp={this.moveLayerUp}
                      moveLayerDown={this.moveLayerDown}
                      removeLayer={this.removeLayer}
                      setLayer={this.setActiveLayer}
                      activeLayer={this.getActiveLayer()}
                      updatePattern={this.props.updatePattern}
                    />

                    <RenderSelection />
                </Drawer>
            </MuiThemeProvider>
        );
    }
}

export const initialize = (updateLayers, setBrush, setActiveLayer) => {
    ReactDOM.render(
        <Menu updateLayers={updateLayers} setBrush={setBrush} setActiveLayer={setActiveLayer}/>,
        document.getElementById('idControls')
    );
};
