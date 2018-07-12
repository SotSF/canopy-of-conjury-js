
import * as dat from 'dat.gui';
import canopy from './canopy';
import { RGB } from './colors';
import * as Patterns from './patterns';
import * as Brushes from './brushes';
import * as Menu from './menu';

const scene = new THREE.Scene();


// Lights
//const light1 = new THREE.DirectionalLight(0xffffff);
//const light2 = new THREE.DirectionalLight(0xffffff);
const ambientLight = new THREE.AmbientLight(0x777777);
//light1.position.set(0, 0,  1).normalize();
//light2.position.set(0, 0, -1).normalize();
//scene.add(light1);
//scene.add(light2);
scene.add(ambientLight);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);
camera.position.z = 11;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth - 300, window.innerHeight);
renderer.domElement.id = "idRenderer";
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
canopy.initialize(scene);

var brush; // active freedraw brush
var activeLayer;
var layers = []; // attempt #1, layers
var filter; // filter overlay
var processing;
var mapFromCanopyMemo = {};
window.onload = function () {  
    processing = new Processing(document.getElementById('idCanvas'), setupProcessing);
    (function(processing){
        const dimension = processing.height;
        let _mapFromCanopy = (s, l, numStrips) => {
            let theta = s * 2 * Math.PI / numStrips;
            let radius = l + 20;
            let x = radius * Math.cos(theta);
            let y = radius * Math.sin(theta);
            let x2 = processing.map(x,-dimension/2,dimension/2,0,dimension);
            let y2 = processing.map(y,-dimension/2,dimension/2,0,dimension);
            return {x: x2, y:y2};
        }
        canopy.strips.forEach((strip, s) => {
            strip.leds.forEach((led, l) => {
                mapFromCanopyMemo[s + "-" + l] = _mapFromCanopy(s, l, canopy.numStrips);
            });
        });
    })(processing);
}
const mapFromCanopy = (s, l) => { 
    return mapFromCanopyMemo[s + "-" + l];
 }

const setupProcessing = function(processing) {
    processing.setup = () => {
        processing.size(200,200);
        processing.pg = processing.createGraphics(200,200, "P2D");
        processing.pg.background(0);
    }
}
const clearCanopy = () => {
    for (let s in canopy.strips) {
        canopy.strips[s].updateColors(0x000000);
    }
}

animate();

function animate() {
    requestAnimationFrame( animate );
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    clearCanopy();
    for (let layer of Array.from(layers).reverse()) {
        layer.pattern.update();
        layer.pattern.render(canopy);
    }
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
const setActiveLayer = function(val) {
    activeLayer = layers[val];
}
$(document).ready(function () {
    Menu.initialize(updateLayers, setBrush, setActiveLayer);
    $(document).on('click', '#idRenderer', canopyClick);
});


var waitingOnTarget = false;
var doubleBrush;
function canopyClick( event ) 
{
    if (brush && activeLayer && activeLayer.pattern instanceof Patterns.PCanvas) {
        var pattern = activeLayer.pattern;
        var x = ((event.clientX - 300) / (window.innerWidth - 300) ) * 2 - 1;
        var y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        var vector = new THREE.Vector2( x, y );
        
        var ray = new THREE.Raycaster();
        ray.setFromCamera(vector, camera);
        // create an array containing all objects in the scene with which the ray intersects
        var intersects = ray.intersectObjects( canopy.ledHitBoxes );
        if ( intersects.length > 0 )
        {
            let i = canopy.ledHitBoxes.indexOf(intersects[0].object);
            let coord = mapFromCanopy(Math.floor(i / canopy.numLedsPerStrip),i % canopy.numLedsPerStrip,canopy.numStrips)

            if (waitingOnTarget) {
                waitingOnTarget = false;
                doubleBrush.target = coord;
                pattern.add(doubleBrush);
                return;    
            }

            switch (brush) {
                case "ring": 
                    pattern.add(new Brushes.RingBrush(Object.assign({}, Brushes.RingBrush.setParams), coord));
                    break;
                case "radial":
                    pattern.add(new Brushes.RadialBrush(Object.assign({}, Brushes.RadialBrush.setParams), coord));
                    break;
                case "line":
                    waitingOnTarget = true;
                    doubleBrush = new Brushes.LineBrush(Object.assign({}, Brushes.LineBrush.setParams), coord);
                    break;
            }
            
        }
    }
    
}
