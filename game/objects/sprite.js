/**
 * game/objects/sprite.js
 * 
 * What it Does:
 *   This file is a basic sprite
 *   it implements abilities like move(x, y), speed, direction, and bounds,
 *   centerX and centerY (cx, cy) and radius
 * 
 * What to Change:
 *   Add any new methods you want all your
 *   game characters that are also sprites to have.
 *   eg. 
 * 
 */

import { bounded } from '../utils/baseUtils.js'

class Sprite {
    constructor({ x, y, width, height, speed, depth, direction, bounds }) {
        // depth
        this.depth = depth || 0;

        // x and y
        this.x = x;
        this.y = y;

        // previous x and y
        this.px = x;
        this.py = y;

        // width and height
        this.width = width - (this.depth * 2);
        this.height = height - (this.depth * 2);

        // center x and y
        this.cx = x + (width/2);
        this.cy = y + (height/2);

        // velocity x and y
        this.vx = 0;
        this.vy = 0;

        // radius
        this.radius = (width + height) / 4;

        // speed of sprite
        this.speed = speed || 1;

        // direction
        this.direction = direction || 'right';

        // bounds
        this.setBounds(bounds);
    }

    move(x, y, m) {
        let speed = this.speed / (this.depth + 1);
        let dx = x === 0 ? this.x : this.x + (x * speed * m);
        let dy = y === 0 ? this.y : this.y + (y * speed * m);
        
        this.setX(dx);
        this.setY(dy);

        // set direction
        if (x < 0) { this.direction = 'right'; }
        if (x > 0) { this.direction = 'left'; }
    }

    setX(nx) {
        // apply x bounds
        const x = bounded(nx, this.bounds.left, this.bounds.right - this.width);

        this.px = this.x; // store previous x value
        this.x = x; // set x

        this.cx = this.x + (this.width/2); // set center x
        this.vx = this.x - this.px; // set velocity x
    }

    setY(ny) {
        // apply y bounds
        const y = bounded(ny, this.bounds.top, this.bounds.bottom - this.height);

        this.py = this.y; // store previous y value
        this.y = y; // set y

        this.cy = this.y + (this.height/2); // set center y
        this.vy = this.y - this.py; // set velocity y
    }

    setBounds({ top, right, bottom, left }) {
        let bounds = {
            top: top,
            right: right,
            bottom: bottom,
            left: left
        };

        this.bounds = {
            ...this.bounds,
            ...bounds
        }
    }
}

export default Sprite;