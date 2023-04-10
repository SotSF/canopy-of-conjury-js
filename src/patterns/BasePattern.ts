import _ from "lodash";
import { NUM_STRIPS, NUM_LEDS_PER_STRIP } from "@/canopy";
import { RGB, isColor } from "@/colors";
import {
  CanopyInterface,
  CanopyCoordinate,
  PatternInstance,
  PatternInterface,
  PropType,
  PropSet,
  IPatternState,
} from "@/types";
import * as util from "@/util";
import {
  isOscillatorWrapper,
  Oscillator,
  OscillatorWrapper,
  PatternPropTypes,
} from "./utils";

// @ts-ignore: I don't know how to teach typescript that class will have the static property
export default abstract class BasePattern<PatternProps extends PropSet = {}>
  implements PatternInstance
{
  static displayName: string;
  props: PatternProps;
  values: Record<string, any>;
  iteration = 0;

  // Patterns are typically produced assuming they will be run on a canopy with 96 strips
  // of 75 LEDs each. Sometimes this isn't true, however. This function will scale the point from
  // the standard-sized canopy to whatever is given.
  static convertCoordinate(
    coordinate: CanopyCoordinate,
    canopy: CanopyInterface
  ) {
    const { strip, led } = coordinate;

    const canopyStrip = Math.round(
      util.scale(strip, 0, NUM_STRIPS - 1, 0, canopy.strips.length - 1)
    );

    const canopyLed = Math.round(
      util.scale(led, 0, NUM_LEDS_PER_STRIP - 1, 0, canopy.stripLength - 1)
    );

    return { strip: canopyStrip, led: canopyLed };
  }

  serialize() {
    const serializeProp = (value: any): object => {
      if (typeof value === "object" && "serialize" in value) {
        // @ts-ignore
        return value.serialize();
      } else if (_.isArray(value)) {
        return value.map(serializeProp);
      } else {
        return value;
      }
    };

    // Serialize the props
    const props: PropSet = {};
    Object.entries(this.props).forEach(([name, value]) => {
      props[name] = serializeProp(value);
    });

    return {
      // @ts-ignore
      type: this.constructor.displayName,
      props,
      extra: this.serializeExtra(),
      iteration: this.iteration,
    };
  }

  // Should be overridden in inheriting classes if they have any additional parameters that must
  // be serialized
  deserializeExtra(extra: any) {}
  serializeExtra() {
    return {};
  }

  deserializeProps(props: object): PropSet {
    const parseProp = (propType: PropType, value: any) => {
      if (propType instanceof PatternPropTypes.Color) {
        if (isColor(value)) {
          return RGB.fromObject(value.toRgb());
        } else {
          return OscillatorWrapper.fromObject(value);
        }
      } else if (propType instanceof PatternPropTypes.Array) {
        return value.map((v: any) => parseProp(propType.types, v));
      } else if (propType instanceof PatternPropTypes.Oscillator) {
        return new Oscillator(value);
      } else {
        return OscillatorWrapper.fromObject(value) || value;
      }
    };

    // Deserialize the props
    const deserialized: PropSet = {};
    Object.entries(props).forEach(([name, value]) => {
      const propType = (<PatternInterface>this.constructor).propTypes[name];
      deserialized[name] = parseProp(propType, value);
    });

    return deserialized;
  }

  deserialize(state: IPatternState) {
    this.updateProps(this.deserializeProps(state.props));
    this.deserializeExtra(state.extra);
    this.iteration = state.iteration;
  }

  // These must each be implemented in inheriting classes
  abstract render(canopy: CanopyInterface): void;

  constructor(props: PatternProps) {
    this.values = {};

    // If no props are provided, use the default props
    // @ts-ignore: I don't know how to teach typescript that class will have the static property
    this.props = props || this.constructor.defaultProps();
  }

  progress() {
    this.iteration++;

    // If any of the props are oscillators
    this.values = {};
    Object.entries(this.props).forEach(([name, value]) => {
      if (isOscillatorWrapper(value)) {
        this.values[name] = value.value();
      } else {
        this.values[name] = value;
      }
    });
  }

  updateProps(props: PropSet) {
    _.merge(this.props, props);
  }
}
