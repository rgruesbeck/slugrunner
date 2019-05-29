/**
 * game/objects/image.js
 * 
 * What it Does:
 *   This file is a basic image class
 *   it contains a basic draw method that draws the image to screen
 * 
 */

class Image {
    constructor({ ctx, image, x, y, width, height }) {
        this.ctx = ctx;
        this.image = image;

        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;
    }

    draw(x, y) {
        let xPosition = x || this.x;
        let yPosition = y || this.y;

        // draw the image to canvas
        // bit-shift each position and size to integers
        // to avoid asking canvas for sub-pixel rendering
        this.ctx.drawImage(this.image,
            xPosition >> 0,
            yPosition >> 0,
            this.width >> 0,
            this.height >> 0);
    }
}

export default Image;