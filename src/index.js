
import * as dat from 'dat.gui';
import canopy from './canopy';
import { RGB } from './colors';
import * as Patterns from './patterns';
import * as Brushes from './brushes';
import { Canvas } from './patterns/canvas';


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
renderer.setSize(window.innerWidth - 300, window.innerHeight);
renderer.domElement.id = "idRenderer";
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
canopy.initialize(scene);

var brush; // active freedraw brush
var layers = []; // attempt #1, layers
var filter; // filter overlay
var processing;
window.onload = function () {  
    processing = new Processing(document.getElementById('idCanvas'), setupProcessing);
    renderGUI();
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
        canopy.strips[s].updateColors('0x000000');
    }
}

animate();

function animate() {
    
    requestAnimationFrame( animate );
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    clearCanopy();
    layers.forEach((layer, i) => {
        layer.pattern.update();
        layer.pattern.render(canopy);
    });
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

function renderGUI() {
    let t = $('#idGuiTemplate').html();
    let r = Mustache.render(t, {
        patterns: patterns,
        brushes: brushes,
        layers: layers
    });
    $('#idControls').html(r);
}

const patterns = ["CLEAR LEDS", "Test LEDs", "Test Canvas", "Gradient Pulse"];
const addLayer = function(pattern, displayName) {
    layers.push({
        pattern: pattern,
        name: displayName
    });
    renderGUI();
}

const brushes = ["Ring", "Radial", "Line"];
$(document).ready(function () {
    $(document)
        .on('click', '.pattern', function () {
            let i = patterns.indexOf($(this).val());
            switch (i) {
                case 0:
                    layers = [];
                    clearCanopy();
                    processing.pg.background(0);
                    renderGUI();
                    break;
                case 1:
                    addLayer(new Patterns.TestLEDs(), $(this).val()); break;
                case 2:
                    addLayer(new Patterns.TestCanvas(processing), $(this).val()); break;
                case 3:
                    addLayer(new Patterns.GradientPulse(), $(this).val()); break;
            }
        })
        .on('click', '.brush', function () {
             let i = brushes.indexOf($(this).val());
             $('.brush').removeClass('active');
             $(this).addClass('active');
             brush = brushes[i];
        })
        .on('click', '.layer > .layer-select', function () {
            let layerItem = $(this).closest('.layer');
            let i = $('.layer').index(layerItem);
            $('.layer').removeClass('active');
            layerItem.addClass('active');
            //setOptions();

        })
        .on('click', '.layer > .layer-kill', function () {
            let i = $('.layer').index($(this).closest('.layer'));
            layers.splice(i,1);
            if (layers.length == 0) { clearCanopy(); processing.pg.background(0); }
            renderGUI();
        })
        .on('click', '.layer > .layer-up', function () {
            let i = $('.layer').index($(this).closest('.layer'));
            if (i == 0) return;
            [layers[i - 1], layers[i]] = [layers[i], layers[i-1]];
            renderGUI();
        })
        .on('click', '.layer > .layer-down', function () {
            let i = $('.layer').index($(this).closest('.layer'));
            if (i == layers.length - 1) return;
            [layers[i], layers[i+1]] = [layers[i+1], layers[i]];
            renderGUI();
        });
});


const gui = new dat.GUI({ width: 300 });

const freeDrawFolder = gui.addFolder('Free Draw');
const mainColor = freeDrawFolder.addColor({mainColor: new RGB(0,0,255) }, 'mainColor');
const subColor = freeDrawFolder.addColor({subColor: new RGB(255,255,255)}, 'subColor');
const brushSize = freeDrawFolder.add({brushSize: 5}, 'brushSize', 1, 10);
freeDrawFolder.open();

var activeLayerOptions = gui.addFolder('Layer Tuning');

var waitingOnTarget = false;
var doubleBrush;
function onDocumentMouseDown( event ) 
{
    if (brush) {
        var pLayer = layers.find(p => p.name == "Drawing Canvas");
        if (pLayer == null) {
            addLayer(new Patterns.PCanvas(processing), "Drawing Canvas");
            pLayer = layers[layers.length - 1];
        }
        var pattern = pLayer.pattern;
        var x = ((event.clientX - 150) / window.innerWidth ) * 2 - 1;
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

            if (waitingOnTarget) {
                waitingOnTarget = false;
                doubleBrush.target = coord;
                pattern.add(doubleBrush);
                return;    
            }

            switch (brush) {
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