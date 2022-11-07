// Initial setup
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const livesText = document.querySelector('.lives')
const levelText = document.querySelector('.level')

canvas.width = 650;
canvas.height = 500;

// Variables
let lives = 3;
let level = 1;

let keys = {
    arrowLeft: false,
    arrowRight: false
}

const wPaddle = 80;
const hPaddle = 5;
const paddleVelocity = 7.5;
const radiusBall = 5;
const wExtras = 15;
const hExtras = 20;
const ballVelocity = 7.5;
const extrasVelocity = 3;
let isGameStarted = false;
let isGamePaused = false;
let isLose = false;

// Utility functions
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function controlPaddle() {
    if (keys.arrowLeft === true && keys.arrowRight === false) paddle.dx = -paddleVelocity;
    else if (keys.arrowLeft === false && keys.arrowRight === true) paddle.dx = paddleVelocity;
    else paddle.dx = 0;
}

function updateInfoGame() {
    livesText.textContent = `LIVES: ${lives}`;
    levelText.textContent = `LEVEL: ${level}`;
}

function initInstruction() {
    ctx.fillStyle = "#003300";
    ctx.font = "24px Gill Sans";
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
    ctx.fillStyle = "#003300";
    ctx.font = "24px Gill Sans";
    const textString = "YOU LOSE!",
    textWidth = ctx.measureText(textString ).width; 
    ctx.fillText(textString , (canvas.width/2) - (textWidth / 2), canvas.height/2 - 30);

    const textString2 = "CLICK ENTER TO PLAY AGAIN",
    textWidth2 = ctx.measureText(textString2).width; 
    ctx.fillText(textString2 , (canvas.width/2) - (textWidth2 / 2), canvas.height/2 + 30);
}

function initLevelUpText() {
    ctx.fillStyle = "#003300";
    ctx.font = "24px Gill Sans";
    const textString = "LEVEL UP!",
    textWidth = ctx.measureText(textString ).width; 
    ctx.fillText(textString , (canvas.width/2) - (textWidth / 2), canvas.height/2 - 30);

    const textString2 = "CLICK ENTER TO PLAY AGAIN",
    textWidth2 = ctx.measureText(textString2).width; 
    ctx.fillText(textString2 , (canvas.width/2) - (textWidth2 / 2), canvas.height/2 + 30);
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
            ctx.fillStyle = '#66c2a5';
            ctx.fill();
            ctx.closePath();
        }

        this.update = function() {
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
        let angle;
        this.dx = Math.cos(this.angle * (Math.PI / 180)) * this.velocity;
        this.dy = Math.sin(this.angle * (Math.PI / 180)) * this.velocity;

        this.isBallMoved = isBallMoved;

        this.updateVelocity = function() {
            this.dx = Math.cos(this.angle * (Math.PI / 180)) * this.velocity;
            this.dy = Math.sin(this.angle * (Math.PI / 180)) * this.velocity;
        }

        this.draw = function() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = '#f46d43';
            ctx.fill();
            ctx.closePath();
        }

        this.update = function() {
            if (this.isBallMoved){
                // collision between walls and ball
                if(this.y - this.radius <= 0) {
                    this.dy = -this.dy;
                }
                if(this.x - this.radius <= 0 || this.x + this.radius >= canvas.width) {
                    this.dx = -this.dx;
                }

                // collision between paddle and ball
                if (this.y + this.dy + this.radius > paddle.y && 
                    this.x >= paddle.x &&
                    this.x <= paddle.x + paddle.w) {
                    this.dy = -this.dy;
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

                // collision between bricks and ball
                for (let i = 0; i < bricks.length; i++) {
                    const distX = Math.abs(this.x - bricks[i].x - (bricks[i].w / 2));
                    const distY = Math.abs(this.y - bricks[i].y - (bricks[i].h / 2));

                    if (distX <= this.radius + (bricks[i].w / 2) &&
                    distY <= this.radius + (bricks[i].h / 2)
                    ) {
                        // chance of dropping extras
                        const chance = Math.random()

                        if (chance < 0.065) {
                            const extras = new Extras(this.x, this.y, '+3', '#5e4fa2');
                            extrases.push(extras);
                        }
                        else if (chance < 0.1) {
                            const extras = new Extras(this.x, this.y, 'x3', '#9e0142');
                            extrases.push(extras);
                        }

                        
                        if (this.x >= bricks[i].x && this.x <= bricks[i].x + bricks[i].w) {
                            this.dy = -this.dy;
                            bricks.splice(i, 1);
                        }
                        else if (this.y >= bricks[i].y && this.y <= bricks[i].y + bricks[i].h) {
                            this.dx = -this.dx;
                            bricks.splice(i, 1);
                        }
                    }
                }
                

                for (let i = 0; i < balls.length; i++) {
                    // miss ball
                    if(balls[i].y - balls[i].radius >= canvas.height) {
                        balls.splice(i, 1);

                        if (balls.length === 0) {
                            const ball = new Ball(paddle.x + paddle.w/2, paddle.y - radiusBall, ballVelocity, radiusBall, false);
                            balls.push(ball);
                            extrases = [];
                            lives--;
                            updateInfoGame();
                        }
                    }
                    
                }

                this.y += this.dy;
                this.x += this.dx;
            }
            else {
                this.x = paddle.x + paddle.w/2;
                this.y = paddle.y - radiusBall;
                this.angle = (this.x / canvas.width) * 180 + 180;
                if (this.angle === 270) this.angle = 270.1;
                this.updateVelocity();
            }
            this.draw();
        }
    }
}

