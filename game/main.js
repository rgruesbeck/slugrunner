/**
 * game/main.js
 * 
 * What it Does:
 *   This file is the main game class
 *   Important parts are the load, create, and play functions
 *   
 *   Load: is where images, sounds, and fonts are loaded
 *   
 *   Create: is where game elements and characters are created
 *   
 *   Play: is where game characters are updated according to game play
 *   before drawing a new frame to the screen, and calling play again
 *   this creates an animation just like the pages of a flip book
 * 
 *   Other parts include boilerplate for requesting and canceling new frames
 *   handling input events, pausing, muting, etc.
 * 
 * What to Change:
 *   Most things to change will be in the play function
 */

import Koji from 'koji-tools';

import {
    requestAnimationFrame,
    cancelAnimationFrame
} from './helpers/animationFrame.js';

import {
    loadList,
    loadImage,
    loadSound,
    loadFont
} from './helpers/assetLoaders.js';

import {
    randomBetween,
    pickFromList
} from './utils/baseUtils.js';

import {
    pickLocation,
    padBounds,
    collisionsWith,
    collideDistance,
    pickLocationAwayFromList,
    pickLocationAwayFrom
} from './utils/spriteUtils.js';

import Player from './characters/player.js';
import Background from './characters/background.js';
import Obstacle from './characters/obstacle.js';
import Token from './characters/token.js';

class Game {

    constructor(canvas, overlay, topbar, config) {
        this.config = config; // customization
        this.overlay = overlay;
        this.topbar = topbar;

        this.canvas = canvas; // game screen
        this.ctx = canvas.getContext("2d"); // game screen context

        // frame count, rate, and time
        // this is just a place to keep track of frame rate (not set it)
        this.frame = {
            count: 0,
            time: Date.now(),
            rate: null,
            scale: null
        };

        // game settings
        this.state = {
            current: 'loading',
            prev: '',
            score: 0,
            lives: 0,
            paused: false,
            muted: localStorage.getItem('game-muted') === 'true'
        };

        this.input = {
            active: 'keyboard',
            keyboard: { up: false, right: false, left: false, down: false },
            mouse: { x: 0, y: 0, click: false },
            touch: { x: 0, y: 0 },
        };

        this.images = {}; // place to keep images
        this.sounds = {}; // place to keep sounds
        this.fonts = {}; // place to keep fonts

        this.player = {};
        this.obstacles = [];
        this.tokens = [];

        // setup event listeners
        // handle keyboard events
        document.addEventListener('keydown', ({ code }) => this.handleKeyboardInput('keydown', code));
        document.addEventListener('keyup', ({ code }) => this.handleKeyboardInput('keyup', code));

        // handle taps
        document.addEventListener('touchstart', () => this.handleJump());
        document.addEventListener('mousedown', () => this.handleJump());

        // handle overlay clicks
        this.overlay.root.addEventListener('click', ({ target }) => this.handleClicks(target));

        // handle resize events
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener("orientationchange", (e) => this.handleResize(e));
        
        // handle koji config changes
        Koji.on('change', (scope, key, value) => {
            console.log('updating configs...', scope, key, value);
            this.config[scope][key] = value;
            this.cancelFrame(this.frame.count - 1);
            this.load();
        });

    }

    init() {
        // set 

        // set topbar and topbar color
        this.topbar.active = this.config.settings.gameTopBar;
        this.topbar.style.display = this.topbar.active ? 'block' : 'none';
        this.topbar.style.backgroundColor = this.config.colors.primaryColor;

        // set canvas
        this.canvas.width = window.innerWidth; // set game screen width
        this.canvas.height = this.topbar.active ? window.innerHeight - this.topbar.clientHeight : window.innerHeight; // set game screen height

        // set screen
        this.screen = {
            top: 0,
            bottom: this.canvas.height,
            left: 0,
            right: this.canvas.width,
            centerX: this.canvas.width / 2,
            centerY: this.canvas.height / 2,
            width: this.canvas.width,
            height: this.canvas.height,
            scale: (this.canvas.width) / 2  * 0.005
        };

        // set state
        this.setState({
            lives: this.config.settings.lives
        });

        // set document body to backgroundColor
        document.body.style.backgroundColor = this.config.colors.backgroundColor;

        // set loading indicator to textColor
        document.querySelector('#loading').style.color = this.config.colors.textColor;

    }

