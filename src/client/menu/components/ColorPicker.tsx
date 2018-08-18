
import * as React from 'react';
import { HuePicker } from 'react-color';
import { createStyles, withStyles, Theme, WithStyles } from '@material-ui/core/styles';

import { Color, RGB } from '../../../colors';
import { IOscillator, MaybeOscillator, WaveType } from '../../../types';
import { ColorOscillator, isOscillatorWrapper, Oscillator } from '../../../patterns/utils';
import Popover from '../../util/Popover';
import OscillatorWidget from './Oscillator';


const styles = ({ spacing }: Theme) => createStyles({
    card: {
        paddingLeft: spacing.unit,
        width: '200px',
    },
    spacer: {
        marginTop: spacing.unit,
    },
});

interface IColorPickerProps extends WithStyles<typeof styles> {
    color?: MaybeOscillator<Color>
    onChange: (color: MaybeOscillator<Color>) => void
    oscillation?: boolean
}

interface IColorPickerState {
    color: MaybeOscillator<Color>
}

class ColorPicker extends React.Component<IColorPickerProps, IColorPickerState> {
    constructor (props) {
        super(props);
        this.state = {
            color: props.color || new RGB(
                Math.floor(Math.random() * 256),
                Math.floor(Math.random() * 256),
                Math.floor(Math.random() * 256)
            )
        };
    }

    setColor (color) {
        this.setState({ color });
        this.props.onChange(color);
    }

    updateColor = ({ rgb }) => this.setColor(new RGB(rgb.r, rgb.g, rgb.b));

    renderOscillator () {
        const { oscillation } = this.props;
        if (!oscillation) return null;

        const { color } = this.state;
        const oscillator = isOscillatorWrapper(color)
            ? color.oscillator
            : null;

        const createFn = () => {
            const oscillator = new Oscillator({ frequency: 0.25 });
            this.setColor(new ColorOscillator(oscillator));
            return oscillator;
        };

        return <OscillatorWidget createFn={createFn} oscillator={oscillator} />;
    }

    render () {
        const { classes } = this.props;
        const { color } = this.state;

        const positionalProps = {
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
            },
            transformOrigin: {
                vertical: 'top',
                horizontal: 'left',
            },
        };

        const actual = isOscillatorWrapper(color)
            ? color.value()
            : color;

        return (
            <Popover
              buttonColor={actual}
              buttonText="Color"
              className="pattern-prop"
              paperClasses={classes.card}
              transparent
              {...positionalProps}
            >
                <HuePicker
                  color={this.state.color}
                  onChangeComplete={this.updateColor}
                />

                <div className={classes.spacer}>
                    {this.renderOscillator()}
                </div>
            </Popover>
        );
    }
}

export default withStyles(styles)(ColorPicker);
