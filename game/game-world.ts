import { World } from "./core/world";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "./shaders";
import { Player } from "./player";
import { WorldGrid } from "./world-grid";
import { Blocks3DStatic } from "./blocks-3d-static";
import { GameGroup } from "./core/game-group";

export default class GameWorld extends World {
    cube: THREE.Mesh;
    hemiLight: THREE.HemisphereLight;
    dirLight: THREE.DirectionalLight;
    camera: THREE.Camera;
    player: Player;
    worldGrid: WorldGrid;
    solids: GameGroup;

    create(scene: THREE.Scene, camera: THREE.Camera) {
        super.create(scene, camera);

        this.camera = camera;

        this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
        this.hemiLight.color.setHSL(0.6, 1, 0.6);
        this.hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        this.hemiLight.position.set(0, 50, 0);
        scene.add(this.hemiLight);

        // let hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
        // scene.add(hemiLightHelper);

        this.dirLight = new THREE.DirectionalLight(0xffffff, 1);
        this.dirLight.color.setHSL(0.1, 1, 0.95);
        this.dirLight.position.set(-1, 1.75, 2);
        this.dirLight.position.multiplyScalar(30);
        scene.add(this.dirLight);

        this.dirLight.castShadow = true;

        let d = 100;

        this.dirLight.shadow.camera.left = - d;
        this.dirLight.shadow.camera.right = d;
        this.dirLight.shadow.camera.top = d;
        this.dirLight.shadow.camera.bottom = - d;
        this.dirLight.shadow.camera.far = 3500;
        this.dirLight.shadow.bias = - 0.0001;

        let dirLightHelper = new THREE.DirectionalLightHelper(this.dirLight, 10);
        scene.add(dirLightHelper);


        let groundGeom = new THREE.PlaneBufferGeometry(10000, 10000);
        let groundMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
        groundMat.color.setHSL(0.95, 1, 0.75);

        let ground = new THREE.Mesh(groundGeom, groundMat);
        ground.position.y = 0;
        ground.rotation.x = - Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);


        let uniforms = {
            topColor: { value: new THREE.Color(0x0077ff) },
            bottomColor: { value: new THREE.Color(0xffffff) },
            offset: { value: 33 },
            exponent: { value: 0.6 }
        };

        uniforms['topColor'].value.copy(this.hemiLight.color);
        scene.fog.color.copy(uniforms['bottomColor'].value);

        let skyGeo = new THREE.SphereBufferGeometry(4000, 32, 15);
        let skyMat = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.BackSide
        });

        let sky = new THREE.Mesh(skyGeo, skyMat);
        scene.add(sky);


        this.solids = new GameGroup();
        this.add(this.solids);

        this.worldGrid = new WorldGrid();
        this.worldGrid.create(scene);
        this.solids.add(this.worldGrid);

        this.player = new Player(this.camera, this.solids);
        this.player.create(scene);
        this.add(this.player);
    }

    update(elapsed: number) {
        super.update(elapsed);
    }
}