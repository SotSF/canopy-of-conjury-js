
import * as React from 'react';
import { HuePicker } from 'react-color';
import { createStyles, withStyles, Theme, WithStyles } from '@material-ui/core/styles';

import { Color, RGB } from '../../../colors';
import { IOscillator, MaybeOscillator } from '../../../types';
import { ColorOscillator } from '../../../patterns/utils';
import Popover from '../../util/Popover';
import Oscillator from './Oscillator';


const styles = ({ spacing }: Theme) => createStyles({
    card: {
        padding: spacing.unit,
        width: '200px',
    },
    spacer: {
        marginTop: spacing.unit,
    },
});

interface IColorPickerProps extends WithStyles<typeof styles> {
    color?: Color
    onChange: (color: MaybeOscillator<Color>) => void
    oscillation?: boolean
}

interface IColorPickerState {
    color: RGB
}

class ColorPicker extends React.Component<IColorPickerProps, IColorPickerState> {
    constructor (props) {
        super(props);
        this.state = {
            color: props.color || {
                r: Math.floor(Math.random() * 256),
                g: Math.floor(Math.random() * 256),
                b: Math.floor(Math.random() * 256)
            }
        };
    }

    get color () {
        const { color } = this.state;
        return new RGB(color.r, color.g, color.b);
    }

    updateColor = ({ rgb }) => {
        this.setState({ color: rgb }, () => {
            this.props.onChange(this.color);
        });
    };

    setOscillator = (oscillator: IOscillator) => {
        this.props.onChange(new ColorOscillator(oscillator));
    };

    renderOscillator () {
        const { oscillation } = this.props;
        if (!oscillation) return null;

        return <Oscillator onCreate={this.setOscillator} />;
    }

    render () {
        const { classes } = this.props;
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

        return (
            <Popover
              buttonColor={this.color}
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
