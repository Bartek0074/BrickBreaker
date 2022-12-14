// Import
import { levels } from './levels.js'

// Initial setup
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

canvas.width = 650;
canvas.height = 500;


// Importing DOM elements
const livesText = document.querySelector('.lives')
const levelText = document.querySelector('.level')


// Variables
let lives = 3;
let level = 1;

let keys = {
    arrowLeft: false,
    arrowRight: false
}

const paddleWidth = 100;
const paddleHeight = 5;
const paddleVelocity = 8.5;
const paddleColor = '#F14A16CC';

const ballRadius = 4.5;
const ballVelocity = 7.5;
const ballColor = '#FC9918';

const extrasWidth = 15;
const extrasHeight = 20;
const extrasVelocity = 3;
const extrasFirstColor = '#115173';
const extrasSecondColor = '#6D9886';

let isGameStarted = false;
let isGamePaused = false;
let isLose = false;


// Utility functions
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


// Classes
class Paddle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.w = w;
        this.h = h;

        this.draw = function() {
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = paddleColor;
            ctx.fill();
            ctx.closePath();
        }

        this.update = function() {
            // setting paddle range
            if (this.x + this.dx >= 0 && this.x + this.w + this.dx < canvas.width) {
                this.x += this.dx
            }
            this.draw();
        };
    }
}

class Ball {
    constructor(x, y, velocity, radius, isBallMoved){
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.radius = radius;
        this.isBallMoved = isBallMoved;

        let angle;
        this.dx = Math.cos(this.angle * (Math.PI / 180)) * this.velocity;
        this.dy = Math.sin(this.angle * (Math.PI / 180)) * this.velocity;

        // updating x-axis and y-axis velocities (only angle changes)
        this.updateVelocity = function() {
            this.dx = Math.cos(this.angle * (Math.PI / 180)) * this.velocity;
            this.dy = Math.sin(this.angle * (Math.PI / 180)) * this.velocity;
        }

        this.draw = function() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = ballColor;
            ctx.fill();
            ctx.closePath();
        }

