import _ from 'lodash';
import { NUM_STRIPS, NUM_LEDS_PER_STRIP } from '../canopy';
import { modifyBrightness } from '../colors';

export class ShootingStars {
    static menuParams = [
        { name: "FromApex", defaultVal: true },
        { name: "Velocity", defaultVal: 2, min: 0, max: 5 },
        { name: "Color", defaultVal: "#ffffff" },
        { name: "Brightness", defaultVal: 100, min: 0, max: 100}
    ]
    static displayName = 'Shooting Stars';
    constructor(params) {
        this.params = params;

        this.stars = [];
        for(let i = 0; i < 5; i++) {
            this.stars.push([parseInt(Math.random() * NUM_STRIPS), this.params.FromApex ? 0 : NUM_LEDS_PER_STRIP - 1]);
        }
    }
    update() {
        let i = parseInt(Math.random() * 10);
        for(;i>=0;i--) {
            this.stars.push([parseInt(Math.random() * NUM_STRIPS), this.params.FromApex ? 0 : NUM_LEDS_PER_STRIP - 1]);
        }
        
        this.stars.forEach(star => {
            star[1] += this.params.FromApex ? this.params.Velocity : -this.params.Velocity;
            if (star[1] >= NUM_LEDS_PER_STRIP || star[1] < 0) { this.stars = _.without(this.stars, star); }
        });
    }
    render(canopy) {
        const color = modifyBrightness(this.params.Brightness, this.params.Color);
        this.stars.forEach(star => {
            canopy.strips[star[0]].updateColor(star[1], color);
        });
    }
}