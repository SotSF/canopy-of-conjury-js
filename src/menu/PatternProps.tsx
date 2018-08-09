
import * as React from 'react';
import Card from '@material-ui/core/Card';

import { PatternPropTypes } from '../patterns/utils';
import { Checkbox, ColorPicker, EnumeratedList, Slider } from './components';


const styles = {
    parameters: {
        backgroundColor: '#626262',
        padding: '1rem'
    },
};

interface PatternPropsProps {
    onChange (props: object): void
    propTypes: object,
    values: object
}

export default class PatternProps extends React.Component<PatternPropsProps> {
    updateProp (prop, value) {
        this.props.onChange({
            ...this.props.values,
            [prop]: value
        });
    }

    render () {
        const { propTypes, values } = this.props;
        const components = [];

        Object.entries(propTypes).forEach(([prop, type]) => {
            if (type instanceof PatternPropTypes.Color) {
                components.push(
                    <ColorPicker
                      color={values[prop]}
                      key={prop}
                      onChange={(color) => this.updateProp(prop, color)}
                    />
                );
            } else if (type instanceof PatternPropTypes.Enum) {
                components.push(
                    <EnumeratedList
                      key={prop}
                      enumeration={type}
                      onChange={value => this.updateProp(prop, value)}
                      value={values[prop]}
                    />
                );
            } else if (type instanceof PatternPropTypes.Range) {
                const { min, max, step } = type;
                components.push(
                    <Slider
                      key={prop}
                      label={prop}
                      onChange={value => this.updateProp(prop, value)}
                      min={min}
                      max={max}
                      step={step}
                      value={values[prop]}
                    />
                );
            } else if (type instanceof PatternPropTypes.Boolean) {
                components.push(
                    <Checkbox
                      checked={values[prop]}
                      label={prop}
                      onChange={checked => this.updateProp(prop, checked)}
                    />
                );
            }
        });

        return (
            <Card style={styles.parameters} raised>
                {components}
            </Card>
        );
    }
}
