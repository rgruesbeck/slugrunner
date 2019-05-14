/**
 * game/character/background.js
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
    randomBetween, pickFromList
} from '../utils/baseUtils.js';

import {
    pickLocation,
    padBounds
} from '../utils/spriteUtils.js';

import ImageSprite from '../objects/imageSprite.js';

class Background {
    constructor({ ctx, screen, x, y, width, height, skyImage, horizonImageA, horizonImageB, floorImageA, floorImageB }) {
        this.ctx = ctx;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 16;

        this.screen = screen;

        this.skyImage = skyImage;
        this.horizonImageA = horizonImageA;
        this.horizonImageB = horizonImageB;
        this.floorImageA = floorImageA;
        this.floorImageB = floorImageB;

        this.images = [];
    }

    update(frame) {
        // every 2 seconds add a sky image (cloud, bird, etc)
        if (frame.count % 120 === 0) {
            // get location somewhere offscreen in x
            // from top to middle of screen
            let spawnLocation = pickLocation({
                top: this.screen.top,
                right: this.screen.right,
                bottom: this.screen.centerY,
                left: this.screen.right
            });

            let depth = randomBetween(1, 4, 'int');
            let width = 90 * (this.screen.scale / depth);
            let height = 70 * (this.screen.scale / depth);

            // add a new image
            this.images = [
                ...this.images,
                new ImageSprite({
                    ctx: this.ctx,
                    image: this.skyImage,
                    x: spawnLocation.x,
                    y: spawnLocation.y,
                    width: width,
                    height: height,
                    speed: this.speed / depth,
                    bounds: padBounds(this.screen)
                })
            ]
        }

        // trees
        if (frame.count % 60 === 0) {
            // get location somewhere offscreen in x
            // from top to middle of screen
            let depth = randomBetween(2, 4, 'int');
            let width = 120 * (this.screen.scale / depth);
            let height = 120 * (this.screen.scale / depth);

            let spawnLocation = pickLocation({
                top: this.screen.bottom - height,
                right: this.screen.right,
                bottom: this.screen.bottom - height,
                left: this.screen.right
            });

            // add a new tree
            this.images = [
                ...this.images,
                new ImageSprite({
                    ctx: this.ctx,
                    image: this.horizonImageA,
                    x: spawnLocation.x,
                    y: spawnLocation.y,
                    width: width,
                    height: height,
                    speed: this.speed / depth,
                    bounds: padBounds(this.screen)
                })
            ]
        }

        // bushes
        if (frame.count % 20 === 0) {
            // get location somewhere offscreen in x
            // from top to middle of screen
            let depth = randomBetween(2, 4, 'int');
            let width = 60 * (this.screen.scale / depth);
            let height = 60 * (this.screen.scale / depth);
            let floorImage = pickFromList([
                this.floorImageA,
                this.floorImageB
            ]);

            let spawnLocation = pickLocation({
                top: this.screen.bottom - height * 0.75,
                right: this.screen.right,
                bottom: this.screen.bottom - height * 0.75,
                left: this.screen.right
            });

            // add a new bush
            this.images = [
                ...this.images,
                new ImageSprite({
                    ctx: this.ctx,
                    image: floorImage,
                    x: spawnLocation.x,
                    y: spawnLocation.y,
                    width: width,
                    height: height,
                    speed: this.speed / depth,
                    bounds: padBounds(this.screen)
                })
            ]
        }

        // mountains
        if (frame.count % 800 === 0) {
            // get location somewhere offscreen in x
            // from top to middle of screen
            let depth = 5;
            let width = 2000 * (this.screen.scale / depth);
            let height = 2000 * (this.screen.scale / depth);

            let spawnLocation = pickLocation({
                top: this.screen.bottom - height * 0.75,
                right: this.screen.right,
                bottom: this.screen.bottom - height * 0.75,
                left: this.screen.right
            });

            // add a new mountain
            this.images = [
                ...this.images,
                new ImageSprite({
                    ctx: this.ctx,
                    image: this.horizonImageB,
                    x: spawnLocation.x,
                    y: spawnLocation.y,
                    width: width,
                    height: height,
                    speed: this.speed / depth,
                    bounds: padBounds(this.screen)
                })
            ]
        }



        // update positions right to left
        this.images = [
            ...this.images
            .map(img => {

                // move image right to left
                img.move(-1, 0, frame.scale);

                return img;
            })
            .filter(img => {
                return img ?
                img.x > -img.width :
                true;
            })
        ]

        // update paralax

    }

    draw() {
        // draw each image
        this.images.forEach(img => img && img.draw())
    }
}

export default Background;