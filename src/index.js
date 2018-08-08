
import * as THREE from 'three';
import { CanopyThreeJs } from './canopy';
import * as Patterns from './patterns';
import * as Brushes from './brushes';
import * as Menu from './menu';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);
camera.position.z = 11;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth - 300, window.innerHeight);
renderer.domElement.id = "idRenderer";
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
const canopy = new CanopyThreeJs;
canopy.initialize(scene);

var brush; // active freedraw brush
var activeLayer;
var layers = [];
var mapFromCanopyMemo = {};
window.onload = function () {  
    (function(){
        let _mapFromCanopy = (s, l, numStrips) => {
            let theta = s * 2 * Math.PI / numStrips;
            let radius = l + 20;
            let x = parseInt(radius * Math.cos(theta) + Patterns.PCanvas.dimension / 2);
            let y = parseInt(radius * Math.sin(theta) + Patterns.PCanvas.dimension / 2);
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
const setActiveLayer = function(val) {
    activeLayer = layers[val];
}
$(document).ready(function () {
    Menu.initialize(updateLayers, setBrush, setActiveLayer);
    $(document).on('click', '#idRenderer', canopyClick);
});

var waitingOnTarget = false;
var doubleBrush;
const ray = new THREE.Raycaster();
ray.params.Points.threshold = 0.5;
function canopyClick( event ) {
    if (brush && activeLayer && activeLayer.pattern instanceof Patterns.PCanvas) {
        const pattern = activeLayer.pattern;
        const x = ((event.clientX - 300) / (window.innerWidth - 300) ) * 2 - 1;
        const y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        const vector = new THREE.Vector2( x, y );
        ray.setFromCamera(vector, camera);
        // create an array containing all objects in the scene with which the ray intersects
        const intersects = ray.intersectObjects( canopy.ledHitBoxes );
        intersects.sort((a,b) => { return (a.distanceToRay - b.distanceToRay)});
        if ( intersects.length > 0 )
        {
            const intersect = intersects[0];
            const s = canopy.ledHitBoxes.indexOf(intersect.object);
            const l = intersect.index;
            const coord = mapFromCanopy(s,l);

            if (waitingOnTarget) {
                waitingOnTarget = false;
                doubleBrush.target = coord;
                pattern.add(doubleBrush);
                return;    
            }

            switch (brush) {
                case "bubbles":
                    pattern.add(new Brushes.BubbleBrush(Object.assign({}, Brushes.BubbleBrush.setParams), coord));
                    break;
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
