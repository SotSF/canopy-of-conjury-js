
import * as React from 'react';
import PropTypes from 'prop-types';
import { ChromePicker } from 'react-color';

import { RGB } from '../../../colors';
import Popover from '../../util/Popover';


export default class ColorPicker extends React.Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired
    };

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

    render () {
        return (
            <Popover buttonColor={this.color} buttonText="Color" className="pattern-prop">
                <ChromePicker
                  color={this.state.color}
                  disableAlpha
                  onChangeComplete={this.updateColor}
                />
            </Popover>
        );
    }
}