    load() {
        // load pictures, sounds, and fonts

        this.init(); // apply new configs
        
        // make a list of assets
        const gameAssets = [
            loadImage('playerImage', this.config.images.playerImage),
            loadImage('obstacleImage', this.config.images.obstacleImage),
            loadImage('tokenImageA', this.config.images.tokenImageA),
            loadImage('tokenImageB', this.config.images.tokenImageB),
            loadImage('skyImage', this.config.images.skyImage),
            loadImage('horizonImageA', this.config.images.horizonImageA),
            loadImage('horizonImageB', this.config.images.horizonImageB),
            loadImage('floorImage', this.config.images.floorImage),
            loadImage('backgroundImage', this.config.images.backgroundImage),
            loadSound('backgroundMusic', this.config.sounds.backgroundMusic),
            loadSound('jumpSound', this.config.sounds.jumpSound),
            loadSound('scoreSound', this.config.sounds.scoreSound),
            loadSound('hitSound', this.config.sounds.hitSound),
            loadSound('gameOverSound', this.config.sounds.gameOverSound),
            loadFont('gameFont', this.config.settings.fontFamily)
        ];

        // put the loaded assets the respective containers
        loadList(gameAssets)
        .then((assets) => {

            this.images = assets.image;
            this.sounds = assets.sound;

        })
        .then(() => this.create());
    }

    create() {
        // create game characters

        const { scale, left, bottom } = this.screen;
        const { playerImage } = this.images;


        let playerHeight = 60 * scale;
        let playerWidth = 80 * scale;

        this.player = new Player({
            ctx: this.ctx,
            image: playerImage,
            x: this.screen.centerX - playerWidth * 0.75,
            y: bottom,
            width: playerWidth,
            height: playerHeight,
            speed: 50,
            bounds: this.screen
        });

        this.background = new Background({
            ctx: this.ctx,
            screen: this.screen,
            x: 0,
            y: 0,
            width: this.canvas.width,
            height: this.canvas.height,
            skyImage: this.images.skyImage,
            horizonImageA: this.images.horizonImageA,
            horizonImageB: this.images.horizonImageB,
            floorImage: this.images.floorImage,
        })

        // set overlay styles
        this.overlay.setStyles({...this.config.colors, ...this.config.settings});

        this.setState({ current: 'ready' });
        this.play();
    }

