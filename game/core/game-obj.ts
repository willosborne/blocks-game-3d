import { AABB } from "./physics/AABB";
import { Vector3, Scene } from "three";
import { GameBase } from "./game-base";

export class GameObj extends GameBase {
    position: Vector3;

    collides(aabb: AABB): boolean {
        return false;
    }

    create(scene: Scene) {

    }

    update(elapsed: number) {

    }
}