
import * as React from 'react';
import * as _ from 'lodash';
import { createStyles, withStyles, Theme, WithStyles } from '@material-ui/core/styles';

import { Grid, NUM_COLS, NUM_ROWS } from '../../grid';
import { combine } from '../../colors';
import { GridInterface, PatternInstance } from '../../types';
import * as util from '../../util';


// Rendering constants
const LED_RADIUS = 0.3;

// Renders a column of LEDs
const Strip = ({ leds, numRows, colNum }) => {
    // The strip is rendered with its first LED at the bottom, with each subsequent column
    // one to the right of the last
    const transform = `translate(${colNum - LED_RADIUS} ${-LED_RADIUS})`;

    return (
        <g transform={transform}>
            {_.range(numRows).map((i) => {
                const fill = combine(leds[i]);
                return (
                    <circle
                      fill={fill.toString()}
                      fillOpacity={util.clamp(fill.a, 0.2, 1)}
                      key={i}
                      r={LED_RADIUS}
                      cx={0}
                      cy={i}
                    />
                );
            })}
        </g>
    );
};

const styles = ({ spacing }: Theme) => createStyles({
    svg: {
        padding: '5px',
    },
});

interface GridSvgProps extends WithStyles<typeof styles> {
    pattern: PatternInstance,
    patternProps: object,
}

interface GridSvgState {
    grid: GridInterface,
}

class GridSvg extends React.Component<GridSvgProps, GridSvgState> {
    patternInterval = null;

    static defaultProps = {
        mini: false,
        width: 400
    };

    constructor (props) {
        super(props);
        this.state = {
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
        const { classes } = this.props;
        const { grid } = this.state;
        
        const width = 200;
        const height = width / grid.numCols * grid.numRows;

        // Set up the viewbox to account for a small margin around the LEDs
        const margin = LED_RADIUS;
        const viewBox = `${-margin} ${-margin} ${grid.numCols - 1 + margin * 2} ${grid.numRows - 1 + margin * 2}`;
        const translate = `translate(${margin} ${margin})`;

        return (
            <svg viewBox={viewBox} width={width} height={height} className={classes.svg}>
                <g transform={translate}>
                    {grid.strips.map((strip, i) => {
                        return <Strip key={i} leds={strip.leds} numRows={grid.numRows} colNum={i} />;
                    })}
                </g>
            </svg>
        );
    }
}

export default withStyles(styles)(GridSvg);