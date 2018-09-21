import {pattern} from "../types";
import BasePattern from "./BasePattern";
import {HSV, RGB} from "../colors";
import * as _ from "lodash";
import {NUM_LEDS_PER_STRIP, NUM_STRIPS} from "../canopy";
import * as util from "../util";
import * as dat from 'dat.gui';
import * as waves from './Synth/waves';

// const sine = (freq, pha, t) => Math.sin(2 * Math.PI * freq * t + pha);
// const sine = (freq, pha, t) => {
//   return Math.abs(t * 2 * freq + pha) % 2 - 1
// };
const TOTAL_NUM_LEDS = NUM_STRIPS * NUM_LEDS_PER_STRIP;
const SCAN_SPEED = TOTAL_NUM_LEDS;
// leds / sec

const buildOscParameters = (oscName) => ({
  [`${oscName}FreqExp`]: 0,
  [`${oscName}Sync`]: 0,
  [`${oscName}Wave`]: 'sine',
  [`${oscName}Mix`]: 1,
});

const addOscToGui = (gui, parameters, oscName) => {
  const oscFolder = gui.addFolder(oscName);
  oscFolder.add(parameters, `${oscName}FreqExp`, -1, 5);
  oscFolder.add(parameters, `${oscName}Sync`, -10, 10);
  oscFolder.add(parameters, `${oscName}Wave`, Object.keys(waves));
  oscFolder.add(parameters, `${oscName}Mix`, 0, 1);
};

// oscillates between 0 and 1
const osc = (parameters, oscName) => {
  const {
    [`${oscName}FreqExp`]: oscFreqExp,
    [`${oscName}Mix`]: oscMix,
    [`${oscName}Sync`]: oscSync,
    [`${oscName}Wave`]: oscWave,
  } = parameters;

  const oscFreq = Math.pow(10, oscFreqExp);
  const wave = waves[oscWave];

  return (t, ledIndex) => {
    return oscMix * (
      wave(oscFreq, t * oscSync, ledIndex / SCAN_SPEED) + 1
    ) / 2;
  }
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

    const osc1 = osc(this.parameters, 'osc1');
    const osc2 = osc(this.parameters, 'osc2');
    const osc3 = osc(this.parameters, 'osc3');

    for(let i = 0; i < NUM_STRIPS; i++) {
      for(let j = 0; j < NUM_LEDS_PER_STRIP; j++) {
        const ledIndex = (i * NUM_LEDS_PER_STRIP + j);
        // const numLedsOffset = currentLedIndexByTime - ledIndex;
        // const timeOffset = numLedsOffset / SCAN_SPEED * 1000;
        // console.log(timeOffset);

        const r = osc1(t, ledIndex) * 255;
        // const g = r;
        // const b = r;
        const g = osc2(t, ledIndex) * 255;
        const b = osc3(t, ledIndex) * 255;

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