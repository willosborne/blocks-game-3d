import { AABB } from "../core/physics/AABB";

export interface Collideable {
    collides(aabb: AABB): boolean
}