        this.update = function() {
            // ball kicked from paddle case
            if (this.isBallMoved){

                // collision between ball and walls
                if(this.y - this.radius <= 0) {
                    this.dy = -this.dy;
                }
                if(this.x - this.radius <= 0 || this.x + this.radius >= canvas.width) {
                    this.dx = -this.dx;
                }

                // collision between ball and paddle
                if (this.y + this.dy + this.radius > paddle.y && 
                    this.x >= paddle.x &&
                    this.x <= paddle.x + paddle.w) {
                    this.dy = -this.dy;
                    
                    // setting new angle dependent on distance between ball and center of paddle
                    let distanceFromCenter = this.x - paddle.x - (paddle.w / 2);
                    if (distanceFromCenter > 0) {
                        this.angle = (distanceFromCenter / (paddle.w / 2) * 60 + 270);
                        this.updateVelocity();
                    }
                    else if (distanceFromCenter < 0) {
                        distanceFromCenter = -distanceFromCenter;
                        this.angle = (270 - distanceFromCenter / (paddle.w / 2) * 60);
                        this.updateVelocity();
                    }
                }

                // collision between ball and bricks
                for (let i = 0; i < bricks.length; i++) {
                    const distX = Math.abs(this.x - bricks[i].x - (bricks[i].w / 2));
                    const distY = Math.abs(this.y - bricks[i].y - (bricks[i].h / 2));

                    if (distX <= this.radius + (bricks[i].w / 2) &&
                    distY <= this.radius + (bricks[i].h / 2)
                    ) {
                        // chance of dropping extras
                        const chance = Math.random()

                        // collision on the sides
                        if (this.x >= bricks[i].x && this.x <= bricks[i].x + bricks[i].w) {
                            this.dy = -this.dy;
                            // reducing brick live
                            bricks[i].lives--;

                            // checking if brick is destroyed, then removing brick from array and
                            // checking chances of pushing extras
                            if (bricks[i].lives === 0) {
                                bricks.splice(i, 1);
                                if (chance < 0.06) {
                                    const extras = new Extras(this.x, this.y, '+3', extrasSecondColor);
                                    extrases.push(extras);
                                }
                                else if (chance < 0.09 && balls.length <= 250 && extrases.length <=5) {
                                    const extras = new Extras(this.x, this.y, 'x3', extrasFirstColor);
                                    extrases.push(extras);
                                }
                            }

                            // changing alpha of brick
                            else if (bricks[i].lives === 1) {
                                bricks[i].color += '88';
                            }
                        }

                        // collision on top or bottom
                        else if (this.y >= bricks[i].y && this.y <= bricks[i].y + bricks[i].h) {
                            this.dx = -this.dx;
                            // reducing brick live
                            bricks[i].lives--;

                            // checking if brick is destroyed, then removing brick from array and
                            // checking chances of pushing extras                            
                            if (bricks[i].lives === 0) {
                                bricks.splice(i, 1);
                                if (chance < 0.06) {
                                    const extras = new Extras(this.x, this.y, '+3', extrasSecondColor);
                                    extrases.push(extras);
                                }
                                else if (chance < 0.09 && balls.length <= 250 && extrases.length <=5) {
                                    const extras = new Extras(this.x, this.y, 'x3', extrasFirstColor);
                                    extrases.push(extras);
                                }
                            }

                            // changing alpha of brick
                            else if (bricks[i].lives === 1) {
                                bricks[i].color += '88';
                            }                        
                        }
                    }
                }
                
                // collision between ball and wall
                for (let i = 0; i < wallElements.length; i++) {
                    const distX = Math.abs(this.x - wallElements[i].x - (wallElements[i].w / 2));
                    const distY = Math.abs(this.y - wallElements[i].y - (wallElements[i].h / 2));

                    if (distX <= this.radius + (wallElements[i].w / 2) &&
                    distY <= this.radius + (wallElements[i].h / 2)
                    ) {
                        if (this.x >= wallElements[i].x && this.x <= wallElements[i].x + wallElements[i].w) {
                            this.dy = -this.dy;
                        }
                        else if (this.y >= wallElements[i].y && this.y <= wallElements[i].y + wallElements[i].h) {
                            this.dx = -this.dx;
                        }
                    }
                }

                // miss ball
                for (let i = 0; i < balls.length; i++) {
                    if(balls[i].y - balls[i].radius >= canvas.height) {
                        // removing ball from array
                        balls.splice(i, 1);

                        // lose live case
                        if (balls.length === 0) {
                            const ball = new Ball(paddle.x + paddle.w/2, paddle.y - ballRadius, ballVelocity, ballRadius, false);
                            balls.push(ball);
                            extrases = [];
                            lives--;
                            updateInfoGame();
                        }
                    }
                    
                }

                // updating position
                this.y += this.dy;
                this.x += this.dx;
            }

            // ball sticked to the paddle case
            else {
                this.x = paddle.x + paddle.w/2;
                this.y = paddle.y - ballRadius;
                this.angle = (this.x / canvas.width) * 180 + 180;
                if (this.angle === 270) this.angle = 270.1;
                this.updateVelocity();
            }

            this.draw();
        }
    }
}

class Brick {
    constructor(x, y, w, h, color, lives) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        this.lives = lives;

        this.draw = function() {
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.strokeStyle = '#142F43';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();
        }

        this.update = function() {

            this.draw();
        }
    }
}

class WallElement {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.draw = function() {
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = '#B2B1B9';
            ctx.fill();
            ctx.strokeStyle = '#142F43';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();
        }

        this.update = function() {

            this.draw();
        }
    }
}

class Extras{
    constructor(x, y, type, color) {
        this.x = x;
        this.y = y
        this.w = extrasWidth;
        this.h = extrasHeight;
        this.dy = extrasVelocity;
        this.type = type;
        this.color = color;

        this.draw = function() {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.w, this.y);
            ctx.lineWidth = this.h;
            ctx.lineCap = 'round';
            ctx.strokeStyle = this.color;
            ctx.stroke();
            ctx.font = "12px Tahoma";
            ctx.fillStyle = '#EEE'
            ctx.fillText(this.type, this.x, this.y + 4); 
            ctx.closePath();
        }

