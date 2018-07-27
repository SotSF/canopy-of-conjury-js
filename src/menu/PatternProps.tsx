
import * as React from 'react';
import { ColorPicker } from './components';
import { PatternPropType } from '../types';


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
            switch (type) {
                case PatternPropType.Color:
                    components.push(
                        <ColorPicker
                          color={values[prop]}
                          key={prop}
                          onChange={(color) => this.updateProp(prop, color)}
                        />
                    );
                    break;
            }
        });

        return <div>{components}</div>;
    }
}