class Brick {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.draw = function() {
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = '#3288bd';
            ctx.fill();
            ctx.strokeStyle = 'rgba(209, 209, 209, 1)';
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
        this.w = wExtras;
        this.h = hExtras;
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
            ctx.font = "12px sans-serif";
            ctx.fillStyle = '#eee'
            ctx.fillText(this.type, this.x, this.y + 4); 
            ctx.closePath();
        }

        this.update = function() {
            for (let i = 0; i < extrases.length; i++) {
                // miss extras
                if (extrases[i].y + this.dy - hExtras / 2 >= canvas.height) {
                    extrases.splice(i, 1);
                }

                // collect extras
                else if (extrases[i].y + extrases[i].dy + extrases[i].h / 2 >= paddle.y &&
                    extrases[i].x + extrases[i].w + extrases[i].h / 2 >= paddle.x &&
                    extrases[i].x - extrases[i].h <= paddle.x + paddle.w) {
                        if (extrases[i].type === '+3'){
                            for (let i = 0; i < 3; i++){
                                const newBall = new Ball(paddle.x + paddle.w/2, paddle.y - radiusBall, ballVelocity, radiusBall, true);
                                const newAngle = randomIntFromRange(220, 320)
                                newBall.dx = Math.cos(newAngle * (Math.PI / 180)) * ballVelocity;
                                newBall.dy = Math.sin(newAngle * (Math.PI / 180)) * ballVelocity;
                                balls.push(newBall); 
                            }
                        }
                        if (extrases[i].type === 'x3'){
                            balls.forEach(ball => {
                                for (let i = 0; i < 2; i++){
                                    const newBall = new Ball(ball.x, ball.y, ballVelocity, radiusBall, true);
                                    const newAngle = randomIntFromRange(220, 320)
                                    newBall.dx = Math.cos(newAngle * (Math.PI / 180)) * ballVelocity;
                                    newBall.dy = Math.sin(newAngle * (Math.PI / 180)) * ballVelocity;
                                    balls.push(newBall); 
                                }
                            })
                        }
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
let extrases = [];

function initBall() {
    const newBall = new Ball(12, 12, 5, 5, true);
    const angle = randomIntFromRange(100, 120)
    newBall.dx = Math.cos(angle * (Math.PI / 180)) * ballVelocity;
    newBall.dy = Math.sin(angle * (Math.PI / 180)) * ballVelocity;
    balls.push(newBall);
    
}

function init() {
    balls = [];
    bricks = [];
    extrases = [];

    paddle = new Paddle(canvas.width/2 - wPaddle/2, canvas.height - hPaddle * 2, wPaddle, hPaddle);

    const ball = new Ball(paddle.x + paddle.w/2, paddle.y - radiusBall, ballVelocity, radiusBall, false);
    balls.push(ball);
 
    const gap = 25;
    const hBrick = 20;
    const rows = 8;
    const columns = 12;
    const bricsLineWidth = canvas.width - gap * 2;
    for (let i = 0; i < columns; i++){
        for (let j = 0; j < rows; j++){
            const brick = new Brick(gap + i * bricsLineWidth / columns, j * hBrick + gap, bricsLineWidth/columns, hBrick);
            bricks.push(brick);
        }
    }
}

// Animation loop
let req;
function animate() {
    if (lives !== 0 && bricks.length !== 0) {
        req = requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        paddle.update();
        balls.forEach(ball => {
            ball.update();
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
    }
}

// Event listeners
window.addEventListener('keydown', e => {
    if (e.code === 'ArrowLeft') keys.arrowLeft = true;
    if (e.code === 'ArrowRight') keys.arrowRight = true;
    if (e.code  === 'Space' && isGameStarted === true) balls[0].isBallMoved = true;
    if (e.code  === 'Enter' && isGameStarted === false) startGame();
    if (e.code  === 'KeyP' && isGameStarted === true && isGamePaused === false) pauseGame();
    else if (e.code  === 'KeyP' && isGameStarted === true && isGamePaused === true) resumeGame();
    
    controlPaddle();
})

window.addEventListener('keyup', e => {
    if (e.code === 'ArrowLeft') keys.arrowLeft = false;
    if (e.code === 'ArrowRight') keys.arrowRight = false;
    controlPaddle();
})

// Start, stop game function

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
    level++;
    isGameStarted = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    initLevelUpText();
}

initInstruction();