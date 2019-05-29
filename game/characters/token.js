/**
 * game/character/token.js
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
} from '../utils/baseUtils.js';

import ImageSprite from '../objects/imageSprite.js';

class Token extends ImageSprite {
    constructor(options) {
        super(options);

        this.key = options.key;

        this.collected =  false;
        this.collectedAt = Date.now();

        this.text = '';
        this.color = options.color;
        this.font = `bold ${options.fontSize}px ${options.font}`

        this.value = options.value;
    }

    draw() {
        // if collected, fly up and fade
        if (this.collected) {
            this.ctx.save();
            this.ctx.font = this.font;
            this.ctx.fillStyle = this.color;

            // draw text: not optimal, would be better to use dom and css
            // bit-shift each position and size to integers
            // to avoid asking canvas for sub-pixel rendering
            this.ctx.fillText(this.text,
                this.x >> 0,
                this.y >> 0);

        } else {
            super.draw();
        }
    }

    collect(n) {
        this.collected = true;
        this.collectedAt = Date.now();
        this.text =`+${n * this.value}`;

        return n * this.value;
    }

}

export default Token;