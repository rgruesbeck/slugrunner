/**
 * game/character/obstacle.js
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
    randomBetween
} from '../utils/baseUtils.js';

import {
    pickLocation,
    padBounds
} from '../utils/spriteUtils.js';

import ImageSprite from '../objects/imageSprite.js';

class Obstacle extends ImageSprite {
    constructor(options) {
        super(options);
    }

}

export default Obstacle;