
import * as React from 'react';
import MaterialSlider from '@material-ui/lab/Slider';

import Popover from '../../util/Popover';


interface SliderProps {
    label: string,
    value: number
    min?: number,
    max?: number,
    step?: number,
    onChange (value: number): void
}

interface SliderState {
    value: number
}

const styles = {
    height: '200px'
};

export default class Slider extends React.Component<SliderProps, SliderState> {
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

    updateValue = (e, value) => {
        this.props.onChange(value);
        this.setState({ value });
    };

    render () {
        const { label, min, max, step } = this.props;
        const { value } = this.state;

        const positionalProps = {
            anchorOrigin:{
                vertical: 'bottom',
                horizontal: 'right'
            },
            transformOrigin: {
                vertical: 'bottom',
                horizontal: 'left'
            },
            style: { marginLeft: '10px' }
        };

        return (
            <Popover buttonText={label} {...positionalProps}>
                <div style={styles}>
                    <MaterialSlider
                      onChange={this.updateValue}
                      min={min}
                      max={max}
                      step={step}
                      value={value}
                      vertical
                    />
                </div>
            </Popover>
        );
    }
}