        this.update = function() {
            for (let i = 0; i < extrases.length; i++) {
                // miss extras case
                if (extrases[i].y + this.dy - extrasHeight / 2 >= canvas.height) {
                    // removing extras from array
                    extrases.splice(i, 1);
                }

                // collect extras case
                else if (extrases[i].y + extrases[i].dy + extrases[i].h / 2 >= paddle.y &&
                    extrases[i].x + extrases[i].w + extrases[i].h / 2 >= paddle.x &&
                    extrases[i].x - extrases[i].h <= paddle.x + paddle.w) {
                        // extras that adds 3 more balls from the paddle
                        if (extrases[i].type === '+3'){
                            for (let i = 0; i < 3; i++){
                                const newBall = new Ball(paddle.x + paddle.w/2, paddle.y - ballRadius, ballVelocity, ballRadius, true);
                                const newAngle = randomIntFromRange(220, 320)
                                newBall.dx = Math.cos(newAngle * (Math.PI / 180)) * ballVelocity;
                                newBall.dy = Math.sin(newAngle * (Math.PI / 180)) * ballVelocity;
                                balls.push(newBall); 
                            }
                        }
                        // extras that multiplies every ball by 3
                        if (extrases[i].type === 'x3'){
                            balls.forEach(ball => {
                                for (let i = 0; i < 2; i++){
                                    const newBall = new Ball(ball.x, ball.y, ballVelocity, ballRadius, true);
                                    const newAngle = randomIntFromRange(220, 320)
                                    newBall.dx = Math.cos(newAngle * (Math.PI / 180)) * ballVelocity;
                                    newBall.dy = Math.sin(newAngle * (Math.PI / 180)) * ballVelocity;
                                    balls.push(newBall); 
                                }
                            })
                        }
                        // removing extras from array
                        extrases.splice(i, 1);
                }
            }

            this.y += this.dy; 

            this.draw();
        }
    }
}

// Implementation
let paddle;
let balls = [];
let bricks = [];
let wallElements = [];
let extrases = [];

function init() {
    balls = [];
    bricks = [];
    wallElements = [];
    extrases = [];

    paddle = new Paddle(canvas.width/2 - paddleWidth/2, canvas.height - paddleHeight * 2, paddleWidth, paddleHeight);

    const ball = new Ball(paddle.x + paddle.w/2, paddle.y - ballRadius, ballVelocity, ballRadius, false);
    balls.push(ball);
 
    initLevel(level);
}

// Animation loop
let req;
function animate() {
    if (lives !== 0 && bricks.length !== 0) {
        req = requestAnimationFrame(animate);
        ctx.fillStyle = 'rgba(20, 47, 67, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        paddle.update();
        balls.forEach(ball => {
            ball.update();
        })
        wallElements.forEach(wallElement => {
            wallElement.update();
        })
        bricks.forEach(brick => {
            brick.update();
        })
        extrases.forEach(extras => {
            extras.update();
        })
    }
    else if (lives !== 0 && bricks.length === 0) {
        levelUp();
    }
    else {
        stopGame();
        isLose = true;
        level = 1;
    }
}


// Game functions
function controlPaddle() {
    if (keys.arrowLeft === true && keys.arrowRight === false) paddle.dx = -paddleVelocity;
    else if (keys.arrowLeft === false && keys.arrowRight === true) paddle.dx = paddleVelocity;
    else paddle.dx = 0;
}

function updateInfoGame() {
    livesText.textContent = `LIVES: ${lives}`;
    levelText.textContent = `LEVEL: ${level}/${levels.length}`;
}

function initInstruction() {
    ctx.fillStyle = "#FAEDF0";
    ctx.font = "26px Gill Sans";
    const textString = "SPACEBAR - SET BALL IN MOVEMENT",
    textWidth = ctx.measureText(textString ).width; 
    ctx.fillText(textString , (canvas.width/2) - (textWidth / 2), canvas.height/5);

    const textString2 = "ARROWS - MOVE PADDLE",
    textWidth2 = ctx.measureText(textString2).width; 
    ctx.fillText(textString2 , (canvas.width/2) - (textWidth2 / 2), (canvas.height * 2)/5);
    
    const textString3 = "P - PAUSE THE GAME",
    textWidth3 = ctx.measureText(textString3).width; 
    ctx.fillText(textString3 , (canvas.width/2) - (textWidth3 / 2), (canvas.height * 3)/5);

    const textString4 = "ENTER - START THE GAME",
    textWidth4 = ctx.measureText(textString4).width; 
    ctx.fillText(textString4 , (canvas.width/2) - (textWidth4 / 2), (canvas.height * 4)/5);
}