    play() {
        // update game characters

        // clear the screen of the last picture
        this.ctx.fillStyle = this.config.colors.backgroundColor; 
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // draw and do stuff that you need to do
        // no matter the game state
        this.background.draw();

        // update score and lives
        this.overlay.setLives(this.state.lives);
        this.overlay.setScore(this.state.score);

        // ready to play
        if (this.state.current === 'ready') {
            this.overlay.hide('loading');
            this.canvas.style.opacity = 1;

            this.overlay.setBanner(this.config.settings.name);
            this.overlay.setButton(this.config.settings.startText);
            this.overlay.setInstructions({
                desktop: this.config.settings.instructionsDesktop,
                mobile: this.config.settings.instructionsMobile
            });

            this.overlay.show('stats');

            this.overlay.setMute(this.state.muted);
            this.overlay.setPause(this.state.paused);

            // player
            let pulse = Math.cos(this.frame.count / 10) / 4;
            this.player.animate(pulse * this.screen.scale);
            this.player.move(0, 0, this.frame.scale);
            this.player.addForce(0, 1);
            this.player.draw();
        }

        // game play
        if (this.state.current === 'play') {
            // check lives
            if (this.state.lives < 1) {
                this.setState({ current: 'over' });
            }

            // update background
            this.background.update(this.frame);

            // if last state was 'ready'
            // hide overlay items
            if (this.state.prev === 'ready') {
                this.overlay.hide(['banner', 'button', 'instructions'])
            }

            if (!this.state.muted) { this.sounds.backgroundMusic.play(); }

            // obstacles
            // every 2 seconds, add an obstacle if less than 3 on screen
            let check = pickFromList([120, 300]);
            if (this.frame.count % check ===  0 && this.obstacles.length < 3) {
                let width = 45 * this.screen.scale;
                let height = 35 * this.screen.scale;

                this.obstacles = [
                    ...this.obstacles,
                    new Obstacle({
                        ctx: this.ctx,
                        image: this.images.obstacleImage,
                        x: this.screen.right,
                        y: this.screen.bottom - height,
                        width: width,
                        height: height,
                        speed: 18,
                        bounds: padBounds(this.screen)
                    })
                ]
            }

            this.obstacles = [
                ...this.obstacles
                .filter(obs => obs.x > -obs.width)
            ];

            this.obstacles.forEach(obs => {
                obs.move(-1, 0, this.frame.scale);
                obs.draw();
            });

            // check obstacle collisions
            let obstacleCollision = collisionsWith(this.obstacles, (obs) => {
                return collideDistance(obs, this.player);
            })

            if (obstacleCollision) {
                this.player.addDamage(1);

                // every 20 damage, take 1 life
                if (this.player.damage % 20 === 0) {
                    this.setState({
                        lives: this.state.lives - 1
                    })

                    this.sounds.hitSound.play();
                }
            }

            // tokens
            // every 2 seconds, add an token if less than 3 on screen
            let tokenTime = this.frame.count % 20 === 0;
            let tokenWidth = 25 * this.screen.scale;
            let tokenHeight = 25 * this.screen.scale;
            let tokenLocation = pickLocationAwayFrom({
                top: this.screen.bottom - tokenHeight * 6,
                bottom: this.screen.bottom - tokenHeight,
                right: this.screen.right,
                left: this.screen.right
            }, this.obstacles[this.obstacles.length - 1], tokenWidth)

            if (tokenTime && tokenLocation) {
                let { tokenImageA, tokenImageB } = this.images;
                let tokenA = { key: `token-A-${this.frame.count}`, value: 1, image: tokenImageA }
                let tokenB = { key: `token-B-${this.frame.count}`, value: 10, image: tokenImageB }

                let token = pickFromList([ tokenA, tokenA, tokenA, tokenB ]) 

                this.tokens = [
                    ...this.tokens,
                    new Token({
                        key: token.key,
                        ctx: this.ctx,
                        image: token.image,
                        color: this.config.colors.primaryColor,
                        font: this.config.settings.fontFamily,
                        fontSize: tokenWidth,
                        x: tokenLocation.x,
                        y: tokenLocation.y,
                        width: tokenWidth,
                        height: tokenHeight,
                        speed: 18,
                        bounds: padBounds(this.screen),
                        value: token.value
                    })
                ]
            }

            this.tokens = [
                ...this.tokens
                .filter(tkn => tkn.x > -tkn.width)
                .filter(tkn => tkn.y > this.player.y - this.player.height || !tkn.collected)
            ];

            this.tokens.forEach(tkn => {
                if (tkn.collected) {
                    tkn.move(0, -1, this.frame.scale);
                } else {
                    tkn.move(-1, 0, this.frame.scale);
                }

                tkn.draw(this.frame);
            });

            // check token collisions and collect token
            collisionsWith(this.tokens, (tkn) => {
                let collectToken = collideDistance(tkn, this.player);
                if (collectToken && !tkn.collected) {
                    tkn.collect(1);
                    this.setState({ score: this.state.score + 1 });

                    this.sounds.currentTime = 0;
                    this.sounds.scoreSound.play();
                }

                return collectToken;
            })

            // player
            let pulse = Math.cos(this.frame.count / 10) / 4;
            this.player.animate(pulse * this.screen.scale);
            this.player.move(0, 0, this.frame.scale);
            this.player.addForce(0, 1);
            this.player.draw();

        }

        // game over
        if (this.state.current === 'over') {
            this.overlay.setBanner(this.config.settings.gameoverText);

            this.sounds.backgroundMusic.pause();
            this.sounds.gameOverSound.play();
        }

        // draw the next screen
        if (this.state.current === 'over') {
            this.cancelFrame();
        } else {
            this.requestFrame(() => this.play());
        }
    }

