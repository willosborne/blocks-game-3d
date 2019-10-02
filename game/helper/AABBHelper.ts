import { AABB } from "../core/physics/AABB";
import { Object3D, Vector3, BoxGeometry, EdgesGeometry, LineBasicMaterial, Color, LineSegments, Material } from "three";
import { addVector3 } from "../../utils/math-utils";

export class AABBHelper extends Object3D {
    aabb: AABB;
    color: Color;
    lineWidth: number;
    offset: Vector3;

    wireframe: LineSegments;

    constructor(aabb: AABB, color: Color, lineWidth: number, offset: Vector3) {
        super();
        this.aabb = aabb;
        this.color = color;
        this.lineWidth = lineWidth;
        this.offset = offset;

        this.create();
        aabb.addHelper(() => this.update());
    }

    private create() {
        let cubeGeom = new BoxGeometry(
            Math.abs(this.aabb.upperBound.x - this.aabb.lowerBound.x),
            Math.abs(this.aabb.upperBound.y - this.aabb.lowerBound.y),
            Math.abs(this.aabb.upperBound.z - this.aabb.lowerBound.z));

        let edgesGeom = new EdgesGeometry(cubeGeom);
        let mat = new LineBasicMaterial({ color: this.color, linewidth: this.lineWidth });
        let wireframe = new LineSegments(edgesGeom, mat);

        this.wireframe = wireframe;
        wireframe.position.copy(addVector3(this.aabb.midpoint(), this.offset));

        this.add(wireframe);
        // wireframe.visible = false;
    }

    dispose() {
        this.wireframe.geometry.dispose();
        if ((this.wireframe.material as Material).dispose) {
            (this.wireframe.material as Material).dispose();
        }
        else if ((this.wireframe.material as Material[])) {
            (this.wireframe.material as Material[]).forEach(m => m.dispose());
        }
    }

    update() {
        this.remove(this.wireframe);
        this.dispose();
        
        this.create();
    }
}