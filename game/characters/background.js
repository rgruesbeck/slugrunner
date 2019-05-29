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
    constructor({ ctx, screen, speed, x, y, width, height, skyImage, horizonImageA, horizonImageB, floorImage }) {
        this.ctx = ctx;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = speed;

        this.screen = screen;

        this.skyImage = skyImage;
        this.horizonImageA = horizonImageA;
        this.horizonImageB = horizonImageB;
        this.floorImage = floorImage;

        this.images = this.freshScene();
        this.counts = {};
    }

    freshScene() {
        // populate start screen with scene
        return [
            this.createHorizonImageB(false),
            this.createHorizonImageB(false),
            this.createSkyImage(false),
            this.createSkyImage(false),
            this.createSkyImage(false),
            this.createSkyImage(false),
            this.createHorizonImageA(false),
            this.createHorizonImageA(false),
            this.createHorizonImageA(false),
            this.createHorizonImageA(false),
            this.createHorizonImageA(false),
            this.createHorizonImageA(false),
            this.createHorizonImageA(false),
            this.createHorizonImageA(false),
            this.createFloorImage(false),
            this.createFloorImage(false),
            this.createFloorImage(false),
            this.createFloorImage(false)
        ]
    }

    createSkyImage(spawned = true) {
        if (!this.skyImage) { return; }

        // get location somewhere offscreen in x
        // from top to middle of screen
        let spawnLocation = pickLocation({
            top: this.screen.top,
            right: this.screen.right,
            bottom: this.screen.centerY,
            left: spawned ? this.screen.right : this.screen.left
        });

        let depth = randomBetween(4, 8, 'int');

        let height = (this.screen.height / 2) / depth;
        let width = (height * this.skyImage.width / this.skyImage.height);

        return new ImageSprite({
            ctx: this.ctx,
            type: 'sky',
            image: this.skyImage,
            x: spawnLocation.x,
            y: spawnLocation.y,
            width: width,
            height: height,
            speed: this.speed / depth,
            depth: depth,
            bounds: padBounds(this.screen)
        });
    }

    createHorizonImageA(spawned = true) {
        if (!this.horizonImageA) { return; }

        // get location somewhere offscreen in x
        // from top to middle of screen
        let depth = randomBetween(2, 3, 'int');

        let height = (this.screen.height) / depth;
        let width = (height * this.horizonImageA.width / this.horizonImageA.height);

        let spawnLocation = pickLocation({
            top: this.screen.bottom - height,
            right: spawned ? this.screen.right : this.screen.right - width / 2,
            bottom: this.screen.bottom - height,
            left: spawned ? this.screen.right : this.screen.left - width / 2
        });

        return new ImageSprite({
            ctx: this.ctx,
            type: 'horizonA',
            image: this.horizonImageA,
            x: spawnLocation.x,
            y: spawnLocation.y,
            width: width,
            height: height,
            speed: this.speed / depth,
            depth: depth,
            bounds: padBounds(this.screen)
        })
    }

    createHorizonImageB(spawned = true) {
        if (!this.horizonImageB) { return; }

        // get location somewhere offscreen in x
        // from top to middle of screen
        let depth = randomBetween(6, 7, 'int');

        let height = (this.screen.height * 5.5) / depth;
        let width = (height * this.horizonImageB.width / this.horizonImageB.height);

        let spawnLocation = pickLocation({
            top: this.screen.bottom - height,
            right: spawned ? this.screen.right : this.screen.right - width / 2,
            bottom: this.screen.bottom - height,
            left: spawned ? this.screen.right : this.screen.left - width / 2
        });

        return new ImageSprite({
            ctx: this.ctx,
            type: 'horizonB',
            image: this.horizonImageB,
            x: spawnLocation.x,
            y: spawnLocation.y,
            width: width,
            height: height,
            speed: this.speed / depth,
            depth: depth,
            bounds: padBounds(this.screen)
        })
    }

    createFloorImage(spawned = true) {
        if (!this.floorImage) { return; }

        // get location somewhere offscreen in x
        // from top to middle of screen
        let depth = randomBetween(2, 3, 'int');

        let height = (this.screen.height / 6) / depth;
        let width = (height * this.floorImage.width / this.floorImage.height);

        let spawnLocation = pickLocation({
            top: this.screen.bottom - height,
            right: this.screen.right,
            bottom: this.screen.bottom - height,
            left: spawned ? this.screen.right : this.screen.left
        });

        return new ImageSprite({
            ctx: this.ctx,
            type: 'floor',
            image: this.floorImage,
            x: spawnLocation.x,
            y: spawnLocation.y,
            width: width,
            height: height,
            speed: this.speed / depth,
            depth: depth,
            bounds: padBounds(this.screen)
        })
    }

    update(frame) {
        // every 2 seconds add a sky image (cloud, bird, etc)
        if (frame.count % 300 === 0 && this.images.filter(i => i.type === 'sky').length < 5) {

            // add a new cloud/ sky image
            this.images = [
                ...this.images,
                this.createSkyImage()
            ]
        }

        // trees
        if (frame.count % 120 === 0 && this.images.filter(i => i.type === 'horizonA').length < 15) {

            // add a new tree/horizon image a
            this.images = [
                ...this.images,
                this.createHorizonImageA()
            ]
        }

        // mountains
        if (frame.count % 300 === 0 && this.images.filter(i => i.type === 'horizonB').length < 3) {
            // add a new mountain
            this.images = [
                ...this.images,
                this.createHorizonImageB()
            ]
        }

        // bushes
        if (frame.count % 120 === 0 && this.images.filter(i => i.type === 'floor').length < 20) {
            // add a new bush
            this.images = [
                ...this.images,
                this.createFloorImage()
            ]
        }



        // update positions right to left
        this.images = [
            ...this.images
            .filter(img => img)
            .map(img => {
                img.speed = this.speed / img.depth;
                return img;
            })
            .sort((a, b) => a.depth + b.depth)
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

    }

    draw() {
        // draw each image
        this.images
        .forEach(img => img && img.draw())
    }
}

export default Background;