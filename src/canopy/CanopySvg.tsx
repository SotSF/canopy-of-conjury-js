
import * as React from 'react';
import * as _ from 'lodash';

import { rgbToHexString } from '../colors';
import { CanopyInterface, PatternInstance } from '../types';
import Canopy from './Canopy';
import * as util from "../util";


// Rendering constants
const LED_RADIUS = 2;
const LED_GAP = 3;
const NUM_STRIPS = 96;
const NUM_LEDS_PER_STRIP = 75;

const Strip = ({ leds, length, rotation }) => {
    const interval = LED_RADIUS * 2 + LED_GAP;

    // We render as many LEDs from the array as we can, respecting the spacing rules
    const numToRender = Math.floor(length / interval) - 1;

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
                  fill={leds[i].toString()}
                  fillOpacity={leds[i].a}
                  key={i}
                  r={LED_RADIUS}
                  cx={interval * i}
                  cy={0}
                />
            )}
        </g>
    );
};

interface CanopySvgProps {
    mini?: boolean,
    width?: number,
    pattern: PatternInstance,
    patternProps: object
}

interface CanopySvgState {
    canopy: CanopyInterface,
    width: number
}

export default class CanopySvg extends React.Component<CanopySvgProps, CanopySvgState> {
    patternInterval = null;

    static defaultProps = {
        mini: false,
        width: 400
    };

    constructor (props) {
        super(props);

        const { mini, width } = props;
        this.state = {
            width: mini ? 200 : width,
            canopy: this.makeCanopy()
        };
    }

    componentDidMount () {
        this.patternInterval = setInterval(this.updatePattern, 50);
    }

    componentWillUnmount () {
        clearInterval(this.patternInterval);
    }

    makeCanopy () {
        return new Canopy(NUM_STRIPS, NUM_LEDS_PER_STRIP);
    }

    updatePattern = () => {
        const { pattern } = this.props;

        // If the component no longer has a pattern (e.g. if it is in the process of unmounting)
        // then do not attempt to update or render
        if (!pattern) return;

        const canopy = this.makeCanopy();
        pattern.progress();
        pattern.render(canopy);

        this.setState({ canopy });
    };

    render () {
        const { canopy, width } = this.state;
        const rotationAmount = -360 / canopy.strips.length;

        const halfWidth = width / 2;
        const viewBox = `-${halfWidth} -${halfWidth} ${width} ${width}`;

        return (
            <svg viewBox={viewBox} width={width} height={width}>
                {canopy.strips.map((strip, i) => {
                    const rotation = rotationAmount * i;
                    return <Strip key={i} leds={strip.leds} length={halfWidth} rotation={rotation} />;
                })}
            </svg>
        );
    }
}
