/**
 * game/character/player.js
 * 
 * What it Does:
 *   This file is a basic player character
 *   it extends the imageSprite class and adds two collision detections methods
 * 
 * What to Change:
 *   Add any character specific methods
 *   eg. eat
 * 
 */
import {
    drainFrom,
    drainTo
} from '../utils/baseUtils.js';

import ImageSprite from '../objects/imageSprite.js';

class Player extends ImageSprite {
    constructor(options) {
        super(options);

        this.damage = 0;
        this.damagetime = Date.now();
        this.force = { x: 0, y: 0, g: 1 }
    }

    animate(n) {
        this.width += n;
        this.height += n;
    }

    move(x, y, m) {
        let dx = 0;
        let dy = 0;

        // force is -y (up)
        if (this.force.y < 0) {
            let a = 1 * this.force.g;
            let upForce = drainTo(a * m, this.force.y, 0);

            dy = dy - upForce.flow;
            this.setForce({ y: upForce.stock });
        }

        // force is y (down)
        if (this.force.y > 0) {
            let a = 1 * this.force.g;
            let downForce = drainFrom(a * m, this.force.y, 0);

            dy = dy + downForce.flow;
            this.setForce({ y: downForce.stock });
        }

        super.move(x + dx, y + dy, m);
    }

    draw() {
        let now = Date.now();
        let newDamage =  now - this.damagetime < 200;
        if (newDamage) {
            this.ctx.save();
            this.ctx.globalAlpha = this.damage % 4 === 0 ? 0.5 : 0.75;
            super.draw();
            this.ctx.restore();
        } else {
            super.draw();
        }
    }

    setForce(force) {
        this.force = {
            ...this.force,
            ...force
        };
    }

    addForce(x, y, g = 1) {
        this.setForce({
            x: this.force.x + x,
            y: this.force.y + y,
            g: g
        })
    }

    jump(m) {
        this.setForce({ y: -m });
    }

    addDamage(n) {
        this.damage += n;
        this.damagetime = Date.now();
    }
}

export default Player;