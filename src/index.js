
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
//const ambientLight = new THREE.AmbientLight(0x777777);
//light1.position.set(0, 0,  1).normalize();
//light2.position.set(0, 0, -1).normalize();
//scene.add(light1);
//scene.add(light2);
//scene.add(ambientLight);

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
var mapFromCanopyMemo = {};
window.onload = function () {  
    (function(){
        const dimension = 200;
        let _mapFromCanopy = (s, l, numStrips) => {
            let theta = s * 2 * Math.PI / numStrips;
            let radius = l + 20;
            let x = radius * Math.cos(theta) + 100;
            let y = radius * Math.sin(theta) + 100;
            return {x,y};
        }
        canopy.strips.forEach((strip, s) => {
            strip.leds.forEach((led, l) => {
                mapFromCanopyMemo[s + "-" + l] = _mapFromCanopy(s, l, canopy.numStrips);
            });
        });
    })();
}
const mapFromCanopy = (s, l) => { 
    return mapFromCanopyMemo[s + "-" + l];
 }

const clearCanopy = () => {
    for (let s in canopy.strips) {
        canopy.strips[s].updateColors("#000000");
    }
}

animate();

function animate() {
    setTimeout( function() {

        requestAnimationFrame( animate );
        controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
        clearCanopy();
        for (let layer of Array.from(layers).reverse()) {
            layer.pattern.update();
            layer.pattern.render(canopy);
        }
        renderer.render(scene, camera);

    }, 1000 / 60 );
  
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
        const pattern = activeLayer.pattern;
        const x = ((event.clientX - 300) / (window.innerWidth - 300) ) * 2 - 1;
        const y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        const vector = new THREE.Vector2( x, y );
        
        const ray = new THREE.Raycaster();
        ray.setFromCamera(vector, camera);
        // create an array containing all objects in the scene with which the ray intersects
        const intersects = ray.intersectObjects( canopy.ledHitBoxes );
        if ( intersects.length > 0 )
        {
            //const mesh = intersects[0].object;
            const intersect = intersects[0];
            const s = canopy.ledHitBoxes.indexOf(intersect.object);
            const points = intersect.object.geometry.attributes.position.array;
            const point = { x: intersect.point.x.toPrecision(2), y: intersect.point.y.toPrecision(2), z: intersect.point.z.toPrecision(2) };
            let l = intersect.index;
            for (let i = 0; i < points.length; i += 3) {
                if (points[i] - point.x <= 0.1 && points[i+1] - point.y <= 0.1 && points[i+2] - point.z <= 0.1) {
                    l = parseInt(i / 3);
                }
            }

            console.log(s,l);
            //const i = canopy.ledHitBoxes.indexOf(mesh);
            //mesh.material.opacity = 1;
            //setTimeout(() => { mesh.material.opacity = 0 }, 500);
            const coord = mapFromCanopy(s,l);

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
