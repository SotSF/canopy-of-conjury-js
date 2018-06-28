
import * as dat from 'dat.gui';
import canopy from './canopy';
import { RGB } from './colors';
import * as Patterns from './patterns';
import * as Brushes from './brushes/brushes';


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

var pattern; // base pattern
var filter; // filter overlay
var processing;
window.onload = function () {  processing = new Processing(document.getElementById('idCanvas'), setupProcessing);}
const setupProcessing = function(processing) {
    processing.setup = () => {
        processing.size(500,500);
        processing.background(0);
    }
}
var drawMode = new Brushes.RingBrush(5); // default brush
animate();

function animate() {
    requestAnimationFrame( animate );
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    if (pattern) {
        pattern.update();
        pattern.render(canopy);
    }
    if (filter) {
        filter.update();
        filter.render(canopy);
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

const gui = new dat.GUI({ width: 300 });

const patternsFolder = gui.addFolder('Patterns');
const patterns = {
    testLEDs: () => { setPattern(new Patterns.TestLEDs()); },
    testCanvas: () => { setPattern(new Patterns.TestCanvas(processing)); },
    gradientPulse: () => { setPattern(new Patterns.GradientPulse()); },
    stop: () => { 
        setPattern(null);
        for (let s in canopy.strips) {
            canopy.strips[s].updateColors('0x000000');
        }
    }
}

const setPattern = function(p) {
    pattern = p;
}


for (var name in patterns) {
    patternsFolder.add(patterns, name);
}

/*const filtersFolder = gui.addFolder('Filters');
const filters = {

}
for (var name in filters) {
    filtersFolder.add(filters, name);
}
*/


var isFreeDrawOn = false;
const toggleFreeDraw = () => {
    isFreeDrawOn = freeDrawMode.getValue();
    if (isFreeDrawOn) {
        setPattern(new Patterns.PCanvas(processing));
    }

}

const freeDrawFolder = gui.addFolder('Free Draw');
const freeDrawMode = freeDrawFolder.add({freeDrawOn: false}, 'freeDrawOn').onChange(toggleFreeDraw);
const mainColor = freeDrawFolder.addColor({mainColor: new RGB(0,0,255) }, 'mainColor');
const subColor = freeDrawFolder.addColor({subColor: new RGB(255,255,255)}, 'subColor');
const brushSize = freeDrawFolder.add({brushSize: 5}, 'brushSize', 1, 10);
brushSize.onChange(() => { drawMode.brushSize = brushSize.getValue(); });

const brushes = {
    ringDrop: () => drawMode = new Brushes.RingBrush(brushSize.getValue()),
    radiate: () => drawMode = new Brushes.RadialBrush(brushSize.getValue())
}
let brushNames = [];
for (var brush in brushes) {
    brushNames.push(brush);
}
const currentBrush = freeDrawFolder.add({currentBrush: brushNames[0]}, 'currentBrush', brushNames);
currentBrush.onChange(function() { brushes[currentBrush.getValue()](); });

function onDocumentMouseDown( event ) 
{
    if (isFreeDrawOn) {
        // the following line would stop any other event handler from firing
        // (such as the mouse's TrackballControls)
        // event.preventDefault();
        
        // update the mouse variable
        var x = ( event.clientX / window.innerWidth ) * 2 - 1;
        var y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        
        // find intersections
        // create a Ray with origin at the mouse position
        //   and direction into the scene (camera direction)
        var vector = new THREE.Vector3( x, y, 1 );
        vector.unproject(camera);
        var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
        // create an array containing all objects in the scene with which the ray intersects
        var intersects = ray.intersectObjects( canopy.ledHitBoxes );
        // if there is one (or more) intersections
        if ( intersects.length > 0 )
        {
            if (drawMode) { 
                let i = canopy.ledHitBoxes.indexOf(intersects[0].object);
                let coord = mapFromCanopy(Math.ceil(i / canopy.numLedsPerStrip),i % canopy.numLedsPerStrip,canopy.numStrips)
                drawMode.click(processing,coord); 
            }
        }
    }
    
}

document.addEventListener( 'click', onDocumentMouseDown, false );

function mapFromCanopy(s, l, numStrips) {
    const dimension = processing.height;
    let theta = s * 360 / numStrips;
    let radius = l * 3;
    let x = radius * Math.cos(theta);
    let y = radius * Math.sin(theta);
    let x2 = processing.map(x,-dimension/2,dimension/2,0,dimension);
    let y2 = processing.map(y,-dimension/2,dimension/2,0,dimension);
    return {x: x2, y:y2};
}