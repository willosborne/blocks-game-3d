import { Vector2, Vector3 } from "three";

export function addVector3(a: Vector3, b: Vector3) : Vector3 {
    return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
}

export function addVector2(a: Vector2, b: Vector2) : Vector2 {
    return new Vector2(a.x + b.x, a.y + b.y);
}