    handleJump() {
        // only when in play
        if (this.state.current != 'play') {
            return;
        }
        
        // return if player already jumped
        if (this.player.y < this.screen.bottom - this.player.height) {
            return;
        }

        // jump
        let jump = (this.player.height * 0.75 ) / this.screen.scale;
        this.player.jump(jump);

        // play jump sound
        this.sounds.jumpSound.currentTime = 0;
        this.sounds.jumpSound.play();
    }

    // event listeners
    handleClicks(target) {
        if (this.state.current === 'loading') { return; }

        // mute
        if (target.id === 'mute') {
            this.mute();
        }

        // pause
        if (target.id === 'pause') {
            this.pause();
        }

        // button
        if (target.id === 'button') {
            this.setState({ current: 'play' });

            // if defaulting to have sound on by default
            // double mute() to warmup iphone audio here
            this.mute();
            this.mute();
        }

        // restart
        if (this.state.current === 'over') {
            this.load();
        }

    }

    handleKeyboardInput(type, code) {
        this.input.active = 'keyboard';

        if (type === 'keydown') {

            // spacebar when game in play: jump
            if (code === 'Space' && this.state.current === 'play') {

                // jump
                this.handleJump();
            }
        }

        if (type === 'keyup') {
            // spacebar when game over: restart
            if (code === 'Space' && this.state.current === 'over') {

                // restart
                this.load();
            }

            // spacebar when game start: play
            if (code === 'Space' && this.state.current === 'ready') {

                // start play
                this.setState({ current: 'play' });
            }
        }
    }

    handleResize() {

        document.location.reload();
    }

    // pause game
    pause() {
        if (this.state.current != 'play') { return; }

        this.state.paused = !this.state.paused;
        this.overlay.setPause(this.state.paused);

        if (this.state.paused) {
            // pause game loop
            this.cancelFrame(this.frame.count - 1);

            // mute all game sounds
            Object.keys(this.sounds).forEach((key) => {
                this.sounds[key].muted = true;
                this.sounds[key].pause();
            });

            this.overlay.setBanner('Paused');
        } else {
            // resume game loop
            this.requestFrame(() => this.play(), true);

            // resume game sounds if game not muted
            if (!this.state.muted) {
                Object.keys(this.sounds).forEach((key) => {
                    this.sounds[key].muted = false;
                    this.sounds.backgroundMusic.play();
                });
            }

            this.overlay.hide('banner');
        }
    }

    // mute game
    mute() {
        let key = 'game-muted';
        localStorage.setItem(
            key,
            localStorage.getItem(key) === 'true' ? 'false' : 'true'
        );
        this.state.muted = localStorage.getItem(key) === 'true';

        this.overlay.setMute(this.state.muted);

        if (this.state.muted) {
            // mute all game sounds
            Object.keys(this.sounds).forEach((key) => {
                this.sounds[key].muted = true;
                this.sounds[key].pause();
            });
        } else {
            // unmute all game sounds
            // and play background music
            // if game not paused
            if (!this.state.paused) {
                Object.keys(this.sounds).forEach((key) => {
                    this.sounds[key].muted = false;
                    this.sounds.backgroundMusic.play();
                });
            }
        }
    }

    // reset game
    reset() {
        document.location.reload();
    }

    // update game state
    setState(state) {
        this.state = {
            ...this.state,
            ...{ prev: this.state.current },
            ...state,
        };
    }

    // request new frame
    // wraps requestAnimationFrame.
    // see game/helpers/animationframe.js for more information
    requestFrame(next, resumed) {
        let now = Date.now();
        this.frame = {
            count: requestAnimationFrame(next),
            time: now,
            rate: resumed ? 0 : now - this.frame.time,
            scale: this.screen.scale * this.frame.rate * 0.01
        };
    }

    // cancel frame
    // wraps cancelAnimationFrame.
    // see game/helpers/animationframe.js for more information
    cancelFrame() {
        cancelAnimationFrame(this.frame.count);
    }
}

export default Game;