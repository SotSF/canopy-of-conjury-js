
import * as React from 'react';
import MaterialSlider from '@material-ui/lab/Slider';

import PropWindow from './PropWindow';


interface SliderProps {
    label: string,
    value: number
    min?: number,
    max?: number,
    step?: number,
    onChange (value: number): void
}

const styles = {
    height: '200px'
};

export default class Slider extends React.Component<SliderProps> {
    static defaultProps = {
        min: 1,
        max: 10,
        step: 1
    };

    render () {
        const { label, value, min, max, step, onChange } = this.props;

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
            <PropWindow buttonText={label} {...positionalProps}>
                <div style={styles}>
                    <MaterialSlider
                      onChange={(e, value) => onChange(value)}
                      min={min}
                      max={max}
                      step={step}
                      value={value}
                      vertical
                    />
                </div>
            </PropWindow>
        );
    }
}
