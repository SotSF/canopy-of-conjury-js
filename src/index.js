
import * as dat from 'dat.gui';
import canopy from './canopy';
import { RGB } from './colors';


const scene = new THREE.Scene();

// Lights
const light1 = new THREE.DirectionalLight(0xffffff);
const light2 = new THREE.DirectionalLight(0xffffff);
const ambientLight = new THREE.AmbientLight(0x777777);
light1.position.set(0, 0,  1).normalize();
light2.position.set(0, 0, -1).normalize();
scene.add(light1);
scene.add(light2);
scene.add(ambientLight);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);
camera.position.z = 11;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
canopy.initialize(scene);

animate();

function animate() {
    requestAnimationFrame( animate );
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    renderer.render(scene, camera);
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

const params = {
    red: 255,
    green: 0,
    blue: 0
};

const updateColors = () => {
    canopy.strips.forEach((strip) => {
        strip.updateColors(new RGB(params.red, params.green, params.blue).toHex());
    });
};

const gui = new dat.GUI({ width: 300 });
const colorFolder = gui.addFolder('Color');
colorFolder.add(params, 'red', 0, 255 ).step(1).onChange(updateColors);
colorFolder.add(params, 'green', 0, 255 ).step(1).onChange(updateColors);
colorFolder.add(params, 'blue', 0, 255 ).step(1).onChange(updateColors);
colorFolder.open();


