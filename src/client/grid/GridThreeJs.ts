
import * as THREE from 'three';
import * as _ from 'lodash';
import { NUM_ROWS, NUM_COLS } from '../../grid';
import { Color, combine } from '../../colors';
import { GridInterface, StripInterface } from '../../types';

/**
 * Contains much of the state of the physical canopy, including the colors of the LEDs.
 */
export default class GridThreeJs implements GridInterface {
    ledParticles = [];
    ledHitBoxes = []; // hit boxes for click interaction
    numCols = NUM_COLS;
    numRows = NUM_ROWS;

    // Set up during scene initialization
    strips = null;

    get stripLength () {
        return this.strips[0].length;
    }

    /** Initializes the LEDS */
    initialize (scene) {
        this._initializeStrips();

        // Create a group so all the canopy components are relatively positioned
        const group = new THREE.Group();
        const ledGroups = _.map(this.strips, 'group');
        group.add(...ledGroups);

        // Shift the grid so the camera focuses at its origin
        group.translateX(-NUM_COLS / 2);
        group.translateY(-NUM_ROWS / 2);
        scene.add(group);
    }

    _initializeStrips () {
        const strips = [];

        for (let i = 0; i < NUM_COLS; i++) {
            const s = new LedStrip(i);
            this.ledHitBoxes.push(s.particleSystem);
            strips.push(s);
        }

        this.strips = strips;
    }

    /** Clears all the LEDs */
    clear () {
        this.strips.forEach(strip => strip.clear());
    }
}


/**
 * Contains the state of an LED strip, including the strip's row number and
 * the colors of the LEDs within it
 */
class LedStrip implements StripInterface {
    colors = null;
    group = null;
    leds = null;
    rowNum = null;
    particleSystem = null;

    constructor (rowNum) {
        this.rowNum = rowNum;

        this._initializeLeds();
        this.updatePositions();

        const particleSystemGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array( NUM_ROWS * 3 );
        const colors = new Float32Array( NUM_ROWS * 3 );

        this.leds.forEach((led, i) => {
            const indexStart = i * 3;
            positions[indexStart] = led.x;
            positions[indexStart + 1] = led.y;
            positions[indexStart + 2] = led.z;

            colors[indexStart] = 0;
            colors[indexStart + 1] = 0;
            colors[indexStart + 2] = 0;
        });
        
        particleSystemGeometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        particleSystemGeometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

        const particleSystemMat = new THREE.PointsMaterial({
            size: 0.1,
            opacity: 1,
            vertexColors: THREE.VertexColors
        });

        this.particleSystem = new THREE.Points(
            particleSystemGeometry,
            particleSystemMat
        );

        // Create a group so all the strip's components are relatively positioned
        const group = new THREE.Group();
        group.add(this.particleSystem);

        // Rotate the group according to the offset
        group.translateX(rowNum);
        this.group = group;
    }

    get length () {
        return this.leds.length;
    }

    _initializeLeds () {
        this.leds = _.range(NUM_ROWS).map(() => new THREE.Vector3(0, 0, 0));
        this.colors = _.range(NUM_ROWS).map(() => []);
    }

    clear () {
        this.colors = _.range(NUM_ROWS).map(() => []);
        _.range(this.leds.length).forEach(i => this.renderPixel(i));
    }

    renderPixel (i) {
        const { color } = this.particleSystem.geometry.attributes;
        const combined = combine(this.colors[i]);

        color.array[i * 3]     = combined.r / 255;
        color.array[i * 3 + 1] = combined.g / 255;
        color.array[i * 3 + 2] = combined.b / 255;
        color.needsUpdate = true;
    }

    /** Updates the positions of the LEDs */
    updatePositions () {
        for (let i = 0; i < this.leds.length; i++) {
            const led = this.leds[i];
            led.y = i;
            led.z = 0;
        }
    }

    /** Updates the color of a single pixel */
    updateColor (i, newColor: Color) {
        this.colors[i].push(newColor.toRgb());
        this.renderPixel(i);
    }

    /** Shorthand for updating the color of the entire strip */
    updateColors (newColor) {
        _.range(this.leds.length).forEach(i => this.updateColor(i, newColor));
    }
}
