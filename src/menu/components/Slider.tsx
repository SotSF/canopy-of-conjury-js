
import * as React from 'react';
import classNames from 'classnames';
import * as _ from 'lodash';

import Card from '@material-ui/core/Card';
import { createStyles, withStyles, Theme, WithStyles } from '@material-ui/core/styles';
import MaterialSlider from '@material-ui/lab/Slider';

import { AccessibleProp, IOscillator } from '../../types';
import Popover from '../../util/Popover';
import { OscillatorWidget } from '../oscillators';


const styles = ({ spacing }: Theme) => createStyles({
    slider: {
        height: '200px'
    },
    oscillatorButton: {
    },
    spacer: {
        marginLeft: spacing.unit,
    },
    popover: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        display: 'flex',
        overflow: 'visible',
    }
});

interface SliderProps extends WithStyles<typeof styles> {
    label: string,
    value: number
    min?: number,
    max?: number,
    step?: number,
    onChange (value: AccessibleProp<number>): void,
    oscillation: boolean
}

interface SliderState {
    value: number
}

class Slider extends React.Component<SliderProps, SliderState> {
    // Callback used to cancel an oscillator subscription
    unsubscribe = null;

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

    manualUpdate = (e, value) => {
        this.updateValue(value);

        // If there's an oscillator, cancel it
        _.result(this, 'unsubscribe');
    };

    updateValue = (value) => {
        this.props.onChange(value);
        this.setState({ value });
    };

    subscribe = (oscillator: IOscillator) => {
        const { min, max } = this.props;
        const accessor = () => oscillator.scaled(min, max);
        this.props.onChange(accessor);
    };

    renderOscillator () {
        const { classes } = this.props;
        const positionalProps = {
            anchorOrigin:{
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
              buttonText="Oscillator"
              buttonProps={{
                  className: classNames(classes.spacer)
              }}
              paperProps={{
                  classes: { root: classes.spacer }
              }}
              {...positionalProps}
            >
                <OscillatorWidget onCreate={this.subscribe} />
            </Popover>
        );
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

        return (
            <Popover
              buttonText={label}
              {...positionalProps}
              className="pattern-prop"
              paperProps={{
                  classes: { root: classNames(classes.popover, classes.spacer) }
              }}
            >
                <Card className={classes.slider}>
                    <MaterialSlider
                      onChange={this.manualUpdate}
                      min={max}
                      max={min}
                      step={-step}
                      value={value}
                      vertical
                    />
                </Card>

                {this.renderOscillator()}
            </Popover>
        );
    }
}

export default withStyles(styles)(Slider);
