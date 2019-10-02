export class KeyHandler {
    pressedKeys = [];

    keyCallbacks = {}

    constructor() {
        window.addEventListener('keydown', e => {
            this.pressedKeys[e.key] = true;

            let callbacks = this.keyCallbacks[e.key];
            if (callbacks) {
                for (let cb of callbacks) {
                    cb();
                }
            }
        });
        window.addEventListener('keyup', e => {
            this.pressedKeys[e.key] = false;
        })
        window.addEventListener('blur', () => {
            this.pressedKeys = [];
        })
    }

    onKeyPressed(key: string, cb: () => void) {
        this.keyCallbacks[key] = this.keyCallbacks[key] || [];
        this.keyCallbacks[key].push(cb);
    }

    isPressed(key: string) {
        return this.pressedKeys[key] === true;
    }
}