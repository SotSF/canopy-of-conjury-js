
import { PatternInstance, PatternInterface } from '../types';
import { Bubbles } from './Bubbles';
import { CircleBurst } from './CircleBurst';
import { ColorWave } from './ColorWave';
import { ConcentricCircles } from './ConcentricCircles';
import { Drops } from './Drops';
import { Fade } from './Fade';
import { Fireflies } from './Fireflies';
import { GradientFlow } from './GradientFlow';
import { GradientPulse } from './GradientPulse';
import { Heartbeat } from './Heartbeat';
import { Kaleidoscope } from './Kaleidoscope';
import { Mandala } from './Mandala';
import { Map } from './Map';
import { Oscillator } from './Oscillator';
import { Radar } from './Radar';
import { RainbowSpiral } from './RainbowSpiral';
import { ShootingStars } from './ShootingStars';
import { SineRing } from './SineRing';
import { Snake } from './Snake';
import { Swarm } from './Swarm';
import { Swirly } from './Swirly';
import { SwirlyZig } from './SwirlyZig';
import { TestLEDs } from './Test';
import { Time } from './Time';
import { Triangles } from './Triangles';
import { SoundTest } from './SoundTest';
import { SoundBeat } from './SoundBeat';
import {Synth} from './Synth';
import { Venn } from './Venn';

export const allPatterns = [
    
    Bubbles,
    CircleBurst,
    ColorWave,
    ConcentricCircles,
    Drops,
    Fade,
    Fireflies,
    GradientFlow,
    GradientPulse,
    Heartbeat,
    Kaleidoscope,
    Mandala,
    Map,
    Oscillator,
    Radar,
    RainbowSpiral,
    ShootingStars,
    SineRing,
    Snake,
    SoundBeat,
    SoundTest,
    Swarm,
    Swirly,
    SwirlyZig,
    Synth,
    Time,
    Triangles,
    Venn
];

export {
    
    Bubbles,
    CircleBurst,
    ColorWave,
    ConcentricCircles,
    Drops,
    Fade,
    Fireflies,
    GradientFlow,
    GradientPulse,
    Heartbeat,
    Kaleidoscope,
    Mandala,
    Map,
    Oscillator,
    Radar,
    RainbowSpiral,
    ShootingStars,
    SineRing,
    SoundBeat,
    SoundTest,
    Snake,
    Swarm,
    Swirly,
    SwirlyZig,
    Time,
    Triangles,
    Venn,

    // Test patterns
    TestLEDs
}

/** Takes the display name of a pattern and returns the pattern class */
export const getPatternByName = (name: string): PatternInterface => {
    for (let i = 0; i < allPatterns.length; i++) {
        if (allPatterns[i].displayName === name) {
            return allPatterns[i];
        }
    }

    // Didn't find a pattern with the given name
    return null;
};

/** Takes an instance of a pattern and returns class that created it */
export const getPatternClassFromInstance = (pattern: PatternInstance): PatternInterface => {
    for (let i = 0; i < allPatterns.length; i++) {
        if (pattern instanceof allPatterns[i]) {
            return allPatterns[i];
        }
    }

    // Didn't find a pattern class that matched the given pattern
    return null;
};
