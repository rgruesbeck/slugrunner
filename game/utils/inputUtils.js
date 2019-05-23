/**
 * game/utils/inputUtils.js
 * 
 * What it Does:
 *   This file contains input related utilities for the game
 * 
 *   handleSwipe: input type of touch event, the touch event, and the function to run after the swipe
 *   returns a swipe in the form of { x, y, direction }
 * 
 * What to Change:
 *   Add any new methods that don't fit anywhere else
 *   eg. 
 * 
 */

let touches = [];

// take touch list return a diffs for x and y
const touchListDiffs = (touchList) => {
    return touchList
    .map((touch, idx, arr) => {
        // collect diffs
        let prev = arr[idx - 1] || arr[0];
        return {
            x: touch.x,
            y: touch.y,
            dx: touch.x - prev.x,
            dy: touch.y - prev.y
        }
    })
    .reduce((sum, diff) => {
        // sum the diffs
        sum.dx += diff.dx;
        sum.dy += diff.dy;

        return sum;
    }, { dx: 0, dy: 0 });
}

// take diffs, return a swipe with a direction
const diffSwipe = (diff) => {
    return [diff]
    .map(diff => {
        return {
            x: Math.abs(diff.dx) > Math.abs(diff.dy),
            y: Math.abs(diff.dy) > Math.abs(diff.dx),
            dx: diff.dx,
            dy: diff.dy
        };
    })
    .map(swipe => {
        // get swipe direction
        if (swipe.x) {
            swipe.direction = swipe.dx > 0 ?
            'right' : 'left';
        }

        if (swipe.y) {
            swipe.direction = swipe.dy > 0 ?
            'down' : 'up';
        }

        return swipe;
    })
    .reduce(s => s);
}

const getSwipe = (type, touch, fn) => {

    // reject non touch types
    if (!type.match(/touchstart|touchmove|touchend/)) {
        return;
    }

    // clear touch list
    if (type === 'touchstart') {
        touches = [];
    }

    // add to touch list
    if (type === 'touchmove') {
        let { clientX, clientY } = touch;
        touches.push({ x: clientX, y: clientY });
    }

    // get user intention
    if (type === 'touchend' && touches.length > 0) {

        // get diffs from touches
        let diff = touchListDiffs(touches);

        // get swipe from diff
        let swipe = diffSwipe(diff);
        fn(swipe);
    }
}

export {
    getSwipe
};