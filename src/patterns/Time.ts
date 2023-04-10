import { RGB } from "@/colors";
import { CanopyInterface } from "@/types";
import BasePattern from "./BasePattern";

export class Time extends BasePattern {
  static displayName = "Time";
  static propTypes = {};

  static defaultProps() {
    return {};
  }

  render(canopy: CanopyInterface) {
    // render Clockface
    for (
      let s = canopy.strips.length - 1;
      s > 0;
      s -= canopy.strips.length / 12
    ) {
      for (let l = 45; l < canopy.stripLength; l++) {
        if (s === canopy.strips.length - 1) {
          canopy.strips[Math.floor(s)].updateColor(l, new RGB(255, 0, 0));
        } else {
          canopy.strips[Math.floor(s)].updateColor(l, new RGB(255, 255, 255));
        }
      }
    }

    // render hands
    const time = new Date();
    const hour = time.getHours();
    const minute = time.getMinutes();
    const second = time.getSeconds();

    let hourStrip = Math.floor(
      canopy.strips.length - 1 - (hour * 2 * canopy.strips.length) / 24
    );
    hourStrip -= Math.floor(((minute / 60) * canopy.strips.length) / 12);
    let minuteStrip = Math.floor(
      canopy.strips.length - 1 - (minute * canopy.strips.length) / 60
    );
    let secondStrip = Math.floor(
      canopy.strips.length - 1 - (second * canopy.strips.length) / 60
    );

    if (hourStrip < 0) hourStrip += canopy.strips.length;
    if (minuteStrip < 0) minuteStrip += canopy.strips.length;
    if (secondStrip < 0) secondStrip += canopy.strips.length;

    for (let l = 0; l < 40; l++) {
      canopy.strips[hourStrip].updateColor(l, new RGB(255, 0, 0));
    }
    for (let l = 0; l < 70; l++) {
      canopy.strips[minuteStrip].updateColor(l, new RGB(0, 0, 255));
    }
    for (let l = 65; l < 70; l++) {
      canopy.strips[secondStrip].updateColor(l, new RGB(0, 255, 0));
    }
  }
}
