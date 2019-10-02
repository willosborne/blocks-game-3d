import { GameBase } from "./game-base";
import { AABB } from "./physics/AABB";

// export type GameGroup = TypedGameGroup<GameObj>;

// export let GameGroup = TypedGameGroup<GameObj>;
export class GameGroup extends GameBase {
    private objects: GameBase[];

    constructor() {
        super();
        this.objects = [];
    }

    add(obj: GameBase) {
        this.objects.push(obj);
    }

    remove(obj: GameBase) {
        let index = this.objects.indexOf(obj);
        if (index > -1) {
            this.objects.splice(index, 1);
        }
    }

    update(elapsed: number) {
        for (let obj of this.objects) {
            obj.update(elapsed);
        }
    }

    collides(aabb: AABB): boolean {
        for (let obj of this.objects) {
            if (obj.collides(aabb)) {
                return true;
            }
        }
        return false;
    }   

    size() {
        return this.objects.length;
    }
}