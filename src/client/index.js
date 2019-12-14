
import * as THREE from 'three';
import { CanopyThreeJs } from './canopy';
import * as Menu from './menu';
import { patterns } from './state';


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

const FPS = 30;
animate();

function animate() {
    setTimeout(function() {
        requestAnimationFrame(animate);
        controls.update();
        canopy.clear();

        // Reverse the patterns so that the bottom one is rendered first
        patterns.slice().reverse().forEach((pattern) => {
            pattern.instance.progress();
            pattern.instance.render(canopy);
        });

        renderer.render(scene, camera);
    }, 1000 / FPS);
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

$(document).ready(() => Menu.initialize(canopy));