function initLoseText() {
    ctx.fillStyle = "#FAEDF0";
    ctx.font = "36px Gill Sans";
    const textString = "YOU LOSE!",
    textWidth = ctx.measureText(textString ).width; 
    ctx.fillText(textString , (canvas.width/2) - (textWidth / 2), canvas.height / 3);

    ctx.font = "32px Gill Sans";
    const textString2 = "CLICK ENTER TO PLAY AGAIN",
    textWidth2 = ctx.measureText(textString2).width; 
    ctx.fillText(textString2 , (canvas.width/2) - (textWidth2 / 2), (canvas.height * 2) / 3);
}

function initWonText() {
    ctx.fillStyle = "#FAEDF0";
    ctx.font = "36px Gill Sans";
    const textString = "CONGRATULATIONS!!!",
    textWidth = ctx.measureText(textString ).width; 
    ctx.fillText(textString , (canvas.width/2) - (textWidth / 2), canvas.height/3);

    const textString2 = "YOU WON!!!",
    textWidth2 = ctx.measureText(textString2).width; 
    ctx.fillText(textString2 , (canvas.width/2) - (textWidth2 / 2), (canvas.height * 2) / 3);
}

function initLevelUpText() {
    ctx.fillStyle = "#FAEDF0";
    ctx.font = "36px Gill Sans";
    const textString = "LEVEL UP!",
    textWidth = ctx.measureText(textString ).width; 
    ctx.fillText(textString , (canvas.width/2) - (textWidth / 2), canvas.height/3);
    
    ctx.font = "32px Gill Sans";
    const textString2 = "CLICK ENTER TO CONTINUE",
    textWidth2 = ctx.measureText(textString2).width; 
    ctx.fillText(textString2 , (canvas.width/2) - (textWidth2 / 2), (canvas.height * 2) / 3);
}

function initLevel(lvl) {
    levels[lvl - 1].init();
}

// Start, pause, stop, levelUp functions

function startGame() {
    if (isLose) lives = 3;
    updateInfoGame();
    isGameStarted = true;
    init();
    animate();
}

function pauseGame() {
    cancelAnimationFrame(req);
    isGamePaused = true;
}

function resumeGame() {
    requestAnimationFrame(animate);
    isGamePaused = false;
}

function stopGame() {
    isGameStarted = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    initLoseText();
}

function levelUp() {
    if (level >= levels.length) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        initWonText();
    }
    else {
        level++;
        isGameStarted = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        initLevelUpText();
    }
    keys.arrowLeft = false;
    keys.arrowRight = false;
}


// Function calls
initInstruction();
updateInfoGame();


// Event listeners
window.addEventListener('keydown', e => {
    if (e.code === 'ArrowLeft' && isGameStarted === true) keys.arrowLeft = true;
    if (e.code === 'ArrowRight' && isGameStarted === true) keys.arrowRight = true;
    if (e.code  === 'Space' && isGameStarted === true) balls[0].isBallMoved = true;
    if (e.code  === 'Enter' && isGameStarted === false) startGame();
    if (e.code  === 'KeyP' && isGameStarted === true && isGamePaused === false) pauseGame();
    else if (e.code  === 'KeyP' && isGameStarted === true && isGamePaused === true) resumeGame();
    
    if (isGameStarted === true) controlPaddle();
})

window.addEventListener('keyup', e => {
    if (e.code === 'ArrowLeft' && isGameStarted === true) keys.arrowLeft = false;
    if (e.code === 'ArrowRight' && isGameStarted === true) keys.arrowRight = false;

    if (isGameStarted === true) controlPaddle();
})


// Export
export { bricks, Brick, wallElements, WallElement };