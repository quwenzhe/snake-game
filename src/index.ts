// Snake Game - TypeScript Implementation

const GRID_WIDTH = 20;
const GRID_HEIGHT = 15;
const SNAKE_CHAR = 'O';
const FOOD_CHAR = '*';
const EMPTY_CHAR = '.';

type Direction = 'up' | 'down' | 'left' | 'right';
type Position = { x: number; y: number };

class SnakeGame {
  private snake: Position[] = [];
  private food: Position = { x: 0, y: 0 };
  private direction: Direction = 'right';
  private gameOver: boolean = false;
  private score: number = 0;

  constructor() {
    this.initializeSnake();
    this.placeFood();
  }

  private initializeSnake(): void {
    const startX = Math.floor(GRID_WIDTH / 4);
    const startY = Math.floor(GRID_HEIGHT / 2);
    this.snake = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY },
    ];
    this.direction = 'right';
  }

  private placeFood(): void {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT),
      };
    } while (this.isSnakePosition(newFood));
    this.food = newFood;
  }

  private isSnakePosition(pos: Position): boolean {
    return this.snake.some(s => s.x === pos.x && s.y === pos.y);
  }

  private getNextHead(): Position {
    const head = this.snake[0];
    switch (this.direction) {
      case 'up': return { x: head.x, y: head.y - 1 };
      case 'down': return { x: head.x, y: head.y + 1 };
      case 'left': return { x: head.x - 1, y: head.y };
      case 'right': return { x: head.x + 1, y: head.y };
    }
  }

  public move(): void {
    if (this.gameOver) return;

    const newHead = this.getNextHead();

    // Check wall collision
    if (newHead.x < 0 || newHead.x >= GRID_WIDTH ||
        newHead.y < 0 || newHead.y >= GRID_HEIGHT) {
      this.gameOver = true;
      return;
    }

    // Check self collision
    if (this.isSnakePosition(newHead)) {
      this.gameOver = true;
      return;
    }

    this.snake.unshift(newHead);

    // Check food collision
    if (newHead.x === this.food.x && newHead.y === this.food.y) {
      this.score++;
      this.placeFood();
    } else {
      this.snake.pop();
    }
  }

  public setDirection(dir: Direction): void {
    const opposites: Record<Direction, Direction> = {
      up: 'down', down: 'up', left: 'right', right: 'left'
    };
    if (opposites[dir] !== this.direction) {
      this.direction = dir;
    }
  }

  public isGameOver(): boolean {
    return this.gameOver;
  }

  public getScore(): number {
    return this.score;
  }

  public render(): string {
    const grid: string[][] = [];
    for (let y = 0; y < GRID_HEIGHT; y++) {
      grid[y] = [];
      for (let x = 0; x < GRID_WIDTH; x++) {
        grid[y][x] = EMPTY_CHAR;
      }
    }

    // Place food
    grid[this.food.y][this.food.x] = FOOD_CHAR;

    // Place snake
    for (const pos of this.snake) {
      grid[pos.y][pos.x] = SNAKE_CHAR;
    }

    let output = `Score: ${this.score}\n`;
    output += '+' + '-'.repeat(GRID_WIDTH) + '+\n';
    for (const row of grid) {
      output += '|' + row.join('') + '|\n';
    }
    output += '+' + '-'.repeat(GRID_WIDTH) + '+';

    if (this.gameOver) {
      output += '\nGame Over! Final Score: ' + this.score;
    }

    return output;
  }

  public reset(): void {
    this.initializeSnake();
    this.placeFood();
    this.gameOver = false;
    this.score = 0;
  }
}

// CLI Interface
const readline = require('readline');
const game = new SnakeGame();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function printGame(): void {
  console.clear();
  console.log(game.render());
}

function handleInput(): void {
  rl.question('Enter direction (w=up, s=down, a=left, d=right, q=quit, r=restart): ', (answer: string) => {
    if (game.isGameOver() && answer.toLowerCase() !== 'r') {
      console.log('Game is over. Press r to restart or q to quit.');
      handleInput();
      return;
    }

    switch (answer.toLowerCase()) {
      case 'w': game.setDirection('up'); break;
      case 's': game.setDirection('down'); break;
      case 'a': game.setDirection('left'); break;
      case 'd': game.setDirection('right'); break;
      case 'r': game.reset(); break;
      case 'q': rl.close(); return;
    }

    game.move();
    printGame();

    if (!game.isGameOver()) {
      handleInput();
    } else {
      console.log('Press r to restart or q to quit.');
      handleInput();
    }
  });
}

printGame();
console.log('Use w/a/s/d to move, q to quit, r to restart');
handleInput();