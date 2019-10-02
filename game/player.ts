import * as THREE from 'three';
import { Vector3, Scene, Quaternion } from 'three';
import { KeyHandler } from '../utils/KeyHandler';
import { AABB } from './core/physics/AABB';
import { addVector3 } from '../utils/math-utils';
import { AABBHelper } from './helper/AABBHelper';
import { GameObj } from './core/game-obj';
import { GameGroup } from './core/game-group';

export class Player extends GameObj {
    private camera: THREE.Camera;
    // cameraOffset: THREE.Vector3;
    cameraDistance: number = 250;
    cameraYOffset: number = 200;
    cameraRotationY: number = Math.PI / 4;

    cameraQuaternion: THREE.Quaternion;

    private mesh: THREE.Mesh;

    position: THREE.Vector3;
    velocity: THREE.Vector3;
    // rotatedVelocity: THREE.Vector3;
    maxMoveSpeed = 1.5;
    moveAccel = 0.5;
    drag = 0.7;

    staticSolids: GameGroup;

    aabb: AABB;
    aabbHelper: AABBHelper;

    gravity = 0.1;

    private keyHandler;

    point: THREE.Points;

    dimensions = {
        rad: 5,
        height: 10
    };

    constructor(camera: THREE.Camera, staticSolids: GameGroup) {
        super();

        this.camera = camera;
        this.keyHandler = new KeyHandler();

        // this.cameraOffset = new Vector3(0, 100, 400);

        this.position = new Vector3(0, 30, 0);
        this.velocity = new Vector3(0, 0, 0);
        
        this.cameraQuaternion = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), this.cameraRotationY);
        
        this.updateCamera();

        this.staticSolids = staticSolids;

        this.aabb = new AABB(
            addVector3(this.position, 
                new Vector3(-this.dimensions.rad, 0, this.dimensions.rad)),
            addVector3(this.position, 
                new Vector3(this.dimensions.rad, this.dimensions.height, -this.dimensions.rad)));
        this.aabbHelper = new AABBHelper(this.aabb, new THREE.Color(0x0000ff), 1, 
            new Vector3(0, 0, 0));

        this.keyHandler.onKeyPressed(' ', () => {
            this.jump();
        });
    }

    rotateCamera(angle: number) {
        this.cameraRotationY += angle;
        this.updateCamera();
    }

    updateCamera() {
        while(this.cameraRotationY > Math.PI * 2) {
            this.cameraRotationY -= Math.PI * 2;
        }
        while(this.cameraRotationY < 0) {
            this.cameraRotationY += Math.PI * 2;
        }

        this.cameraQuaternion.setFromAxisAngle(new Vector3(0, 1, 0), this.cameraRotationY);
        let cameraVector = new Vector3(0, this.cameraYOffset, this.cameraDistance)
            .applyQuaternion(this.cameraQuaternion);
        this.camera.position.x = this.position.x + cameraVector.x;
        this.camera.position.y = this.position.y + cameraVector.y;
        this.camera.position.z = this.position.z + cameraVector.z;

        // let speed = Date.now() * 0.00025;
        // this.camera.position.x = this.position.x + Math.cos(this.cameraRotationY) * this.cameraDistance;
        // this.camera.position.z = this.position.z + Math.sin(this.cameraRotationY) * this.cameraDistance;
        // // this.camera.position.x = this.position.x + Math.cos(speed) * this.cameraDistance;
        // // this.camera.position.z = this.position.z + Math.sin(speed) * this.cameraDistance;
        // this.camera.position.y = this.position.y + this.cameraYOffset;

        this.camera.lookAt(this.position);
    }

    create(scene: Scene) {
        scene.add(this.aabbHelper);

        let geom = new THREE.CylinderGeometry(this.dimensions.rad, 
            this.dimensions.rad, 
            this.dimensions.height, 12);
        let mat = new THREE.MeshLambertMaterial({ color: 0xaaffaa });
        this.mesh = new THREE.Mesh(geom, mat);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        scene.add(this.mesh);

        let pointsGeom = new THREE.Geometry();

        let pointsMat = new THREE.PointsMaterial({ color: 0x000000 });
        this.point = new THREE.Points(pointsGeom, pointsMat);
        this.point.position.copy(this.position);

        scene.add(this.point);
    }

    collides(AABB: AABB): boolean {
        return this.aabb.intersectsAABB(AABB);
    }

    jump() {
        this.velocity.y = 2;
    }

    private applyVelocity() {
        let shift = 1;
        if (this.velocity.x !== 0 && 
            this.staticSolids.collides(this.aabb.shifted(this.velocity.x, 0, 0))) {
            let testAABB = this.aabb.clone();
            testAABB.shift(Math.sign(this.velocity.x) * shift, 0, 0);

            while(!this.staticSolids.collides(testAABB)) {
                this.position.x += Math.sign(this.velocity.x) * shift;
            
                testAABB.shift(Math.sign(this.velocity.x) * shift, 0, 0);
            }

            this.velocity.x = 0;
        }
        this.position.x += this.velocity.x;

        if (this.velocity.y !== 0 && 
            this.staticSolids.collides(this.aabb.shifted(0, this.velocity.y, 0))) {
            let testAABB = this.aabb.clone();
            testAABB.shift(0, Math.sign(this.velocity.y) * shift, 0);

            while(!this.staticSolids.collides(testAABB)) {
                this.position.y += Math.sign(this.velocity.y) * shift;
            
                testAABB.shift(0, Math.sign(this.velocity.y) * shift, 0);
            }

            this.velocity.y = 0;
        }
        this.position.y += this.velocity.y;

        if (this.velocity.z !== 0 && 
            this.staticSolids.collides(this.aabb.shifted(0, 0, this.velocity.z))) {
            let testAABB = this.aabb.clone();
            testAABB.shift(0, 0, Math.sign(this.velocity.z) * shift);

            while(!this.staticSolids.collides(testAABB)) {
                this.position.z += Math.sign(this.velocity.z) * shift;
            
                testAABB.shift(0, 0, Math.sign(this.velocity.z) * shift);
            }

            this.velocity.z = 0;
        }
        this.position.z += this.velocity.z;

        // this.position.add(this.velocity);


        if (this.position.y < 0) {
            this.position.y = 0;
            this.velocity.y = 0;
        }
    }

    update(elapsed: number) {
        super.update(elapsed);

        let dVX = 0;
        let dVZ = 0;
        if (this.keyHandler.isPressed('ArrowUp') || this.keyHandler.isPressed('w')) {
            dVZ -= this.moveAccel;
        }
        else if (this.keyHandler.isPressed('ArrowDown') || this.keyHandler.isPressed('s')) {
            dVZ += this.moveAccel;
        }
        else {
            this.velocity.z *= this.drag;
        }

        if (this.keyHandler.isPressed('ArrowLeft') || this.keyHandler.isPressed('a')) {
            dVX -= this.moveAccel;
        }
        else if (this.keyHandler.isPressed('ArrowRight') || this.keyHandler.isPressed('d')) {
            dVX += this.moveAccel;
        }
        else {
            this.velocity.x *= this.drag;
        }

        if (this.keyHandler.isPressed('q')) {
            this.rotateCamera(-0.05);
        }
        else if (this.keyHandler.isPressed('e')) {
            this.rotateCamera(0.05);
        }

        // correct for pythagoras diagonal case
        if (dVX !== 0 && dVZ !== 0) {
            dVX /= 1.41;
            dVZ /= 1.41;
        }
        let moveVector = new Vector3(dVX, 0, dVZ).applyQuaternion(this.cameraQuaternion);
        this.velocity.x += moveVector.x;
        this.velocity.z += moveVector.z;

        this.velocity.y -= this.gravity;

        this.velocity.setX(Math.min(this.maxMoveSpeed, Math.max(-this.maxMoveSpeed, this.velocity.x)));
        this.velocity.setZ(Math.min(this.maxMoveSpeed, Math.max(-this.maxMoveSpeed, this.velocity.z)));

        this.velocity.setY(Math.max(this.velocity.y, -10));

        this.applyVelocity();

        this.mesh.position.copy(this.position);
        this.mesh.position.y += this.dimensions.height / 2;

        this.point.position.copy(this.position);

        this.aabb.set(
            addVector3(this.position, 
                new Vector3(-this.dimensions.rad, 0, -this.dimensions.rad)),
            addVector3(this.position, 
                new Vector3(this.dimensions.rad, this.dimensions.height, this.dimensions.rad)));

        this.updateCamera();

        // console.log(this.position.y);
    }
}
