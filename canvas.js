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
const paddleSpeed = 5;

// Utility functions
function controlPaddle() {
    if (keys.arrowLeft === true && keys.arrowRight === false) paddle.dx = -paddleSpeed;
    else if (keys.arrowLeft === false && keys.arrowRight === true) paddle.dx = paddleSpeed;
    else paddle.dx = 0;
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
            ctx.fillStyle = 'royalblue';
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

// Implementation
let paddle;

function init() {
    paddle = new Paddle(canvas.width/2 - wPaddle/2, canvas.height - hPaddle * 2, wPaddle, hPaddle);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paddle.update();
}

// Event listeners
window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') keys.arrowLeft = true;
    if (e.key === 'ArrowRight') keys.arrowRight = true;
    controlPaddle();
})

window.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft') keys.arrowLeft = false;
    if (e.key === 'ArrowRight') keys.arrowRight = false;
    controlPaddle();
})

// Start game function

function startGame() {
    init();
    animate();
}

startGame();