import { bricks, Brick, canvasWidth } from './canvas.js'

const hBrick = 20;
const columns = 11;
const gap = 25;

const levels = [
    {init: function() {
        const rows = 9;
        const bricsLineWidth = canvasWidth - gap * 2;
        const color = '#B2B1B9';
        for (let i = 0; i < columns; i++){
            for (let j = 0; j < rows; j++){
                if (j%2 != 1 && i !== 5){
                    const brick = new Brick(gap + i * bricsLineWidth / columns, j * hBrick + gap, bricsLineWidth/columns, hBrick, color);
                    bricks.push(brick);
                }
            }
        }
    }},
    {init: function() {
        const rows = 9;
        const bricsLineWidth = canvasWidth - gap * 2;
        const color = '#B2B1B9';
        for (let i = 0; i < columns; i++){
            for (let j = 0; j < rows; j++){
                if (j%2 != 1){
                    const brick = new Brick(gap + i * bricsLineWidth / columns, j * hBrick + gap, bricsLineWidth/columns, hBrick, color);
                    bricks.push(brick);
                }
            }
        }
    }},
];

export { levels };