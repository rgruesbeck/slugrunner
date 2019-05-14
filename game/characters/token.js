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
    randomBetween,
    getDistance
} from '../utils/baseUtils.js';

import ImageSprite from '../objects/imageSprite.js';

class Token extends ImageSprite {
    constructor(options) {
        super(options);

        this.key = options.key;

        this.collected =  false;
        this.collectedAt = Date.now();

        this.text = '';
        this.color = 'orange';
        //this.color = color;
        // this.font = `bold ${fontSize}px ${font}`
        this.font = `bold ${35}px Arial`

        this.value = options.value;
    }

    draw() {
        // if collected, fly up and fade
        if (this.collected) {
            this.ctx.save();
            this.ctx.font = this.font;
            // this.ctx.fillStyle = hexToRgbA(this.color, this.alpha);
            this.ctx.fillStyle = this.color;
            this.ctx.fillText(this.text, this.x, this.y )
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