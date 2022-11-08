import { bricks, Brick, wallElements, WallElement } from './canvas.js'

const hBrick = 20;
const columns = 11;
const gap = 25;

const levels = [
    {init: function() {
        const rows = 9;
        const bricsLineWidth = canvas.width - gap * 2;
        const color = '#FFC600';
        for (let i = 0; i < columns; i++){
            for (let j = 0; j < rows; j++){
                if (i !== 5){
                    const brick = new Brick(gap + i * bricsLineWidth / columns, j * hBrick + gap, bricsLineWidth/columns, hBrick, color, 1);
                    bricks.push(brick);
                }
            }
        }
    }},
    {init: function() {
        const rows = 9;
        const bricsLineWidth = canvas.width - gap * 2;
        const color1 = '#FFC600';
        const color2 = '#DA1212';
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++){
                if (j%2 != 1 && i !== 5) {
                    if (j !== rows - 1) {
                        const brick = new Brick(gap + i * bricsLineWidth / columns, j * hBrick + gap, bricsLineWidth/columns, hBrick, color1, 1);
                        bricks.push(brick);
                    }
                    else {
                        const brick = new Brick(gap + i * bricsLineWidth / columns, j * hBrick + gap, bricsLineWidth/columns, hBrick, color2, 2);
                        bricks.push(brick);
                    }
                }
            }
        }
    }},
    {init: function() {
        const rows = 10;
        const bricsLineWidth = canvas.width - gap * 2;
        const color = '#FFC600';
        for (let i = 0; i < columns; i++){
            for (let j = 0; j < rows; j++){
                if (i !== 5){
                    if (j !== rows - 1) {
                        const brick = new Brick(gap + i * bricsLineWidth / columns, j * hBrick + gap, bricsLineWidth/columns, hBrick, color, 1);
                        bricks.push(brick);
                    }
                    else {
                        const wallElement = new WallElement(gap + i * bricsLineWidth / columns, j * hBrick + gap, bricsLineWidth/columns, hBrick);
                        wallElements.push(wallElement);
                    }
                }
            }
        }
    }},
    {init: function() {
        const rows = 6;
        const bricsLineWidth = canvas.width - gap * 2;
        const color1 = '#FFC600';
        const color2 = '#DA1212';
        for (let i = 0; i < columns; i++){
            for (let j = 0; j < rows; j++){
                if ( i >= 5 - j && i <= 5 + j){
                    if (j + 1 !== rows) {
                        const brick = new Brick(gap + i * bricsLineWidth / columns, j * hBrick + gap, bricsLineWidth/columns, hBrick, color1, 1);
                        bricks.push(brick);
                    }
                    else {
                        const brick = new Brick(gap + i * bricsLineWidth / columns, j * hBrick + gap, bricsLineWidth/columns, hBrick, color2, 2);
                        bricks.push(brick);
                    }
                }
            }
        }
    }},
    {init: function() {
        const rows = 9;
        const bricsLineWidth = canvas.width - gap * 2;
        const color = '#FFC600';
        let k = 0;
        for (let i = 0; i < columns; i++){
            for (let j = 0; j < rows; j++){
                k++;
                if (j%2 != 1 && k%2 != 1){
                    const brick = new Brick(gap + i * bricsLineWidth / columns, j * hBrick + gap, bricsLineWidth/columns, hBrick, color, 1);
                    bricks.push(brick);
                }
                j++
            }
        }
    }},
];

export { levels };