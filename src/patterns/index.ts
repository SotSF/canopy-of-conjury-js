
import { PatternInstance, PatternInterface } from '../types';
import { Bubbles } from './Bubbles';
import { ColorWave } from './ColorWave';
import { ConcentricCircles } from './ConcentricCircles';
import { Fade } from './Fade';
import { Fireflies } from './Fireflies';
import { GradientFlow } from './GradientFlow';
import { GradientPulse } from './GradientPulse';
import { Heartbeat } from './Heartbeat';
import { Kaleidoscope } from './Kaleidoscope';
import { Map } from './Map';
import { Radar } from './Radar';
import { RainbowSpiral } from './RainbowSpiral';
import { ShootingStars } from './ShootingStars';
import { SineRing } from './SineRing';
import { Snake } from './Snake';
import { Swirly } from './Swirly';
import { SwirlyZig } from './SwirlyZig';
import { TestLEDs } from './Test';
import { Triangles } from './Triangles';

export const allPatterns = [
    Bubbles,
    ColorWave,
    ConcentricCircles,
    Fade,
    Fireflies,
    GradientFlow,
    GradientPulse,
    Heartbeat,
    Kaleidoscope,
    Map,
    Radar,
    RainbowSpiral,
    ShootingStars,
    SineRing,
    Snake,
    Swirly,
    SwirlyZig,
    Triangles,
];

export {
    Bubbles,
    ColorWave,
    ConcentricCircles,
    Fade,
    Fireflies,
    GradientFlow,
    GradientPulse,
    Heartbeat,
    Kaleidoscope,
    Map,
    Radar,
    RainbowSpiral,
    ShootingStars,
    SineRing,
    Snake,
    Swirly,
    SwirlyZig,
    Triangles,

    // Test patterns
    TestLEDs,
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
