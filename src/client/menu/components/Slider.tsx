
import * as React from 'react';
import classNames from 'classnames';

import Card from '@material-ui/core/Card';
import { createStyles, withStyles, Theme, WithStyles } from '@material-ui/core/styles';
import MaterialSlider from '@material-ui/core/Slider';

import { WaveState, MaybeOscillator } from '../../../patterns/utils/oscillators/types';
import { isOscillatorWrapper, Oscillator, NumericOscillator } from '../../../patterns/utils';
import Popover from '../../util/Popover';
import OscillatorWidget from './Oscillator';


const styles = ({ spacing }: Theme) => createStyles({
    slider: {
        height: '200px'
    },
    spacer: {
        marginLeft: spacing(),
    },
    popover: {
        display: 'flex',
    }
});

interface SliderProps extends WithStyles<typeof styles> {
    defaults: Partial<WaveState>
    label: string,
    value: MaybeOscillator<number>,
    min?: number,
    max?: number,
    step?: number,
    onChange (value: MaybeOscillator<number>): void,
    oscillation: boolean
}

interface SliderState {
    value: MaybeOscillator<number>
}

class Slider extends React.Component<SliderProps, SliderState> {
    static defaultProps = {
        min: 1,
        max: 10,
        step: 1
    };

    constructor (props) {
        super(props);
        this.state = {
            value: props.value
        };
    }

    /**
     * When the value of the slider is changed externally, update the state
     */
    componentWillReceiveProps (nextProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({ value: nextProps.value });
        }
    }

    manualUpdate = (e, value) => this.updateValue(value);

    updateValue = (value) => {
        this.props.onChange(value);
        this.setState({ value });
    };

    renderOscillator () {
        const { defaults, max, min, oscillation } = this.props;
        if (!oscillation) return null;

        const { value } = this.state;

        const oscillator = isOscillatorWrapper(value)
            ? value.oscillator
            : null;

        const createFn = () => {
            const oscillator = new Oscillator(defaults);

            this.updateValue(
                new NumericOscillator({
                    oscillatorState: defaults,
                    oscillatorType: 'numeric',
                    min,
                    max
                })
            );

            return oscillator;
        };

        return <OscillatorWidget createFn={createFn} oscillator={oscillator} />;
    }

    render () {
        const { classes, label, min, max, step } = this.props;
        const { value } = this.state;

        const positionalProps = {
            anchorOrigin:{
                vertical: 'bottom',
                horizontal: 'right',
            },
            transformOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
            },
        };

        const actual = isOscillatorWrapper(value)
            ? value.value()
            : value;

        return (
            <Popover
              buttonText={label}
              {...positionalProps}
              className="pattern-prop"
              paperClasses={classNames(classes.popover, classes.spacer)}
              transparent
            >
                <Card className={classes.slider}>
                    <MaterialSlider
                      onChange={this.manualUpdate}
                      min={max}
                      max={min}
                      step={-step}
                      value={actual}
                      orientation="vertical"
                    />
                </Card>

                <div className={classes.spacer}>
                    {this.renderOscillator()}
                </div>
            </Popover>
        );
    }
}

export default withStyles(styles)(Slider);
