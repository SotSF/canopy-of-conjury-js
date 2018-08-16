
import * as React from 'react';
import * as _ from 'lodash';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, withStyles, Theme, WithStyles } from '@material-ui/core/styles';

import { IOscillator, WaveType } from '../../../types';
import Popover from '../../util/Popover';
import Slider from '../components/Slider';
import Oscillator  from '../../../patterns/utils/oscillator';


interface WaveImageProps {
    oscillator: IOscillator<number>
}

interface WaveImageState {
    points: number[]
    theta: number
}

class WaveImage extends React.Component<WaveImageProps, WaveImageState> {
    static SVG_HEIGHT = 200;
    static SVG_WIDTH = 200;

    static scaleValue (value) {
        const baseLine = WaveImage.SVG_HEIGHT / 2;
        return baseLine - value * (WaveImage.SVG_HEIGHT * 0.45);
    }

    interval = null;

    constructor (props) {
        super(props);
        this.state = {
            points: this.getPoints(),
            theta: 0,
        };
    }

    componentDidMount () {
        this.interval = setInterval(() => {
            const value = this.props.oscillator.value;
            this.setState({
                points: this.state.points.slice(1).concat(WaveImage.scaleValue(value))
            });
        }, 10);
    }

    componentWillUnmount () {
        clearInterval(this.interval);
    }

    getPoints () {
        return _.range(WaveImage.SVG_WIDTH).map((x) => {
            // Map the SVG x-coordinate to the wave function's domain of [0, 8 pi]
            const xMapped = Math.PI * 8 / WaveImage.SVG_WIDTH * x;
            const yValue = this.props.oscillator.waveFunction(xMapped);
            return WaveImage.scaleValue(yValue);
        });
    }

    render () {
        const points = this.state.points;

        // Shift the points according to theta
        const sliceIndex = this.state.theta % WaveImage.SVG_WIDTH;
        const adjusted = points.slice(sliceIndex).concat(points.slice(0, sliceIndex));
        const [first, ...rest] = adjusted;

        const instructions = [
            `M 0 ${first}`,
            ...rest.map((y, x) => `L ${x} ${y}`)
        ];

        return (
            <svg width={WaveImage.SVG_WIDTH} height={WaveImage.SVG_HEIGHT} style={{ backgroundColor: 'black' }}>
                <path d={instructions.join(' ')} stroke="green" strokeWidth={2} fill="none" />
            </svg>
        );
    }
}

const wavePropsStyles = ({ spacing }: Theme) => createStyles({
    frequency: {
        marginTop: spacing.unit,
    },
});

interface WavePropsProps extends WithStyles<typeof wavePropsStyles> {
    className?: string,
    oscillator: IOscillator<number>
}

class WaveProps extends React.Component<WavePropsProps> {
    updateWave = param => (value) => {
        this.props.oscillator.updateWave({ [param]: value });
        this.forceUpdate();
    };

    renderWaveTypes () {
        const { oscillator } = this.props;
        const waveTypes = [
            WaveType.Sine,
            WaveType.Square,
            WaveType.Triangle,
            WaveType.Saw,
        ];

        return (
            <Popover buttonText={WaveType[oscillator.params.type]}>
                <List dense disablePadding>
                    {waveTypes.map((type) =>
                        <ListItem button key={type}>
                            <ListItemText
                              primary={WaveType[type]}
                              onClick={this.updateWave('type')}
                            />
                        </ListItem>
                    )}
                </List>
            </Popover>
        );
    }

    render () {
        const { classes, oscillator } = this.props;
        return (
            <div className={this.props.className}>
                {this.renderWaveTypes()}

                <div className={classes.frequency}>
                    <Slider
                      label="Frequency"
                      value={oscillator.params.frequency}
                      min={0.1}
                      max={2}
                      step={0.1}
                      onChange={this.updateWave('frequency')}
                    />
                </div>
            </div>
        );
    }
}

const WavePropsStyled = withStyles(wavePropsStyles)(WaveProps);

const styles = ({ spacing }: Theme) => createStyles({
    spacer: {
        marginLeft: spacing.unit,
    },
    wrapper: {
        display: 'flex',
    },
});


interface NumericOscillatorProps extends WithStyles<typeof styles> {
    oscillator?: IOscillator<number>
    oscillatorProps?: object
    onCreate?: (osc: IOscillator<number>) => void
}

interface NumericOscillatorState {
    oscillator: IOscillator<number>
}

class NumericOscillator extends React.Component<NumericOscillatorProps, NumericOscillatorState> {
    constructor (props) {
        super(props);

        // If no oscillator was passed in, create one
        const oscillatorProps = Object.assign({ type: WaveType.Sine }, props.oscillatorProps);
        const oscillator = props.oscillator || new Oscillator(oscillatorProps);
        if (oscillator !== props.oscillator) {
            props.onCreate(oscillator);
        }

        this.state = { oscillator };
    }

    render () {
        const { classes } = this.props;
        return (
            <div className={classes.wrapper}>
                <WaveImage oscillator={this.state.oscillator} />
                <WavePropsStyled className={classes.spacer} oscillator={this.state.oscillator} />
            </div>
        );
    }
}

export default withStyles(styles)(NumericOscillator);
