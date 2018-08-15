
import * as THREE from 'three';
import { CanopyThreeJs } from './canopy';
import config from '../config';
import * as Patterns from './patterns';
import * as Brushes from './brushes';
import * as Menu from './menu';
import Transmitter from './transmitter';


const transmitter = config.api_host ? new Transmitter(config.api_host) : null;
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);
camera.position.z = 11;

const renderer = new THREE.WebGLRenderer({ antialias: true });
const MENU_WIDTH = 240;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth - MENU_WIDTH, window.innerHeight);
renderer.domElement.id = "idRenderer";
document.getElementById('renderer-wrapper').appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
const canopy = new CanopyThreeJs;
canopy.initialize(scene);
var layers = [];

/**
 * Iterates over the canopy's strips, pulling the colors from the LEDs in order to transmit them to
 * the API.
 *
 * TODO: The ordering of the colors matters, as it needs to comply with the ordering the LED driver
 * (e.g. the Pixel Pusher) expects. This is not currently taken into consideration.
 */
const transmit = () => {
    if (!transmitter) return;

    const colors = [];
    canopy.strips.forEach((strip) => {
        strip.colors.forEach((color, i) => {
            if (i < 0 || i >= canopy.numLedsPerStrip) { return; }
            const { r, g, b } = color;
            colors.push(r, g, b);
        });
    });

    transmitter.render(colors);
};

animate();

function animate() {
    setTimeout( function() {

        requestAnimationFrame( animate );
        controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
        canopy.clear();
        for (let layer of Array.from(layers).reverse()) {
            layer.pattern.progress();
            layer.pattern.render(canopy);
        }

        transmit();
        renderer.render(scene, camera);

    }, 1000 / 30 );
  
}

window.onkeydown = e => {
    switch (e.key) {
        case 'ArrowUp':
            canopy.adjustHeight(1);
            break;
        case 'ArrowDown':
            canopy.adjustHeight(-1);
            break;
    }
};

const addLayer = function(pattern, displayName) {
    layers.push({
        pattern: pattern,
        name: displayName
    });
}

const setBrush = function(val) {
    brush = val;
}
const updateLayers = function(val) {
    layers = val;
}
$(document).ready(function () {
    Menu.initialize(updateLayers, setBrush, canopy);
});