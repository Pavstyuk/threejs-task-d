import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'https://cdnjs.cloudflare.com/ajax/libs/stats.js/17/Stats.js';


let width, height;
const canvas = document.getElementById('canvas');

const setSizes = () => {
    width = window.innerWidth;
    height = window.innerHeight;
}

setSizes();

window.addEventListener('resize', () => {
    setSizes();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

});

//ROOT BASIC VARIABLES
const colorBlue = 0x4763ad;
const colorLight = 0xf0f0f7;
const colorRed = 0xff2233;

//LIGHTS
const ambientLight = new THREE.AmbientLight(0xffffff, 3); // soft white light
const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 512;
dirLight.shadow.mapSize.height = 512;
dirLight.position.set(0, 2, 5);
dirLight.lookAt(0, 0, 0);
const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight2.castShadow = true;
dirLight2.shadow.mapSize.width = 512;
dirLight2.shadow.mapSize.height = 512;
dirLight2.position.set(0, -2, -5);
dirLight2.lookAt(0, 0, 0);

// CAMERA
const camera = new THREE.PerspectiveCamera(60, width / height, 0.01, 500);
camera.name = "Camera_A";
camera.position.set(0, 3, 7);

// SCENE
const scene = new THREE.Scene({});
scene.background = new THREE.Color(colorLight);

// GEOMETRIES 
const geometry = new THREE.BoxGeometry(2, 2, 2);


// MATERIAL
const materialA = new THREE.MeshPhysicalMaterial({
    flatShading: true,
    color: colorBlue,
    fog: true,
    roughness: 0.5,
    metalness: 0.5,
    sheen: 1,
    sheenRoughness: 0.5,
    sheenColor: colorLight,
});

const materialB = new THREE.MeshPhysicalMaterial({
    flatShading: true,
    color: colorRed,
    fog: true,
    roughness: 0.5,
    metalness: 0.5,
    sheen: 1,
    sheenRoughness: 0.5,
    sheenColor: colorLight,
});

const materialLine = new THREE.LineBasicMaterial({ color: 0x223344 });


// MESH
let cubeA = new THREE.Mesh(geometry, materialA);
let cubeB = new THREE.Mesh(geometry, materialB);
cubeA.name = "cube";
cubeB.name = "cube";
cubeA.position.set(-1.5, 0, 0);
cubeB.position.set(1.5, 0, 0);

// RENDERER
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


// CONTROLS
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = true;
controls.enablePan = false;
controls.target.set(0, 0, 0);
controls.update();


// STATS
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);


// ADD TO SCENE
scene.add(camera);
scene.add(ambientLight, dirLight, dirLight2);
scene.add(cubeA, cubeB);

// ANIMATION LOOP
const animation = () => {

    stats.begin();

    controls.update();
    renderer.render(scene, camera);
    TWEEN.update();
    stats.end();

    renderer.setAnimationLoop(animation);
}

animation();


// CLICKING EVENTS
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function animateScale(cube, size) {
    new TWEEN.Tween(cube.scale).to({
        x: size,
        y: size,
        z: size,
    }, 300)
        .easing(TWEEN.Easing.Quartic.Out)
        .start();
}

function updateCubes(pointA, pointB, cubeID) {
    let delta = pointA.distanceTo(pointB).toFixed(2)

    if (cubeA.uuid === cubeID) {
        let multiply = delta / cubeB.geometry.parameters.width;
        animateScale(cubeB, multiply);
    } else {
        let multiply = delta / cubeA.geometry.parameters.width;
        animateScale(cubeA, multiply);
    }


}

function clicking(e) {

    pointer.x = (e.clientX / width) * 2 - 1;
    pointer.y = -(e.clientY / height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    let intersection = raycaster.intersectObjects(scene.children);

    if (intersection[0]) {
        let interCube = intersection.filter(item => { return item.object.name === "cube" });
        updateCubes(interCube[0].point, interCube[0].object.position, interCube[0].object.uuid);
    }
}

window.addEventListener('click', clicking);