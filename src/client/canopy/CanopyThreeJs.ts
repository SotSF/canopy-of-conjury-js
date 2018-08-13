
import * as THREE from 'three';
import * as _ from 'lodash';
import { NUM_STRIPS, NUM_LEDS_PER_STRIP } from '../../canopy';
import { BLACK } from '../../colors';
import { PCanvas } from '../../patterns';
import { CanopyInterface, StripInterface } from '../../types';
import * as util from '../../util';
import Catenary from './catenary';

// Constants. Length units are in feet unless otherwise specified
const BASE_RADIUS = 8;
const APEX_RADIUS = 0.5;

/**
 * Contains much of the state of the physical canopy, including the height of the apex, the catenary
 * coordinates, and the colors of the LEDs.
 */
export default class CanopyThreeJs implements CanopyInterface {
    apexHeight = 0; // Height above the base
    apexRadius = APEX_RADIUS;
    baseRadius = BASE_RADIUS;
    numLedsPerStrip = NUM_LEDS_PER_STRIP;
    numStrips = NUM_STRIPS;
    ledParticles = [];
    ledHitBoxes = []; // hit boxes for click interaction

    // Set up during scene initialization
    apex = null;
    base = null;
    catenary = null;
    strips = null;

    get stripLength () {
        return this.strips[0].length;
    }

    /**
     * Initializes the components of the canopy. This includes
     *   - the base
     *   - the apex
     *   - the LED strings
     *   - the LEDs themselves
     */
    initialize (scene) {
        this.catenary = new Catenary(this);

        this._initializeBase();
        this._initializeApex();
        this._initializeStrips();

        // Create a group so all the canopy components are relatively positioned
        const group = new THREE.Group();
        const ledGroups = _.map(this.strips, 'group');

        group.add(...ledGroups);
        scene.add(group);
    }

    _initializeBase () {
        const material = new THREE.MeshLambertMaterial({ color: 0x555555, side: THREE.DoubleSide });
        const baseGeometry = new THREE.TorusGeometry(BASE_RADIUS, 0.25, 4, 75);
        this.base = new THREE.Mesh(baseGeometry, material);
    }

    _initializeApex () {
        const material = new THREE.MeshLambertMaterial({ color: 0x555555, side: THREE.DoubleSide });
        const apexGeometry = new THREE.CylinderGeometry(APEX_RADIUS, APEX_RADIUS, 0.25, 30, 1);
        this.apex = new THREE.Mesh(apexGeometry, material);
        this.apex.rotateX(Math.PI / 2);
    }

    _initializeStrips () {
        const strips = [];
        const radialInterval = Math.PI * 2 / NUM_STRIPS;

        for (let i = 0; i < NUM_STRIPS; i++) {
            const s = new LedStrip(i * radialInterval, this.catenary);
            this.ledHitBoxes.push(s.particleSystem);
            strips.push(s);
        }

        this.strips = strips;
    }

    /** Clears all the LEDs */
    clear () {
        this.strips.forEach(strip => strip.updateColors(BLACK));
    }

    /**
     * Moves the apex up `delta` units.
     * @param delta
     */
    adjustHeight (delta) {
        this.apex.position.z -= delta;
        this.catenary.update();
        this.strips.forEach(strip => strip.updatePositions());
    }
}


/**
 * Contains the state of an LED strip, including the strip's offset, its catenary coordinates and
 * the colors of the LEDs within it
 */
class LedStrip implements StripInterface {
    // The color of the string, NOT the LEDs
    color = 0xcccccc;

    catenary = null;
    colors = null;
    group = null;
    leds = null;
    ledHitBoxes = null;
    offset = null;
    particleSystem = null;
    string = null;

    constructor (offset, catenary) {
        this.offset = offset;
        this.catenary = catenary;

        this._initializeString();
        this._initializeLeds();
        this.updatePositions();

        const particleSystemGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array( NUM_LEDS_PER_STRIP * 3 );
        const colors = new Float32Array( NUM_LEDS_PER_STRIP * 3 );

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
        group.add(this.string, this.particleSystem);

        // Rotate the group according to the offset
        group.rotateZ(offset);
        this.group = group;
    }

    get length () {
        return this.leds.length;
    }

    _initializeString () {
        const geometry = new THREE.BufferGeometry();
        const lineMaterial = new THREE.LineBasicMaterial({ color : this.color });

        // Create the final object to add to the scene
        this.string = new THREE.Line(geometry, lineMaterial);
    }

    _initializeLeds () {
        this.leds = this.catenary.coordinates.map(() => new THREE.Vector3(0, 0, 0));
        this.colors = this.catenary.coordinates.map(() => 0x000000);
    }

    /** Updates the positions of the LEDs and the string */
    updatePositions () {
        // LEDs
        for (let i = 0; i < this.leds.length; i++) {
            const led = this.leds[i];
            const [x, z] = this.catenary.coordinates[i];
            [led.x, led.z] = [x,-z];
        }

        // String
        const curve = new THREE.CatmullRomCurve3(
            this.catenary.coordinates.map(([x, z]) => new THREE.Vector3(x, 0, -z))
        );

        const points = curve.getPoints(NUM_LEDS_PER_STRIP);
        this.string.geometry.setFromPoints(points);
    }

    /** Updates the color of a single pixel in the string 
     * color as RGB
    */

    updateColor (i, newColor) {
        const { color } = this.particleSystem.geometry.attributes;
        this.colors[i] = { 
            r: util.lerp(color.array[i*3] * 255, newColor.r, newColor.a),
            g: util.lerp(color.array[i*3 + 1] * 255, newColor.g, newColor.a),
            b: util.lerp(color.array[i*3 + 2] * 255, newColor.b, newColor.a)
        };

        // expects a float between 0.0 and 1.0
        color.array[i * 3] = this.colors[i].r / 255;
        color.array[i * 3 + 1] = this.colors[i].g / 255;
        color.array[i * 3 + 2] = this.colors[i].b / 255;
        color.needsUpdate = true;
        
    }

    /** Shorthand for updating the color of the entire strip 
     * color as RGB
    */
    updateColors (newColor) {
        _.range(this.leds.length).forEach(i => this.updateColor(i, newColor));
    }
}
