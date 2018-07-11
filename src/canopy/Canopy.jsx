
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { rgbToHexString } from '../colors';


// Rendering constants
const LED_RADIUS = 3;
const LED_GAP = 2;
const NUM_STRIPS = 96;
const NUM_LEDS_PER_STRIP = 75;

const Strip = ({ leds, length, rotation }) => {
    const interval = LED_RADIUS * 2 + LED_GAP;

    //
    const numToRender = length / interval - 1;

    // The strip is rotated a specified amount, then translated along its radial path as though
    // there was an invisible LED at the center of the canopy
    const transform = `
        rotate(${rotation})
        translate(${interval} 0)
    `;

    return (
        <g transform={transform}>
            {_.range(numToRender).map((i) =>
                <circle
                  fill={rgbToHexString(leds[i])}
                  key={i}
                  r={LED_RADIUS}
                  cx={interval * i}
                  cy={0}
                />
            )}
        </g>
    );
};

export default class Canopy extends React.Component {
    static propTypes = {
        mini: PropTypes.bool,
        width: PropTypes.number
    };

    static defaultProps = {
        mini: false,
        width: 400
    };

    constructor (props) {
        super(props);
        const { mini, width } = props;

        this.state = {
            width: mini ? 200 : width,
            strips: _.range(NUM_STRIPS).map(() =>
                _.range(NUM_LEDS_PER_STRIP).map(() => ({ r: 0, g: 0, b: 0 }))
            ),
        };
    }

    render () {
        const { strips, width } = this.state;
        const rotationAmount = 360 / strips.length;

        const halfWidth = width / 2;
        const viewBox = `-${halfWidth} -${halfWidth} ${width} ${width}`;

        return (
            <svg viewBox={viewBox} width={width} height={width}>
                {this.state.strips.map((leds, i) => {
                    const rotation = rotationAmount * i;
                    return <Strip key={i} leds={leds} length={halfWidth} rotation={rotation} />;
                })}
            </svg>
        );
    }
}
