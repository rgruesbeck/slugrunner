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

import ImageSprite from '../objects/imageSprite.js';

class Player extends ImageSprite {
    constructor(options) {
        super(options);

        this.damage = 0;
        this.damagetime = Date.now();
        this.force = { x: 0, y: 0 }
    }

    animate(n) {
        this.width += n;
        this.height += n;
    }

    move(x, y, m) {
        let dx = 0;
        let dy = 0;

        if (this.force.y < 0) {
            this.force.y += 1;
            dy = -1;
        }

        if (this.force.y > 0) {
            this.force.y -= 1;
            dy = +1;
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

    setForce(x, y) {
        this.force = {
            x: this.force.x + x,
            y: this.force.y + y
        }
    }

    jump(m) {
        this.setForce(0, -m);
    }

    addDamage(n) {
        this.damage += n;
        this.damagetime = Date.now();
    }
}

export default Player;