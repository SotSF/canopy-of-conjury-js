
import * as THREE from 'three';
import * as _ from 'lodash';
import Catenary from './catenary';
import { CanopyInterface, StripInterface } from '../types';
import { NUM_STRIPS, NUM_LEDS_PER_STRIP} from './constants';

// Constants. Length units are in feet unless otherwise specified
const FEET_PER_METER = 3.28084;
const BASE_RADIUS = 8;
const APEX_RADIUS = 0.5;
const STRIP_LENGTH_METERS = 2.5;
const STRIP_LENGTH = STRIP_LENGTH_METERS * FEET_PER_METER;
const COLOR_MEMO = {};

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
    stripLength = STRIP_LENGTH;
    ledParticles = [];
    ledHitBoxes = []; // hit boxes for click interaction

    // Set up during scene initialization
    apex = null;
    base = null;
    catenary = null;
    strips = null;

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

        group.add(this.base, this.apex, ...ledGroups);
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
            var s = new LedStrip(i * radialInterval, this.catenary);
            this.ledHitBoxes = this.ledHitBoxes.concat(s.ledHitBoxes);
            this.ledParticles = this.ledParticles.concat(s.leds);
            strips.push(s);
        }

        this.strips = strips;
    }

    /** Clears all the LEDs */
    clear () {
        this.strips.forEach(strip => strip.updateColors(0x000000));
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
    // Invariant geometry used for all LEDs
    static boxGeometry = new THREE.BoxGeometry( 0.05,0.05,0.05);

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


        const particleSystemGeometry = new THREE.Geometry();
        this.leds.forEach(function(val) {
            particleSystemGeometry.vertices.push(val);
        });

        const particleSystemMat = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: THREE.VertexColors
        });

        this.particleSystem = new THREE.Points(
            particleSystemGeometry,
            particleSystemMat
        );

        // Create a group so all the strip's components are relatively positioned
        const group = new THREE.Group();
        group.add(this.string, this.particleSystem, ...this.ledHitBoxes);

        // Rotate the group according to the offset
        group.rotateZ(offset);
        this.group = group;
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

        this.ledHitBoxes = this.catenary.coordinates.map((coordinate) => {
            const [x, y] = coordinate;
            let factor = Math.sqrt(x ** 2 + y ** 2);
            if (factor < 1.5) factor = 1.5;

            return new THREE.Mesh(
                new THREE.BoxGeometry( 0.08, 0.07 * factor, 0.07 * factor),
                new THREE.MeshBasicMaterial({ opacity: 0, transparent: true })
            );
        });
    }

    /** Updates the positions of the LEDs and the string */
    updatePositions () {
        // LEDs
        for (let i = 0; i < this.leds.length; i++) {
            const led = this.leds[i];
            const [x, z] = this.catenary.coordinates[i];
            [led.x, led.z] = [x,-z];
            this.ledHitBoxes[i].position.set(x, 0, -z);
        }

        // String
        const curve = new THREE.CatmullRomCurve3(
            this.catenary.coordinates.map(([x, z]) => new THREE.Vector3(x, 0, -z))
        );

        const points = curve.getPoints(NUM_LEDS_PER_STRIP);
        this.string.geometry.setFromPoints(points);
    }

    /** Updates the color of a single pixel in the string */
    updateColor (i, color) {
        this.colors[i] = color;
        if (!COLOR_MEMO[color]) { COLOR_MEMO[color] = new THREE.Color(color); }
        this.particleSystem.geometry.colors[i] = COLOR_MEMO[color];
        this.particleSystem.geometry.colorsNeedUpdate = true;
    }

    /** Shorthand for updating the color of the entire strip */
    updateColors (color) {
        _.range(this.leds.length).forEach(i => this.updateColor(i, color));
    }
}
