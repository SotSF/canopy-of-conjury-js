import _ from "lodash";
import { Color } from "../colors";
import { CanopyInterface, LedInterface, StripInterface } from "../types";
import { NUM_LEDS_PER_STRIP, NUM_STRIPS } from "./constants";

class Strip implements StripInterface {
  leds: LedInterface[][];

  constructor(numLedsPerStrip: number) {
    this.leds = _.range(numLedsPerStrip).map(() => []);
  }

  get length() {
    return this.leds.length;
  }

  updateColor(index: number, color: Color) {
    this.leds[index].push(color.toRgb());
  }

  updateColors(color: Color) {
    _.range(this.leds.length).forEach((i) => this.updateColor(i, color));
  }

  clear() {
    for (let i = 0; i < this.leds.length; i++) {
      this.leds[i] = [];
    }
  }
}

export class Canopy implements CanopyInterface {
  strips: StripInterface[];

  constructor(
    numStrips: number = NUM_STRIPS,
    numLedsPerStrip: number = NUM_LEDS_PER_STRIP
  ) {
    this.strips = _.range(numStrips).map(() => new Strip(numLedsPerStrip));
  }

  get stripLength() {
    return this.strips[0].length;
  }

  clear() {
    this.strips.forEach((strip) => strip.clear());
  }
}
