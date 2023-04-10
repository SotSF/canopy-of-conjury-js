import { NUM_STRIPS } from "@/canopy";
import { RGB } from "@/colors";
import { CanopyInterface } from "@/types";
import BasePattern from "./BasePattern";

/**
 * Test pattern to determine order of strips
 */
export class TestLEDs extends BasePattern {
  static displayName = "Test LEDs";
  static propTypes = {};
  static defaultProps = () => ({});

  colors = [
    new RGB(255, 0, 0),
    new RGB(255, 255, 0),
    new RGB(0, 255, 0),
    new RGB(0, 255, 255),
    new RGB(0, 0, 255),
    new RGB(255, 0, 255),
    new RGB(150, 150, 255),
    new RGB(255, 150, 150),
  ];

  render(canopy: CanopyInterface) {
    var c = 0;
    for (let s = 0; s < NUM_STRIPS; s++) {
      canopy.strips[s].updateColors(this.colors[c]);
      if ((s + 1) % this.colors.length == 0) c++;
      if (c >= this.colors.length) {
        c = 0;
      }
    }
  }
}
