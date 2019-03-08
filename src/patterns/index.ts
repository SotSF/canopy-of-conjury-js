
import { PatternInstance, PatternInterface } from '../types';
import { BackgroundColor } from './BackgroundColor';
import { CircleBurst } from './CircleBurst';
import { Fade } from './Fade';
import { Fireflies } from './Fireflies';
import { GradientFlow } from './GradientFlow';
import { GradientPulse } from './GradientPulse';
import { Kaleidoscope } from './Kaleidoscope';
import { RainbowLines } from './RainbowLines';
import { ShootingStars } from './ShootingStars';
import { Snake } from './Snake';
import { TestLEDs } from './Test';
import { Venn } from './Venn';

export const allPatterns = [
    BackgroundColor,
    CircleBurst,
    Fade,
    Fireflies,
    GradientFlow,
    GradientPulse,
    Kaleidoscope,
    RainbowLines,
    ShootingStars,
    Snake,
    Venn
];

export {
    BackgroundColor,
    CircleBurst,
    Fade,
    Fireflies,
    GradientFlow,
    GradientPulse,
    Kaleidoscope,
    RainbowLines,
    ShootingStars,
    Snake,
    Venn,

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
