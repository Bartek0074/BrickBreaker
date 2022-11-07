import { bricks, Brick, canvasWidth } from './canvas.js'

const hBrick = 12.5;
const columns = 60;
const gap = 25;

const levels = [
    // {init: function() {
    //     const rows = 21;
    //     const bricsLineWidth = canvasWidth - gap * 2;
    //     for (let i = 0; i < columns; i++){
    //         if (i === Math.floor((columns / 2)) - 1) i = Math.floor((columns / 2)) + 2;
    //         for (let j = 0; j < rows; j++){
    //             if (j === Math.floor((rows / 2)) - 1) j = Math.floor((rows / 2)) + 2;
    //             const brick = new Brick(gap + i * bricsLineWidth / columns, j * hBrick + gap, bricsLineWidth/columns, hBrick);
    //             bricks.push(brick);
    //         }
    //     }
    // }},
    {init: function() {
        const rows = 25;
        const bricsLineWidth = canvasWidth - gap * 2;
        for (let i = 0; i < columns; i++){
            for (let j = 0; j < rows; j++){
                if (j === Math.floor(i / 3) + 2) j += 2;
                if (j < rows){
                    const brick = new Brick(gap + i * bricsLineWidth / columns, j * hBrick + gap, bricsLineWidth/columns, hBrick);
                    bricks.push(brick);
                }
            }
        }
    }}
];

export { levels };