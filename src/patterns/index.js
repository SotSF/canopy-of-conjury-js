import { Canvas } from '../canvas';

export { GradientPulse } from './gradient_pulse';
export { TestLEDs, TestCanvas, TestCanvasLayout } from './test';

// Pattern Canvas - for Free Drawing
export class PCanvas {
    canvas = new Canvas();
    constructor(processing) {
        this.processing = processing;
        this.processing.background(0);
    }
    update() {};
    render(canopy) { this.canvas.render(canopy); }

}