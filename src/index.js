
import * as dat from 'dat.gui';
import canopy from './canopy';
import { RGB } from './colors';
import * as Patterns from './patterns';
import * as Brushes from './brushes';
import { Canvas } from './canvas';


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
        processing.size(200,200);
        processing.background(0);
    }
}

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
    testCanvas: () => { setPattern(new Patterns.TestCanvasLayout(processing)); },
    gradientPulse: () => { setPattern(new Patterns.GradientPulse()); },
    stop: () => { 
        setPattern(null);
        for (let s in canopy.strips) {
            canopy.strips[s].updateColors('0x000000');
        }
        processing.background(0);
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

const brushes = [
    "Ring",
    "Radial",
    "Double Click"
]
const currentBrush = freeDrawFolder.add({currentBrush: brushes[0]}, 'currentBrush', brushes);

var waitingOnTarget = false;
var doubleBrush;
function onDocumentMouseDown( event ) 
{
    if (isFreeDrawOn) {
        var x = ( event.clientX / window.innerWidth ) * 2 - 1;
        var y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        var vector = new THREE.Vector2( x, y );
        
        var ray = new THREE.Raycaster();
        ray.setFromCamera(vector, camera);
        // create an array containing all objects in the scene with which the ray intersects
        var intersects = ray.intersectObjects( canopy.ledHitBoxes );
        if ( intersects.length > 0 )
        {
            let i = canopy.ledHitBoxes.indexOf(intersects[0].object);
            console.log(i);
            let coord = mapFromCanopy(Math.floor(i / canopy.numLedsPerStrip),i % canopy.numLedsPerStrip,canopy.numStrips)

            if (waitingOnDouble) {
                waitingOnDouble = false;
                doubleBrush.target = coord;
                pattern.add(doubleBrush);
                return;    
            }

            switch (currentBrush.getValue()) {
                case "Ring": 
                    pattern.add(new Brushes.RingBrush(brushSize.getValue(), mainColor.getValue(), subColor.getValue(), coord));
                    break;
                case "Radial":
                    pattern.add(new Brushes.RadialBrush(brushSize.getValue(), mainColor.getValue(), subColor.getValue(), coord));
                    break;
                case "Line":
                    waitingOnTarget = true;
                    doubleBrush = new Brushes.LineBrush(brushSize.getValue(), mainColor.getValue(), subColor.getValue(), coord);
                    break;
            }
            
        }
    }
    
}

document.getElementsByTagName('canvas')[1].addEventListener( 'click', onDocumentMouseDown, false );

function mapFromCanopy(s, l, numStrips) {
    console.log(s,l);
    const dimension = processing.height;
    let theta = s * 2 * Math.PI / numStrips;
    let radius = l + 20;
    let x = radius * Math.cos(theta);
    let y = radius * Math.sin(theta);
    let x2 = processing.map(x,-dimension/2,dimension/2,0,dimension);
    let y2 = processing.map(y,-dimension/2,dimension/2,0,dimension);
    console.log(x2,y2);
    return {x: x2, y:y2};
}