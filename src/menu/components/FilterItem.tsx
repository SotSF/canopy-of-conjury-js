// import React from 'react';
// import { ChromePicker } from 'react-color';

// import Button from '@mui/material/Button';
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions'
// import CardContent from '@mui/material/CardContent';
// import Checkbox from '@mui/material/Checkbox';
// import FormControl from '@mui/material/FormControl';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import ListItem from '@mui/material/ListItem';
// import ListItemText from '@mui/material/ListItemText';
// import InputLabel from '@mui/material/InputLabel';
// import Popover from '@mui/material/Popover';
// import Typography from '@mui/material/Typography';
// import { withStyles } from '@mui/material/styles';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import Slider from '@material-ui/lab/Slider';

// const patternMenustyles = {
//     card: {
//         backgroundColor: '#626262',
//         minWidth: 275,
//     },
//     title: {
//         marginBottom: 16,
//         fontSize: 14,
//     },
// };

// @withStyles(patternMenustyles)
// export class FilterItem extends React.Component {
//     state = {
//         anchorEl: null,
//         params: {},
//         selectLayer: -1,
//         selectOpen: false
//     };

//     constructor(props) {
//         super(props);
//         props.controls.forEach((control) => {
//             this.state.params[control.name] = control.defaultVal
//         });
//         this.state.params["Brightness"] = 100;
//     }

//     changeLayer = event => {
//         this.setState({ [event.target.name]: event.target.value });
//     };

//     selectClose = () => {
//         this.setState({ selectOpen: false });
//     };

//     selectOpen = () => {
//         this.setState({ selectOpen: true });
//     };

//     handleClick = event => {
//         this.setState({ anchorEl: event.currentTarget });
//         if (this.props.isBrush) { this.props.activateBrush(); }
//     };

//     handleClose = () => {
//         this.setState({ anchorEl: null });
//     };

//     updateParam = (name, val) => {
//         this.setState((prevState) => {
//             prevState.params[name] = val;
//             return { params: prevState.params }
//         }, () => {
//             if (this.props.isBrush) {
//                 for(var key in this.state.params) {
//                     this.props.pattern.setParams[key] = this.state.params[key];
//                 }
//             }
//         });
//     }

//     renderControls = () => {
//         const { key, filter } = this.props;
//         const controls = [];
//         filter.menuParams.map(control => {
//             if (typeof control.defaultVal == "string") {
//                 controls.push(<ChromePicker key={key + "-" + control.name} disableAlpha={true} color={this.state.params[control.name]}
//                     onChange={(val) => this.updateParam(control.name,val.hex)} />)
//             }
//             else if (typeof control.defaultVal == "number") {
//                 controls.push(
//                 <div key={key + "-" + control.name}>
//                     <Typography variant="caption">{control.name}: {this.state.params[control.name]}</Typography>
//                     <Slider value={this.state.params[control.name]} min={control.min} max={control.max} step={1}
//                         onChange={(e,val)=>this.updateParam(control.name, val)}/>
//                 </div>
//                 )
//             }
//             else if (typeof control.defaultVal == "boolean") {
//                 controls.push(
//                     <FormControlLabel key={key + "-" + control.name} label={control.name} control={
//                         <Checkbox label={control.name} checked={this.state.params[control.name]} color="primary"
//                         onChange={() => this.updateParam(control.name,!this.state.params[control.name])} />}
//                     />
//                 )
//         }});
//         return controls;
//     }
//     applyFilter = () => {
//         const layer = this.props.layers[this.state.selectLayer];
//         const { filter } = this.props;
//         layer.pattern.filters.push(new filter(Object.assign({}, this.state.params)));
//     }

//     render () {
//         const { classes, filter, layers } = this.props;
//         const { anchorEl } = this.state;

//         return (
//             <ListItem key={filter.displayName} button>
//                 <ListItemText
//                   primary={filter.displayName}
//                   onClick={this.handleClick}
//                 />
//                 <Popover
//                   open={!!anchorEl}
//                   anchorEl={anchorEl}
//                   onClose={this.handleClose}
//                   anchorOrigin={{
//                       vertical: 'center',
//                       horizontal: 'right',
//                   }}
//                   transformOrigin={{
//                       vertical: 'top',
//                       horizontal: 'left',
//                   }}
//                 >
//                     <Card className={classes.card}>
//                         <CardContent>
//                            {this.renderControls()}
//                         </CardContent>
//                         <CardActions>
//                         <FormControl>
//                         <InputLabel htmlFor="filter-layer-select">Layer</InputLabel>
//                         <Select
//                             open={this.state.selectOpen}
//                             onClose={this.selectClose}
//                             onOpen={this.selectOpen}
//                             value={this.state.selectLayer}
//                             onChange={this.changeLayer}
//                             inputProps={{
//                                 name: 'selectLayer',
//                                 id: 'filter-layer-select',
//                             }}
//                         >
//                             <MenuItem value="">
//                             <em>None</em>
//                             </MenuItem>
//                             {layers.map((layer,i) =>
//                                 <MenuItem value={i}>{layer.name + ":" + layer.key}</MenuItem>
//                             )}
//                         </Select>
//                         </FormControl>
//                         <Button onClick={this.applyFilter}>Apply</Button>
//                         </CardActions>
//                     </Card>
//                 </Popover>
//             </ListItem>
//         )
//     }
// }
