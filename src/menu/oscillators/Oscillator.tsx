
import * as React from 'react';
import * as _ from 'lodash';

import Card from '@material-ui/core/Card';


interface WaveImageProps {
    waveFunction (x: number): number
}

interface WaveImageState {
    theta: number
}

class WaveImage extends React.Component<WaveImageProps, WaveImageState> {
    static SVG_HEIGHT = 200;
    static SVG_WIDTH = 200;

    state = {
        theta: 0
    };

    componentDidMount () {
        // Create an interval for updating the state
        setInterval(() => {
            this.setState({ theta: this.state.theta += 0.1 });
        }, 10);
    }

    render () {
        const baseLine = WaveImage.SVG_HEIGHT / 2;
        const points = _.range(WaveImage.SVG_WIDTH).map((x) => {
            // Map the SVG x-coordinate to the wave function's domain of [0, 8 pi]
            const xMapped = Math.PI * 8 / WaveImage.SVG_WIDTH * x;
            const y = baseLine - (this.props.waveFunction(xMapped + this.state.theta) * 90);
            return `L ${x} ${y}`;
        });

        const instructions = [
            `M 0 ${baseLine}`,
            ...points
        ];

        return (
            <svg width={WaveImage.SVG_WIDTH} height={WaveImage.SVG_HEIGHT} style={{ backgroundColor: 'black' }}>
                <path d={instructions.join(' ')} stroke="green" strokeWidth={2} fill="none" />
            </svg>
        );
    }
}


export default class Oscillator extends React.Component {
    render () {
        return (
            <Card>
                <WaveImage waveFunction={Math.sin} />
            </Card>
        );
    }
}
