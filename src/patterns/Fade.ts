import _ from "lodash";
import { Color, RGB } from "@/colors";
import { CanopyInterface, MaybeOscillator } from "@/types";
import BasePattern from "./BasePattern";
import { PatternPropTypes } from "./utils";

const LIFECYCLE_END = 500;

type FadeProps = {
  colors: Color[];
  speed: MaybeOscillator<number>;
  opacity: MaybeOscillator<number>;
};

type FadeSerializedExtra = {
  colorIndex: number | null;
  currentColor: RGB.Serialized | undefined;
  lifecycle: number;
};

/**
 * Emits pulse rings from center - each ring is a different color, following a gradient color scheme
 */
export class Fade extends BasePattern {
  static displayName = "Fade";

  static propTypes = {
    colors: new PatternPropTypes.Array(PatternPropTypes.Color),
    speed: new PatternPropTypes.Range(1, 10).enableOscillation(),
    opacity: new PatternPropTypes.Range(0, 1, 0.01).enableOscillation(),
  };

  static defaultProps(): FadeProps {
    return {
      colors: [RGB.random(), RGB.random()],
      speed: 2,
      opacity: 1,
    };
  }

  // Keep `colorIndex` so we know which color to proceed to next (in case the same color appears
  // twice); keep `currentColor` in case the current active color is removed while it is being
  // displayed
  colorIndex: number | null = null;
  currentColor: Color | null = null;

  // Keeps track of where in the lifecycle of a color we are. 0 is the start, and `LIFECYCLE_END`
  // is the end.
  lifecycle: number = 0;

  constructor(props: FadeProps) {
    super(props);

    if (props.colors.length) {
      this.colorIndex = 0;
      this.currentColor = props.colors[0];
    }
  }

  progress() {
    super.progress();

    // If we now have a color, start the cycle
    if (this.currentColor === null && this.values.colors.length) {
      this.colorIndex = 0;
      this.currentColor = this.values.colors[this.colorIndex];
      return;
    }

    // If the current color is finished, reset the lifecycle
    else if (this.lifecycle === LIFECYCLE_END) {
      this.lifecycle = 0;

      // Choose a new color if there are any
      if (this.values.colors.length) {
        this.colorIndex = (this.colorIndex! + 1) % this.values.colors.length;
        this.currentColor = this.values.colors[this.colorIndex];
      } else {
        this.colorIndex = null;
        this.currentColor = null;
      }
    }

    // If we've got a color in process...
    else if (this.currentColor) {
      this.lifecycle += this.values.speed;
      if (this.lifecycle > LIFECYCLE_END) {
        this.lifecycle = LIFECYCLE_END;
      }
    }
  }

  render(canopy: CanopyInterface) {
    // If there's no color, there's nothing to do
    if (!this.currentColor) return;

    const amplitude = Math.sin(Math.PI * (this.lifecycle / LIFECYCLE_END));
    const opacity = this.values.opacity;
    const color = this.currentColor.withAlpha(amplitude * opacity);

    canopy.strips.forEach((strip) => {
      strip.updateColors(color);
    });
  }

  serializeExtra(): FadeSerializedExtra {
    return {
      colorIndex: this.colorIndex,
      currentColor: this.currentColor?.serialize(),
      lifecycle: this.lifecycle,
    };
  }

  deserializeExtra(obj: FadeSerializedExtra) {
    this.colorIndex = obj.colorIndex;
    this.lifecycle = obj.lifecycle;

    if (obj.currentColor) this.currentColor = RGB.fromObject(obj.currentColor);
  }
}
