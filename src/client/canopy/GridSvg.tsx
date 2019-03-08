
import * as React from 'react';
import * as _ from 'lodash';

import { Grid, NUM_COLS, NUM_ROWS } from '../../grid';
import { combine } from '../../colors';
import { GridInterface, PatternInstance } from '../../types';
import * as util from '../../util';


// Rendering constants
const LED_RADIUS = 2;
const LED_GAP = 3;

const Strip = ({ leds, length, rowNum }) => {
    const interval = LED_RADIUS * 2 + LED_GAP;

    // We render as many LEDs from the array as we can, respecting the spacing rules
    const numToRender = Math.floor(length / interval) - 1;

    // The strip is rotated a specified amount, then translated along its radial path as though
    // there was an invisible LED at the center of the canopy
    const transform = `
        translate(0 ${rowNum * interval} 0)
    `;

    return (
        <g transform={transform}>
            {_.range(numToRender).map((i) => {
                const fill = combine(leds[i]);
                return (
                    <circle
                      fill={fill.toString()}
                      fillOpacity={util.clamp(fill.a, 0.2, 1)}
                      key={i}
                      r={LED_RADIUS}
                      cx={interval * i}
                      cy={0}
                    />
                );
            })}
        </g>
    );
};

interface GridSvgProps {
    mini?: boolean,
    width?: number,
    pattern: PatternInstance,
    patternProps: object
}

interface GridSvgState {
    grid: GridInterface,
    width: number
}

export default class GridSvg extends React.Component<GridSvgProps, GridSvgState> {
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
            grid: this.makeGrid()
        };
    }

    componentDidMount () {
        this.patternInterval = setInterval(this.updatePattern, 50);
    }

    componentWillUnmount () {
        clearInterval(this.patternInterval);
    }

    makeGrid () {
        return new Grid(NUM_ROWS, NUM_COLS);
    }

    updatePattern = () => {
        const { pattern } = this.props;

        // If the component no longer has a pattern (e.g. if it is in the process of unmounting)
        // then do not attempt to update or render
        if (!pattern) return;

        const grid = this.makeGrid();
        pattern.progress();
        pattern.render(grid);

        this.setState({ grid });
    };

    render () {
        const { grid, width } = this.state;

        const halfWidth = width / 2;
        const viewBox = `-${halfWidth} -${halfWidth} ${width} ${width}`;

        return (
            <svg viewBox={viewBox} width={width} height={width}>
                {grid.strips.map((strip, i) => {
                    return <Strip key={i} leds={strip.leds} length={halfWidth} rowNum={i} />;
                })}
            </svg>
        );
    }
}
