
import _ from 'lodash';
import catenary from './catenary';
import { BLACK } from './colors';
import { PCanvas } from './patterns';

// Constants. Length units are in feet unless otherwise specified
const FEET_PER_METER = 3.28084;
const TOTAL_LEDS = 7200;
const BASE_RADIUS = 8;
const APEX_RADIUS = 0.5;
const STRIP_LENGTH_METERS = 2.5;
const STRIP_LENGTH = STRIP_LENGTH_METERS * FEET_PER_METER;
export const NUM_STRIPS = 96;
export const NUM_LEDS_PER_STRIP = TOTAL_LEDS / NUM_STRIPS;

/**
 * Singleton class. Contains much of the state of the physical canopy, including the height of the
 * apex, the catenary coordinates, and the colors of the LEDs.
 */
class Canopy {
    apexHeight = 0; // Height above the base
    apexRadius = APEX_RADIUS;
    baseRadius = BASE_RADIUS;
    numLedsPerStrip = NUM_LEDS_PER_STRIP;
    numStrips = NUM_STRIPS;
    stripLength = STRIP_LENGTH;

    ledParticles = [];
    ledHitBoxes = []; // hit boxes for click interaction
    /**
     * Initializes the components of the canopy. This includes
     *   - the base
     *   - the apex
     *   - the LED strings
     *   - the LEDs themselves
     */
    initialize (scene) {
        this._initializeBase();
        this._initializeApex();

        catenary.initialize();
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
            var s = new LedStrip(i * radialInterval);
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
        catenary.update();
        this.strips.forEach(strip => strip.updatePositions());
    }
}


/**
 * Contains the state of an LED strip, including the strip's offset, its catenary coordinates and
 * the colors of the LEDs within it
 */
class LedStrip {
    // The color of the string, NOT the LEDs
    color = 0xcccccc;

    constructor (offset) {
        this.offset = offset;

        this._initializeString();
        this._initializeLeds();
        this.updatePositions();

        // Create a group so all the strip's components are relatively positioned
        const group = new THREE.Group();
    
        var particleSystemGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array( NUM_LEDS_PER_STRIP*3 );
        const colors = new Float32Array( NUM_LEDS_PER_STRIP*3 );
        this.leds.forEach((led, i) => {
            positions[i * 3] = led.x;
            positions[i * 3 + 1] = led.y;
            positions[i * 3 + 2] = led.z;

            colors[i * 3] = 0;
            colors[i * 3 + 1] = 0;
            colors[i * 3 + 2] = 0;
        })
        
        particleSystemGeometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        particleSystemGeometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
        
        
        var particleSystemMat = new THREE.PointsMaterial({
            size: 0.1,
            opacity: 1,
            vertexColors: THREE.VertexColors
          });
        this.particleSystem = new THREE.Points(
            particleSystemGeometry,
            particleSystemMat
        );
        group.add(this.string, this.particleSystem);
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
        this.leds = catenary.coordinates.map(() => new THREE.Vector3(0,0,0));

        for (let i = 0; i < catenary.coordinates.length; i++) {
            let factor = Math.sqrt(catenary.coordinates[i][0] * catenary.coordinates[i][0] + catenary.coordinates[i][1] * catenary.coordinates[i][1]);
            if (factor < 1.5) factor = 1.5;
        }
        this.colors = catenary.coordinates.map(() => 0x000000);
    }

    /** Updates the positions of the LEDs and the string */
    updatePositions () {
        // LEDs
        for (let i = 0; i < this.leds.length; i++) {
            const led = this.leds[i];
            const [x, z] = catenary.coordinates[i];
            [led.x, led.z] = [x,-z];
        }

        // String
        const curve = new THREE.CatmullRomCurve3(
            catenary.coordinates.map(([x, z]) => new THREE.Vector3(x, 0, -z))
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
            r: PCanvas.lerp(color.array[i*3] * 255, newColor.r, newColor.a),
            g: PCanvas.lerp(color.array[i*3 + 1] * 255, newColor.g, newColor.a),
            b: PCanvas.lerp(color.array[i*3 + 2] * 255, newColor.b, newColor.a)
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

export default new Canopy;

function _mapToCanopy(x,y) {
    let theta = 0;
    if (x == 0) {
        if (y > 0) theta = Math.PI / 2;
        if (y < 0) theta = -Math.PI / 2;
        if (y == 0) theta = 0;
    } else {
        theta = Math.atan2(y,x);
    }
    const radius = Math.sqrt(x * x + y * y) * 3;
    let thetaDegrees = theta * 180 / Math.PI;
    if (thetaDegrees < 0) { thetaDegrees += 360; }
    const s = parseInt(thetaDegrees * NUM_STRIPS / 360);
    const l = parseInt(radius / 1.5);
    return { strip: s, led: l};
}

(function(){
    for(let x = -PCanvas.dimension/2;x <= PCanvas.dimension/2;x++) {
        for(let y = -PCanvas.dimension/2;y <= PCanvas.dimension/2;y++) {
            PCanvas.mapMemo[x + "-" + y] = _mapToCanopy(x,y);
        }
    }
})();