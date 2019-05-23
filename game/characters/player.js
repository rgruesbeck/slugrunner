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

        this.gravity = 1;
        this.dx = 0;
        this.dy = 0;
    }

    animate(n) {
        this.width += n;
        this.height += n;
    }

    move(x, y, m) {
        this.dy += Number(this.gravity); 

        super.move(x + this.dx, y + this.dy, m);
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

    jump(m, g) {
        this.gravity = g;
        this.dy = -m;
    }

    addDamage(n) {
        this.damage += n;
        this.damagetime = Date.now();
    }
}

export default Player;