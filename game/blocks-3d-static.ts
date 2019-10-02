import { Scene, Material, BoxGeometry, MeshLambertMaterial, Object3D, Mesh } from "three";
import { BLOCK_SIZE } from "./constants";

// renders 3D blocks that don't change ie they're static. 
// Don't put moving stuff in here, please.

export class Blocks3DStatic extends Object3D {
    grid: number[][][] = [];

    gridDimensions = {
        width: 10,
        height: 5,
        depth: 10
    };

    blockMaterial: Material;
    blockGeometry: BoxGeometry;

    constructor(scene: Object3D, grid: number[][][]) {
        super();

        this.blockGeometry = new BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        this.blockMaterial = new MeshLambertMaterial({ color: 0xffffff });

        this.grid = grid;

        this.createBlocks();

        scene.add(this);
    }

    dispose() {
        this.blockGeometry.dispose();
        this.blockMaterial.dispose();
    }

    createBlocks() {
        for (let x = 0; x < this.gridDimensions.width; x++) {
            for (let y = 0; y < this.gridDimensions.height; y++) {
                for (let z = 0; z < this.gridDimensions.depth; z++) {
                    let val = this.grid[x][y][z];

                    if (val === 0)
                        continue;

                    this.createBlock(x, y, z, val);
                }
            }
        }
    }

    createBlock(xIndex: number, yIndex: number, zIndex: number, blockId: number) {
        let cube: Mesh = new Mesh(this.blockGeometry, this.blockMaterial);

        cube.position.x = (xIndex + 0.5) * BLOCK_SIZE;
        cube.position.y = (yIndex + 0.5) * BLOCK_SIZE;
        cube.position.z = (zIndex + 0.5) * BLOCK_SIZE;

        cube.receiveShadow = true;
        cube.castShadow = true;

        this.add(cube);
    }
}