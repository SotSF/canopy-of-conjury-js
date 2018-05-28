
import * as THREE from 'three';
import './lib/orbit_controls';

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
camera.position.y = 30;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

const material = new THREE.MeshLambertMaterial({ color: 0x555555, side: THREE.DoubleSide });
const baseGeometry = new THREE.TorusGeometry(20, 0.25, 5, 100);
const baseMesh = new THREE.Mesh(baseGeometry, material);
const apexGeometry = new THREE.CylinderGeometry(2, 2, 0.25, 30, 1);
const apexMesh = new THREE.Mesh(apexGeometry, material);
apexMesh.rotateX(Math.PI / 2);

const group = new THREE.Group();
group.add(baseMesh);
group.add(apexMesh);
scene.add(group);

animate();

function animate() {
    requestAnimationFrame( animate );
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    renderer.render( scene, camera );
}

window.onkeydown = e => {
    switch (e.key) {
        case 'ArrowUp':
            apexMesh.position.z -= 1;
            break;
        case 'ArrowDown':
            apexMesh.position.z += 1;
            break;
    }
};
