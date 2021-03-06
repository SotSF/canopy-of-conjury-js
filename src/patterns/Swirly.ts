
import * as _ from 'lodash';
import { NUM_STRIPS, NUM_LEDS_PER_STRIP } from '../canopy';
import { RGB, Color } from '../colors';
import { MaybeOscillator, pattern } from '../types';
import * as util from '../util';
import BasePattern from './BasePattern';
import { PatternPropTypes } from './utils';


interface SwirlyProps {
    color1: Color
    color2: Color
    quantity: number
    opacity: MaybeOscillator<number>
    fromApex: boolean
    clockwise: boolean
}

@pattern()
export class Swirly extends BasePattern {
    static displayName = 'Swirly';
    static propTypes = {
        color1: new PatternPropTypes.Color().enableOscillation(),
        color2: new PatternPropTypes.Color().enableOscillation(),
        quantity: new PatternPropTypes.Range(1, 100),
        opacity: new PatternPropTypes.Range(0, 1, 0.01).enableOscillation(),
        fromApex: new PatternPropTypes.Boolean(),
        clockwise: new PatternPropTypes.Boolean()
    };

    static defaultProps () : SwirlyProps {
        return {
            color1: RGB.random(),
            color2: RGB.random(),
            quantity: 30,
            opacity: 1,
            fromApex: true,
            clockwise: true
        };
    }

    private readonly colorRate = 0.05;

    private f = 0.01;
    private color: Color = null;
    private colorDir = 1;
    private swirls = [];

    constructor (props: SwirlyProps) {
        super(props);

        // Initialize swirls
        this.color = props.color1;
        for (let i = 0; i <= props.quantity; i++) {
            this.makeSwirl();
        }
    }

    makeSwirl () {
        const head = {
            strip: Math.floor(Math.random() * NUM_STRIPS),
            led: this.props.fromApex ? 0 : NUM_LEDS_PER_STRIP - 1
        };

        this.swirls.push({
            max: Math.floor(Math.random() * 30 + 15),
            lights: [{ ...head }],
            head: head,
            color: this.color,
            isComplete: false
        });
    }

    progress () {
        super.progress();

        if (this.swirls.length < this.values.quantity) {
            this.makeSwirl();
        }

        this.swirls.forEach((swirl) => {
            // Advance the swirl if there's still space
            if (swirl.lights.length < swirl.max && !swirl.isComplete) {
                swirl.lights.push({ strip: swirl.head.strip, led: swirl.head.led });
            } else {
                swirl.isComplete = true;
            }

            // Adjust the swirl's lights
            swirl.lights.forEach((light) => {
                light.strip += this.values.clockwise ? -1 : 1;
                light.led += this.values.fromApex ? 1 : -1;

                if (light.strip >= NUM_STRIPS) {
                    light.strip %= NUM_STRIPS;
                } else if (light.strip < 0) {
                    light.strip = NUM_STRIPS - 1;
                }

                if (light.led >= NUM_LEDS_PER_STRIP || light.led < 0) {
                    swirl.lights = _.without(swirl.lights, light);
                }

                if (swirl.lights.length == 0) {
                    this.swirls = _.without(this.swirls, swirl);
                }
            });
        });

        // Adapt the pattern color
        const color1 = this.values.color1;
        const color2 = this.values.color2;
        this.color = new RGB(
            util.lerp(color1.r, color2.r, this.f),
            util.lerp(color1.g, color2.g, this.f),
            util.lerp(color1.b, color2.b, this.f)
        );

        this.f += this.colorRate * this.colorDir;
        if (this.f >= 1) {
            this.f = 1;
            this.colorDir = -1;
        } else if (this.f <= 0) {
            this.f = 0;
            this.colorDir = 1;
        }
    }

    render (canopy) {
        const brightness = this.values.opacity;
        this.swirls.forEach((swirl) => {
            swirl.lights.forEach((light) => {
                const color = swirl.color.withAlpha(brightness);
                const converted = Swirly.convertCoordinate(light, canopy);
                canopy.strips[converted.strip].updateColor(converted.led, color);
            });
        });
    }

    serializeExtra () {
        return {
            f: this.f,
            color: this.color.serialize(),
            colorDir: this.colorDir,
            swirls: this.swirls.map(swirl => ({
                ...swirl,
                color: swirl.color.serialize()
            }))
        };
    }

    deserializeExtra (object) {
        this.f = object.f;
        this.color = RGB.fromObject(object.color);
        this.colorDir = object.colorDir;
        this.swirls = object.swirls.map(swirl => ({
            ...swirl,
            color: RGB.fromObject(swirl.color)
        }));
    }
}
