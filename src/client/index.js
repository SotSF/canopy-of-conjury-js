
import * as THREE from 'three';
import { CanopyThreeJs } from './canopy';
import * as Menu from './menu';
import { patterns } from './state';
import * as messenger from './messenger'
import { Oscillator } from '../patterns';
import { PreviousFrequency } from '../util/sound';



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

// Sound
let listeningToMic = false;
let freqArray = new Uint8Array();
let analyser;
window.audio={
    paused:true,
    mic: false,
    mp3: false
};


animate();

function animate() {
    // Sound
    const soundOn = audio.mp3 ? !audio.paused : listeningToMic;
    if (soundOn) {
        PreviousFrequency(freqArray);
        freqArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(freqArray);
        messenger.state.syncSound(soundOn, freqArray);
    }


    requestAnimationFrame( animate );
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    canopy.clear();

    // Reverse the patterns so that the bottom one is rendered first
    let phase = 0;
    patterns.slice().reverse().forEach((pattern, i) => {
        const sound = {
            audio: soundOn,
            frequencyArray: freqArray
        }
        pattern.instance.progress(sound);        
        
        if (pattern.instance.constructor === Oscillator) {
            pattern.instance.render(canopy, phase); // probably wanna put this info in state
            phase = i == 0 ? 0 : pattern.instance.OscValue();
        }
        else {
            pattern.instance.render(canopy);
        }
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

$(document).ready(() => Menu.initialize(canopy));

// Sound - Microphone or Mic Line
/*
function soundSuccess (stream) {
    window.persistAudioStream = stream;
    const audioContent = new AudioContext();
    //const audioStream = audioContent.createMediaStreamSource(stream);
    const audioStream = audioContent.createMediaElementSource(stream);
    analyser = audioContent.createAnalyser();
    audioStream.connect(analyser);
    analyser.fftSize = 1024;
    listeningToMic = true;
}

function soundError (error) {
    console.log("Unable to listen to mic line in.");
}

$(document).ready(() => {
    navigator.mediaDevices.getUserMedia({audio:true}.then(soundSuccess).catch(soundError);
});
*/

$(document).ready(() => {
    window.audio = new Audio();
    audio.src = "/static/One Day They'll Know (Odesza Remix).mp3"; // drop a soundfile into /static for now
    audio.controls = true;
    $('#controls').append(audio);
    const context = new AudioContext();
    //const audioStream = audioContent.createMediaStreamSource(stream);
    const audioStream = context.createMediaElementSource(audio);
    analyser = context.createAnalyser();
    audioStream.connect(analyser);
    analyser.connect(context.destination); // needed to output media file
    analyser.fftSize = 1024;

    audio.mp3 = true;
    
})
