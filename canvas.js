// Initial setup
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

canvas.width = 350;
canvas.height = 450;

// Variables
let keys = {
    arrowLeft: false,
    arrowRight: false
}
const wPaddle = 75;
const hPaddle = 5;
const paddleVelocity = 5;
const radiusBall = 5;
const ballVelocity = 5;
let isStarted = false;

// Utility functions
function controlPaddle() {
    if (keys.arrowLeft === true && keys.arrowRight === false) paddle.dx = -paddleVelocity;
    else if (keys.arrowLeft === false && keys.arrowRight === true) paddle.dx = paddleVelocity;
    else paddle.dx = 0;
}

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
            ctx.fillStyle = '#B42B51';
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
    constructor(x, y, velocity, angle, radius){
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.angle = angle;
        this.dx = Math.cos(this.angle * (Math.PI / 180)) * this.velocity;
        this.dy = Math.sin(this.angle * (Math.PI / 180)) * this.velocity;
        this.radius = radius;

        this.updateVelocity = function() {
            this.dx = Math.cos(this.angle * (Math.PI / 180)) * this.velocity;
            this.dy = Math.sin(this.angle * (Math.PI / 180)) * this.velocity;
        }

        this.draw = function() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = 'royalblue';
            ctx.fill();
            ctx.closePath();
        }

        this.update = function() {
            if (isStarted){
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
                
                // lose case
                if(this.y - this.radius >= canvas.height) {
                    this.dx = 0;
                    this.dy = 0;
                    this.x = paddle.x + paddle.w/2;
                    this.y = paddle.y - radiusBall;
                    isStarted = false;
                }

                this.y += this.dy;
                this.x += this.dx;
            }
            else {
                this.x = paddle.x + paddle.w/2;
                this.y = paddle.y - radiusBall;
                this.angle = (this.x / canvas.width) * 180 + 180;
                this.updateVelocity();
            }
            this.draw();
        }
    }
}

class Brick {
    constructor(x, y, w, h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.draw = function() {
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = '#B42B51';
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

// Implementation
let paddle;
let ball;
let bricks = [];

function init() {
    bricks = [];
    paddle = new Paddle(canvas.width/2 - wPaddle/2, canvas.height - hPaddle * 2, wPaddle, hPaddle);
    ball = new Ball(paddle.x + paddle.w/2, paddle.y - radiusBall, ballVelocity, 270, radiusBall);
    
    const gap = 15;
    const hBrick = 15;
    const rows = 10;
    const columns = 10;
    const bricsLineWidth = canvas.width - gap * 2;
    for (let i = 0; i < columns; i++){
        for (let j = 0; j < rows; j++){
            const brick = new Brick(gap + i * bricsLineWidth / columns, j * hBrick + gap, bricsLineWidth/columns, hBrick);
            bricks.push(brick);
        }
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paddle.update();
    ball.update();
    bricks.forEach(brick => {
        brick.update();
    })
}

// Event listeners
window.addEventListener('keydown', e => {
    if (e.code === 'ArrowLeft') keys.arrowLeft = true;
    if (e.code === 'ArrowRight') keys.arrowRight = true;
    if (e.code  === 'Space') isStarted = true;
    controlPaddle();
})

window.addEventListener('keyup', e => {
    if (e.code === 'ArrowLeft') keys.arrowLeft = false;
    if (e.code === 'ArrowRight') keys.arrowRight = false;
    controlPaddle();
})

// Start game function

function startGame() {
    init();
    animate();
}

startGame();