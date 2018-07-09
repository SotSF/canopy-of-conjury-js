import { renderProcessing } from '../patterns'
export class SineRing {
    optionVals = {
        weight: 2,
        frequency: 1,
        amplitude: 20,
        radius: 20,
        growVelocity: 1
    }
    optionParams = {
        weight: {
            min: 1,
            max: 5
        },
        frequency: {
            min: 5,
            max: 20
        },
        amplitude: {
            min: 1,
            max: 100
        },
        radius: {
            min: 5,
            max: 80
        },
        growVelocity: {
            min: 0,
            max: 5
        }
    }
    constructor(processing, color1, color2) {
        this.processing = processing;
        this.color1 = color1;
        this.color2 = color2;
    }
    update() {
        let center = this.processing.width/2;
        let radius = this.optionVals.radius + 20;
        let angle = 0;
        let angleStep = 0.01;
        let color = this.color1.getValue();
        this.processing.pg.beginDraw();
        this.processing.pg.background(0);
        this.processing.pg.strokeWeight(this.optionVals.weight);
        this.processing.pg.stroke(color.r,color.g,color.b);
        
        while (angle <= Math.PI * 2) { 
            let x = center + (radius + (Math.sin(angle * this.optionVals.frequency) * this.optionVals.amplitude)) * Math.cos(angle);
            let y = center + (radius + (Math.sin(angle * this.optionVals.frequency) * this.optionVals.amplitude)) * Math.sin(angle);
            angle += angleStep;
            let dx = center + (radius + (Math.sin(angle * this.optionVals.frequency) * this.optionVals.amplitude)) * Math.cos(angle);
            let dy = center + (radius + (Math.sin(angle * this.optionVals.frequency) * this.optionVals.amplitude)) * Math.sin(angle);
            this.processing.pg.line(x,y,dx,dy);
        }
        this.processing.pg.endDraw();
        this.optionVals.amplitude += this.optionVals.growVelocity;
        if (this.optionVals.amplitude <= 10 || this.optionVals.amplitude >= 50) this.optionVals.growVelocity = -1 * this.optionVals.growVelocity;
        
    }

    render(canopy) {
        renderProcessing(canopy, this.processing);
    }
}