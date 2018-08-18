
import * as React from 'react';
import Card from '@material-ui/core/Card';

import { PatternPropTypes } from '../../patterns/utils';
import { Checkbox, ColorPicker, EnumeratedList, OscillatorWidget, Slider } from './components';


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

    static renderColor (prop, type, value, onChange) {
        return (
            <ColorPicker
              color={value}
              key={prop}
              onChange={onChange}
              oscillation={type.oscillation}
              defaults={type.defaults}
            />
        );
    }

    static renderEnumeration (prop, type, value, onChange) {
        return (
            <EnumeratedList
              key={prop}
              enumeration={type}
              onChange={onChange}
              value={value}
            />
        );
    }

    static renderSlider (prop, type, value, onChange) {
        const { min, max, step } = type;
        return (
            <Slider
              defaults={type.defaults}
              key={prop}
              label={prop}
              min={min}
              max={max}
              onChange={onChange}
              oscillation={type.oscillation}
              step={step}
              value={value}
            />
        );
    }

    static renderBoolean (prop, type, value, onChange) {
        return (
            <Checkbox
              checked={value}
              key={prop}
              label={prop}
              onChange={onChange}
            />
        );
    }

    static renderOscillator (prop, value) {
        return (
            <div className="pattern-prop">
                <OscillatorWidget buttonText={prop} oscillator={value} />
            </div>
        );
    }

    renderArray (prop, type, values, onChange) {
        const existing = values.map((value, i) => {
            const changeExisting = (newValue) => {
                const newValues = [...values];
                newValues.splice(i, 1, newValue);
                onChange(newValues);
            };

            return this.renderProp(`${prop} ${i}`, type, value, changeExisting);
        });

        const addNew = newValue => onChange([...values, newValue]);
        const newest = this.renderProp(prop, type, null, addNew);

        return (
            <div className="pattern-prop">
                {existing}
                {newest}
            </div>
        );
    }

    renderProp (prop, type, value, onChange = (newVal => this.updateProp(prop, newVal))) {
        if (type instanceof PatternPropTypes.Color) {
            return PatternProps.renderColor(prop, type, value, onChange);
        }

        if (type instanceof PatternPropTypes.Enum) {
            return PatternProps.renderEnumeration(prop, type, value, onChange);
        }

        if (type instanceof PatternPropTypes.Range) {
            return PatternProps.renderSlider(prop, type, value, onChange);
        }

        if (type instanceof PatternPropTypes.Boolean) {
            return PatternProps.renderBoolean(prop, type, value, onChange);
        }

        if (type instanceof PatternPropTypes.Array) {
            return this.renderArray(prop, type.types, value, onChange);
        }

        if (type instanceof PatternPropTypes.Oscillator) {
            return PatternProps.renderOscillator(prop, value);
        }

        // Shouldn't get here...
        return null;
    }

    render () {
        const { propTypes } = this.props;
        const components = Object.entries(propTypes).map(([prop, type]) => {
            const component = this.renderProp(prop, type, this.props.values[prop]);
            return React.cloneElement(component, { key: prop });
        });

        return (
            <Card style={styles.parameters} raised>
                {components}
            </Card>
        );
    }
}
