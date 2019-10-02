import * as THREE from 'three';
import { Player } from './game/player';
import Stats from 'stats.js';
import { WorldGrid } from './game/world-grid';
import { World } from './game/core/world';
import GameWorld from './game/game-world';


let scene: THREE.Scene, 
    camera: THREE.Camera, 
    renderer: THREE.WebGLRenderer, 
    stats: Stats,
    world: World;



function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color().setHSL(0.6, 0, 1);
    scene.fog = new THREE.Fog(scene.background.getHex(), 1, 5000);

    camera = new THREE.PerspectiveCamera(30,
        window.innerWidth / window.innerHeight,
        0.1,
        5000);
    camera.position.set(0, 0, 200);
    camera.lookAt(0, 0, 0);

    world = new GameWorld();
    world.create(scene, camera);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // renderer.gammaInput = true;
    // renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;


    // let geom = new THREE.BoxGeometry(10, 10, 10);
    // let mat = new THREE.MeshLambertMaterial({ color: 0xffaaff });
    // cube = new THREE.Mesh(geom, mat);
    // cube.position.y = 10;

    // cube.castShadow = true;
    // cube.receiveShadow = true;

    // scene.add(cube);



    stats = new Stats();
    document.body.appendChild(stats.dom);
}

// TODO: optimise this with a proper game loop
// http://nokarma.org/2011/02/02/javascript-game-development-the-game-loop/index.html
function update() {
    world.update(1/60);
}

function animate() {
    requestAnimationFrame(animate);

    stats.begin();

    renderer.render(scene, camera);

    stats.end();
}

init();
setInterval(update, 1000/60);
animate();