const prompt = require('prompt-sync')({ sigint: true });
const chalk = require('chalk');

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

let foundTheHat = false;

class Field {
    constructor(field) {
        this.field = field;
        this.playerPosition = [0, 0];
        this.hatPosition = [0, 0];
        this.hard = false;
        this.turn = 0;
        this.fieldHeight = 0;
        this.fieldWidth = 0;
    }

    print() {
        console.clear();
        console.log(
            this.field.map(row => row.map(cell => {
                if (cell === pathCharacter) {
                    return chalk.yellow(cell);
                } else if (cell === hat) {
                    return chalk.green(cell);
                } else {
                    return chalk.blue(cell);
                }
            }).join('')).join('\n')
        );
    }

    move(userMove) {
        const [x, y] = this.playerPosition;
        const [w, h] = this.hatPosition;
        let newX = x;
        let newY = y;

        // Cases 
        switch (userMove) {
            case 'u': newX -= 1; break;
            case 'd': newX += 1; break;
            case 'r': newY += 1; break;
            case 'l': newY -= 1; break;
            default:
                console.error('Invalid Move! Type: "u" (up), "d" (down), "r" (right) or "l" (left)');
                return;
        }

        // Logic in case the user move is out of Bounds
        if (newX < 0 || newY < 0 || newX >= this.field.length || newY >= this.field[0].length) {
            console.error('Out of bounds!');
            return;
        }

        // Logic for losing and winning
        const newCell = this.field[newX][newY];
        if (newCell === hole) {
            console.clear();
            console.log(chalk.red("You fell into a hole! Game Over!"));
            process.exit();
        } else if (newCell === hat) {
            console.clear();
            console.log(chalk.green('You found the hat! You win!'))
            process.exit();
        }

        if (this.hard) {
            if (this.turn > 0 && this.turn % 10 === 0) {
                this.field = Array.from({ length: this.fieldHeight }, () => Array(this.fieldWidth).fill(fieldCharacter));
                this.field.forEach((row, rowIndex) => {
                    row.forEach((cell, colIndex) => {
                        if (Math.random() < 0.2) {
                            this.field[rowIndex][colIndex] = hole;
                        }
                    });
                });

            }
        }

        // Results of next Move
        this.field[x][y] = fieldCharacter;
        this.field[newX][newY] = pathCharacter;
        this.playerPosition = [newX, newY];
        this.field[w][h] = hat
        this.turn += 1;

        this.print();
        console.log(chalk.gray("Current Turn:", this.turn));
    }

    generateField(height, width) {

        this.fieldHeight = height;
        this.fieldWidth = width;

        this.field = Array.from({ length: height }, () => Array(width).fill(fieldCharacter));
        this.field.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (Math.random() < 0.2) {
                    this.field[rowIndex][colIndex] = hole; 
                }
            });
        });

        const randomHeight = Math.floor(Math.random() * height)
        const randomWidth = Math.floor(Math.random() * width)

        const randomHeightCharacter = Math.floor(Math.random() * height)
        const randomWidthCharacter = Math.floor(Math.random() * width)

        this.field[randomHeight][randomWidth] = hat;
        this.hatPosition = [randomHeight, randomWidth];

        this.field[randomHeightCharacter][randomWidthCharacter] = pathCharacter;
        this.playerPosition = [randomHeightCharacter, randomWidthCharacter];

        this.print();
        console.log(chalk.gray("Current Turn:", this.turn));
    }

    hardMode(userInput) {
        if (userInput === 'y') {
            this.hard = true;
        } else {
            return;
        }
    }

}

const myField = new Field([

]);

let hardModePrompt = prompt('Enable Hard Mode? (y / n): ')

myField.hardMode(hardModePrompt);

let heightPrompt = prompt('Choose the field Height: ');
let widthPrompt = prompt('Choose the field Width: ')

let height = parseInt(heightPrompt);
let width = parseInt(widthPrompt);

myField.generateField(height, width);

while (!foundTheHat) {
    let movePrompt = prompt('Make a move (u, d ,r, l): ');

    myField.move(movePrompt);
}