import { Scene, Material, BoxGeometry, MeshLambertMaterial, Object3D, Mesh, Vector3, Color } from "three";
import { BLOCK_SIZE } from "./constants";
import { GameObj } from "./core/game-obj";
import { Collideable } from "./interfaces/collideable";
import { AABB } from "./core/physics/AABB";
import { Blocks3DStatic } from "./blocks-3d-static";
import { AABBHelper } from "./helper/AABBHelper";

export class WorldGrid extends GameObj implements Collideable {
    grid: number[][][] = [];
    aabbGrid: AABB[][][] = [];
    aabbs = [];
    blocksRenderer: Blocks3DStatic;

    gridDimensions = {
        width: 10,
        height: 5,
        depth: 10
    };

    constructor() {
        super();
    }

    create(scene: Scene) {
        this.initGrid();
        this.grid[0][0][0] = 1;
        this.grid[1][1][0] = 1;
        this.grid[2][1][0] = 1;
        this.grid[4][2][0] = 1;
        this.grid[4][2][1] = 1;
        this.grid[4][2][2] = 1;
        this.grid[5][2][0] = 1;
        this.grid[5][2][1] = 1;
        this.grid[5][2][2] = 1;
        this.grid[5][3][1] = 1;
        this.grid[5][4][1] = 1;
        this.grid[6][2][0] = 1;
        this.grid[6][2][1] = 1;
        this.grid[6][2][2] = 1;

        this.blocksRenderer = new Blocks3DStatic(scene, this.grid);

        this.createAABBs();
        for (let aabb of this.aabbs) {
            let helper = new AABBHelper(aabb, new Color(0xff0000), 1, new Vector3(0, 0, 0));
            scene.add(helper);
        }
    }

    collides(aabb: AABB): boolean {
        // let midpoint = aabb.midpoint();
        // let xIndex = Math.floor(midpoint.x / BLOCK_SIZE);
        // let yIndex = Math.floor(midpoint.y / BLOCK_SIZE);
        // let zIndex = Math.floor(midpoint.z / BLOCK_SIZE);
        for (let blockAABB of this.aabbs) {
            // if (aabb.intersectsAABB(blockAABB)) {
            //     return true;
            // }
            if (blockAABB.intersectsAABB(aabb)) {
                return true;
            }
        }

        return false;
    }

    private initGrid() {
        for (let x = 0; x < this.gridDimensions.width; x++) {
            let xRow = [];
            let aabbXRow = [];
            for (let y = 0; y < this.gridDimensions.height; y++) {
                let yRow = [];
                let aabbYRow = [];
                for (let z = 0; z < this.gridDimensions.depth; z++) {
                    yRow[z] = 0; 
                }
                xRow[y] = yRow;
                aabbXRow[y] = aabbYRow;
            }
            this.grid[x] = xRow;
            this.aabbGrid[x] = aabbXRow;
        }
    }

    createAABBs() {
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
        let aabb = new AABB(
            new Vector3(xIndex * BLOCK_SIZE, yIndex * BLOCK_SIZE, zIndex * BLOCK_SIZE),
            new Vector3(
                (xIndex + 1) * BLOCK_SIZE,
                (yIndex + 1) * BLOCK_SIZE,
                (zIndex + 1) * BLOCK_SIZE)
        );
        this.aabbGrid[xIndex][yIndex][zIndex] = aabb;
        this.aabbs.push(aabb);
    }
}