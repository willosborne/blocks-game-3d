import { AABB } from "./physics/AABB";

export abstract class GameBase {
    abstract update(elapsed: number);
    abstract collides(aabb: AABB): boolean;
}