import {pattern} from "../types";
import BasePattern from "./BasePattern";
import {HSV, RGB} from "../colors";
import * as _ from "lodash";
import {NUM_LEDS_PER_STRIP, NUM_STRIPS} from "../canopy";
import * as util from "../util";
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
  [`${oscName}PulseWidth`]: 0.5,
  [`${oscName}Mix`]: 1,
});

const addOscToGui = (gui, parameters, oscName) => {
  const oscFolder = gui.addFolder(oscName);

  oscFolder.add(parameters, `${oscName}FreqExp`, -1, 5);
  oscFolder.add(parameters, `${oscName}Sync`, -10, 10);
  oscFolder.add(parameters, `${oscName}Wave`, Object.keys(waves));
  oscFolder.add(parameters, `${oscName}PulseWidth`, 0, 0.5);
  oscFolder.addColor(parameters, `${oscName}Color`);
  oscFolder.add(parameters, `${oscName}Mix`, 0, 1);
};

// oscillates between 0 and 1
const osc = (parameters, oscName) => {
  const {
    [`${oscName}FreqExp`]: oscFreqExp,
    [`${oscName}Mix`]: oscMix,
    [`${oscName}Sync`]: oscSync,
    [`${oscName}Wave`]: oscWave,
    [`${oscName}PulseWidth`]: oscPulseWidth,
  } = parameters;

  const oscFreq = Math.pow(10, oscFreqExp);
  const wave = waves[oscWave](oscPulseWidth);

  return (t, ledIndex) => {
    return oscMix * (
      wave(oscFreq, t * oscSync, ledIndex / SCAN_SPEED) + 1
    ) / 2;
  }
};

const applyColor = (colorArray, oscValue) => {
  return [
    colorArray[0] * oscValue,
    colorArray[1] * oscValue,
    colorArray[2] * oscValue,
  ]
};

@pattern()
export class Synth extends BasePattern {
  parameters = {
    ...buildOscParameters('osc1'),
    ...buildOscParameters('osc2'),
    ...buildOscParameters('osc3'),
    osc1Color: [255, 0, 0],
    osc2Color: [0, 255, 0],
    osc3Color: [0, 0, 255],
  };

  constructor(...args) {
    // @ts-ignore
    super(...args);

    if(typeof window == 'undefined') {
      return
    }

    const dat = require('dat.gui');
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

        const osc1Color = applyColor(this.parameters.osc1Color, osc1(t, ledIndex));
        const osc2Color = applyColor(this.parameters.osc2Color, osc2(t, ledIndex));
        const osc3Color = applyColor(this.parameters.osc3Color, osc3(t, ledIndex));

        const r = Math.max(osc1Color[0], osc2Color[0], osc3Color[0]);
        const g = Math.max(osc1Color[1], osc2Color[1], osc3Color[1]);
        const b = Math.max(osc1Color[2], osc2Color[2], osc3Color[2]);

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
