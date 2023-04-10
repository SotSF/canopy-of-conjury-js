import { Color, RGB } from "@/colors";
import { CanopyInterface, MaybeOscillator } from "@/types";
import BasePattern from "./BasePattern";
import { PatternPropTypes } from "./utils";
import { Memoizer } from "./memoizer";

enum BeatPattern {
  deepBreath,
  shallowBreath,
  beating,
}

type HeartbeatSerializedExtra = {
  pulse: number;
  grow: boolean;
};

type HeartbeatProps = {
  color: Color;
  opacity: MaybeOscillator<number>;
  beatPattern: BeatPattern;
};

export class Heartbeat extends BasePattern {
  static displayName = "Heartbeat";
  static propTypes = {
    color: new PatternPropTypes.Color(),
    opacity: new PatternPropTypes.Range(0, 1, 0.01).enableOscillation(),
    beatPattern: new PatternPropTypes.Enum(BeatPattern),
  };

  static defaultProps(): HeartbeatProps {
    return {
      color: RGB.random(),
      opacity: 1,
      beatPattern: BeatPattern.deepBreath,
    };
  }

  readonly dimension = 300;
  readonly maxPulse = 1.5;
  readonly minPulse = 0.05;
  readonly memoizer = new Memoizer();
  readonly velocity = 0.03;

  pulse = 0;
  grow = true;

  pause = false;
  beatCount = 0;
  progress() {
    super.progress();

    this.applyBeatPattern();

    if (this.pulse > this.maxPulse) {
      this.pulse = this.maxPulse;
      this.grow = false;
    }

    if (this.pulse < this.minPulse) {
      this.pulse = this.minPulse;
      this.grow = true;
    }
  }

  render(canopy: CanopyInterface) {
    const memoizedMap = this.memoizer.createMap(this.dimension, canopy);
    const color = this.values.color.withAlpha(this.values.opacity);

    let t = 0;
    while (t < 500) {
      const x =
        (1 + this.pulse) * (16 * Math.sin(t) * Math.sin(t) * Math.sin(t));
      const y =
        (1 + this.pulse) *
        (13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t));
      const x2 = Math.floor(x * 2 + this.dimension / 2);
      const y2 = Math.floor(y * 2 + this.dimension / 2);
      const co = memoizedMap.mapCoords(x2, y2);

      for (let l = 0; l <= Math.min(co.led, canopy.stripLength - 1); l++) {
        canopy.strips[co.strip].updateColor(l, color);
      }

      t++;
    }
  }

  applyBeatPattern() {
    switch (this.values.beatPattern) {
      case BeatPattern.deepBreath: {
        if (this.grow) {
          this.pulse += this.velocity * 0.75;
        } else {
          this.pulse += -this.velocity * 1.5;
        }
        break;
      }
      case BeatPattern.shallowBreath: {
        if (this.grow) {
          this.pulse += this.velocity * 10;
        } else {
          this.pulse += -this.velocity * 8;
        }
        break;
      }
      case BeatPattern.beating: {
        if (
          (!this.pause && this.beatCount === 2) ||
          (this.pause && this.beatCount === 6)
        ) {
          this.pause = !this.pause;
          this.beatCount = 0;
        }
        if (!this.pause) {
          if (this.grow) {
            this.pulse += this.velocity * 10;
          } else {
            this.pulse = this.minPulse - 1;
            this.beatCount++;
          }
        } else {
          this.beatCount++;
        }
        break;
      }
    }
  }

  serializeExtra(): HeartbeatSerializedExtra {
    return {
      pulse: this.pulse,
      grow: this.grow,
    };
  }

  deserializeExtra(object: HeartbeatSerializedExtra) {
    this.pulse = object.pulse;
    this.grow = object.grow;
  }
}
