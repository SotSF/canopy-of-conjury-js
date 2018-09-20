import {pattern} from "../types";
import BasePattern from "./BasePattern";
import {HSV, RGB} from "../colors";
import * as _ from "lodash";
import {NUM_LEDS_PER_STRIP, NUM_STRIPS} from "../canopy";
import * as util from "../util";
import * as dat from 'dat.gui';

// const sine = (freq, pha, t) => Math.sin(2 * Math.PI * freq * t + pha);
const sine = (freq, pha, t) => {
  return Math.abs(t * 2 * freq + pha) % 2 - 1
};
let TOTAL_NUM_LEDS = NUM_STRIPS * NUM_LEDS_PER_STRIP;
const SCAN_SPEED = TOTAL_NUM_LEDS;
// leds / sec

const buildOscParameters = (oscName) => ({
  [`${oscName}FreqExp`]: 0,
  [`${oscName}Mix`]: 1,
  [`${oscName}Sync`]: 0,
});

const addOscToGui = (gui, parameters, oscName) => {
  const oscFolder = gui.addFolder(oscName);
  oscFolder.add(parameters, `${oscName}FreqExp`, -1, 5);
  oscFolder.add(parameters, `${oscName}Mix`, 0, 1);
  oscFolder.add(parameters, `${oscName}Sync`, -10, 10);
};

@pattern()
export class Synth extends BasePattern {
  parameters = {
    ...buildOscParameters('osc1'),
    ...buildOscParameters('osc2'),
    ...buildOscParameters('osc3'),
  };

  constructor(...args) {
    // @ts-ignore
    super(...args);

    const gui = new dat.GUI();

    // var customContainer = document.body;
    // customContainer.appendChild(gui.domElement);

    addOscToGui(gui, this.parameters, 'osc1');
    addOscToGui(gui, this.parameters, 'osc2');
    addOscToGui(gui, this.parameters, 'osc3');
  }

  static displayName = 'Synth';

  static propTypes = {
  };

  static defaultProps () {
    return {}
  }

  render(canopy) {
    const t = Date.now() / 1000;

    const {
      osc1FreqExp,
      osc1Mix,
      osc1Sync,
      osc2FreqExp,
      osc2Mix,
      osc2Sync,
      osc3FreqExp,
      osc3Mix,
      osc3Sync,
    } = this.parameters;

    // const osc1Func = createOscFunc(this.parameters, 'osc1');
    const osc1Freq = Math.pow(10, osc1FreqExp);
    const osc2Freq = Math.pow(10, osc2FreqExp);
    const osc3Freq = Math.pow(10, osc3FreqExp);


    for(let i = 0; i < NUM_STRIPS; i++) {
      for(let j = 0; j < NUM_LEDS_PER_STRIP; j++) {
        const ledIndex = (i * NUM_LEDS_PER_STRIP + j);
        // const numLedsOffset = currentLedIndexByTime - ledIndex;
        // const timeOffset = numLedsOffset / SCAN_SPEED * 1000;
        // console.log(timeOffset);

        const r = osc1Mix * (sine(osc1Freq, Math.PI * t * osc1Sync, ledIndex / SCAN_SPEED) + 1) * 255/2;
        const g = osc2Mix * (sine(osc2Freq, Math.PI * t * osc2Sync, ledIndex / SCAN_SPEED) + 1) * 255/2;
        const b = osc3Mix * (sine(osc3Freq, Math.PI * t * osc3Sync, ledIndex / SCAN_SPEED) + 1) * 255/2;

        canopy.strips[i].updateColor(j, new RGB(r, g, b));
      }
    }
  }

  serializeExtra() {
    return {};
  }

  deserializeExtra(obj) {
  }
}
