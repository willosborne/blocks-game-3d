import { Vector3 } from 'three';
import { addVector3 } from '../../../utils/math-utils';

export class AABB {
    lowerBound: Vector3;
    upperBound: Vector3;

    private updateCallbacks = [];

    constructor(lower: Vector3, upper: Vector3) {
        this.lowerBound = lower;
        this.upperBound = upper;
    }
    
    set(lower: Vector3, upper: Vector3) {
        this.lowerBound = lower;
        this.upperBound = upper;

        this.updateHelpers();
    }

    midpoint() {
        return new Vector3(
            (this.lowerBound.x + this.upperBound.x) / 2,
            (this.lowerBound.y + this.upperBound.y) / 2,
            (this.lowerBound.z + this.upperBound.z) / 2);
    }

    addHelper(cb) {
        this.updateCallbacks.push(cb);
    }

    updateHelpers() {
        for (let cb of this.updateCallbacks) {
            cb(this);
        }
    }

    intersectsPoint(point: Vector3) {
        return (point.x <= this.upperBound.x) && 
            (point.x > this.lowerBound.x) &&
            (point.y <= this.upperBound.y) &&
            (point.y > this.lowerBound.y) &&
            (point.z <= this.upperBound.z) &&
            (point.z > this.lowerBound.z);
    }

    intersectsAABB(other: AABB) {
        return ((this.lowerBound.x <= other.upperBound.x) && (this.upperBound.x >= other.lowerBound.x)) &&
               ((this.lowerBound.y <= other.upperBound.y) && (this.upperBound.y >= other.lowerBound.y)) &&
               ((this.lowerBound.z <= other.upperBound.z) && (this.upperBound.z >= other.lowerBound.z));
        // return this.intersectsPoint(other.midpoint());
    }

    shift(x: number, y: number, z: number) {
        const offset = new Vector3(x, y, z);
        this.lowerBound.add(offset);
        this.upperBound.add(offset);
    }

    shifted(x: number, y: number, z: number) {
        const offset = new Vector3(x, y, z);
        return new AABB(addVector3(this.lowerBound, offset), 
            addVector3(this.upperBound, offset));
    }

    clone(): AABB {
        return new AABB(this.lowerBound.clone(), this.upperBound.clone());
    }
}