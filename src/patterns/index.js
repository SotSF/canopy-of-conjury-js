import { Canvas } from '../canvas';

export { GradientPulse } from './gradient_pulse';
export { TestLEDs, TestCanvas, TestCanvasLayout } from './test';

// Pattern Canvas - for Free Drawing
export class PCanvas {
    canvas = new Canvas();
    constructor(processing) {
        this.processing = processing;
        this.processing.background(0);
        this.brushes = [];
    }
    update() {
        this.processing.background(0);
        for (let i = this.brushes.length - 1; i >= 0; i--) {
            this.brushes[i].render(this.processing);
            this.brushes[i].timer += 1;
            if (this.brushes[i].timer >= 60) { this.brushes.splice(i, 1); }
        }
    };
    render(canopy) { this.canvas.render(canopy); }

    add(brush) {
        brush.timer = 0;
        this.brushes.push(brush);
    }
}