import { PatternInstance, PatternInterface } from "../types";
import { BackgroundColor } from "./BackgroundColor";
import BasePattern from "./BasePattern";
import { Bubbles } from "./Bubbles";
import { CircleBurst } from "./CircleBurst";
import { ColorWave } from "./ColorWave";
import { ConcentricCircles } from "./ConcentricCircles";
import { Drops } from "./Drops";
import { Fade } from "./Fade";
import { Fireflies } from "./Fireflies";
import { GradientFlow } from "./GradientFlow";
import { GradientPulse } from "./GradientPulse";
import { Heartbeat } from "./Heartbeat";
import { Kaleidoscope } from "./Kaleidoscope";
import { Mandala } from "./Mandala";
import { Map as CityMap } from "./Map";
import { Radar } from "./Radar";
import { RainbowSpiral } from "./RainbowSpiral";
import { ShootingStars } from "./ShootingStars";
import { SineRing } from "./SineRing";
import { Snake } from "./Snake";
import { Swarm } from "./Swarm";
import { Swirly } from "./Swirly";
import { SwirlyZig } from "./SwirlyZig";
import { TestLEDs } from "./Test";
import { Time } from "./Time";
import { Triangles } from "./Triangles";
import { Venn } from "./Venn";

export const allPatterns = [
  BackgroundColor,
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
  CityMap,
  Radar,
  RainbowSpiral,
  ShootingStars,
  SineRing,
  Snake,
  Swarm,
  Swirly,
  SwirlyZig,
  Time,
  Triangles,
  Venn,
] as unknown as PatternInterface[]; // This is super hacky, but expedient

export {
  BackgroundColor,
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
  CityMap as Map,
  Radar,
  RainbowSpiral,
  ShootingStars,
  SineRing,
  Snake,
  Swarm,
  Swirly,
  SwirlyZig,
  Time,
  Triangles,
  Venn,

  // Test patterns
  TestLEDs,
};

const patternMap = new Map<string, typeof allPatterns[number]>();
allPatterns.forEach((pattern) => {
  patternMap.set(pattern.displayName, pattern);
});

/** Takes the display name of a pattern and returns the pattern class */
export const getPatternByName = (name: string) => {
  return patternMap.get(name);
};

/** Takes an instance of a pattern and returns class that created it */
export const getPatternClassFromInstance = (pattern: PatternInstance) => {
  for (const patternClass of allPatterns) {
    if (pattern instanceof patternClass) {
      return patternClass;
    }
  }
};
