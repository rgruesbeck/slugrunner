/**
 * game/utils/baseUtils.js
 * 
 * What it Does:
 *   This file contains utilities for the game
 * 
 *   randomBetween: get a numbers a min and a max, optionally ask for an int
 * 
 *   getDistance: get the distance between to points with an x and y
 * 
 *   bounded: apply a lower and upper bound to a number
 *   useful for add limits to AI character movements
 * 
 *   isBounded: check if number is within a min and max
 * 
 *   getCursorPosition: get cursor position on the canvas
 *   needed for when tob bar is active
 * 
 *   hexToRgbA: color converter for easier use of the alpha channel
 * 
 *   throttled: wraps a function so that it can't be called until the delay
 *   in milliseconds has gone by. useful for stopping unwanted side effects of button mashing.
 *   https://gph.is/1syA0yc
 * 
 * 
 * What to Change:
 *   Add any new methods that don't fit anywhere else
 *   eg. 
 * 
 */

// get random number between min and max
const randomBetween = (min, max, type) => {
    const rand = Math.random() * (max - min) + min;

    if (type === 'int') {
        return Math.round(rand);
    }

    return rand;
}

// take from until limit
// return flow and new stock value
const drainFrom = (flow, stock, limit) => {
    // stock is at limit no flow possible
    if (stock <= limit) {
        return {
            stock: stock,
            flow: 0
        }
    }

    // get new stock
    let newStock = stock - flow;

    if (newStock > limit) {
        // there was enough stock to handle requested flow
        // return new stock and flow

        return {
            stock: newStock,
            flow: flow
        };

    } else {
        // there was NOT enough stock to handle requested flow
        // return limit as new stock and reduced flow

        return {
            stock: limit,
            flow: stock
        }
    }
}

// add to until limit
const drainTo = (flow, stock, limit) => {
    // stock is at limit no flow possible
    if (stock >= limit) {
        return {
            stock: stock,
            flow: 0
        }
    }

    // get new stock
    let newStock = stock + flow;

    if (newStock < limit) {
        // there was enough stock to handle requested flow
        // return new stock and flow

        return {
            stock: newStock,
            flow: flow
        };

    } else {
        // there was NOT enough stock to handle requested flow
        // return limit as new stock and reduced flow

        return {
            stock: limit,
            flow: stock
        }
    }
}

// pick random element from a list
const pickFromList = (list) => {
    if (!Array.isArray(list) || list.length < 1) { return; }

    let index = randomBetween(0, list.length - 1, 'int');
    return list[index];
}

// distance between two points
const getDistance = (pointA, pointB) => {
    let vx = pointA.x - pointB.x;
    let vy = pointA.y - pointB.y;

    return Math.sqrt(vx * vx + vy * vy);
}

// apply a lower and upper bound to a number
const bounded = (n, min, max) => {
    return [n]
    .map(n => n < min ? min : n)
    .map(n => n > max ? max : n)
    .reduce(n => n);
}

// check if n is within bounds
const isBounded = (n, min, max) => {
    return n > min && n < max;
}

// get cursor event position (tap, click, etc)
// needed for canvas click while top bar active
const getCursorPosition = (canvas, event) => {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    }
}

// color converter
const hexToRgbA = (hex, opacity) => {
    let h=hex.replace('#', '');
    h =  h.match(new RegExp('(.{'+h.length/3+'})', 'g'));

    for(let i=0; i<h.length; i++)
        h[i] = parseInt(h[i].length==1? h[i]+h[i]:h[i], 16);

    if (typeof opacity != 'undefined')  h.push(opacity);

    return 'rgba('+h.join(',')+')';
}

// create throttled function
// checkout: https://outline.com/nBajAS
const throttled = (delay, fn) => {
    let lastCall = 0;
    return function (...args) {
        const now = (new Date).getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return fn(...args);
    }
}

// toy hash for prefixes
// useful for prefexing localstorage keys
const hashCode = (str, base = 16) => {
    return [str.split("")
    .reduce(function(a, b) {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a
    }, 0)] // create simple hash from string
    .map(num => Math.abs(num)) // only positive numbers
    .map(num => num.toString(base)) // convert to base
    .reduce(h => h); // fold
}

export {
    bounded,
    isBounded,
    drainTo,
    drainFrom,
    getCursorPosition,
    getDistance,
    hexToRgbA,
    pickFromList,
    randomBetween,
    hashCode,
    throttled
};