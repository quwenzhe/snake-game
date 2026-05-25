// Export modules for testing
export { Game } from './game';
export { GameStatus, Direction, Point, Snake, Food, GameState } from './types';
export { createSnake, moveSnake, growSnake, resetGrowth, setDirection, checkSelfCollision, updateSnakeBody } from './snake';
export { createFood, generateRandomFood, isFoodAtPoint } from './food';
export { createPoint, pointsEqual, isValidPoint } from './point';

// Snake Game CLI - TypeScript Implementation
import { Game, Direction, GameStatus } from './game';

const GRID_WIDTH = 20;
const GRID_HEIGHT = 15;

function render(game: Game): string {
  const state = game.getState();
  const EMPTY_CHAR = '.';
  const SNAKE_CHAR = 'O';
  const FOOD_CHAR = '*';

  const grid: string[][] = [];
  for (let y = 0; y < GRID_HEIGHT; y++) {
    grid[y] = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      grid[y][x] = EMPTY_CHAR;
    }
  }

  // Place food
  grid[state.food.position.y][state.food.position.x] = FOOD_CHAR;

  // Place snake
  for (const pos of state.snake.body) {
    grid[pos.y][pos.x] = SNAKE_CHAR;
  }

  let output = `Score: ${state.score}\n`;
  output += '+' + '-'.repeat(GRID_WIDTH) + '+\n';
  for (const row of grid) {
    output += '|' + row.join('') + '|\n';
  }
  output += '+' + '-'.repeat(GRID_WIDTH) + '+';

  if (state.status === GameStatus.GAME_OVER) {
    output += '\nGame Over! Final Score: ' + state.score;
  }

  return output;
}

function mapDirection(dir: string): Direction {
  switch (dir.toLowerCase()) {
    case 'w': return Direction.UP;
    case 's': return Direction.DOWN;
    case 'a': return Direction.LEFT;
    case 'd': return Direction.RIGHT;
    default: return Direction.RIGHT;
  }
}

// CLI Interface
const readline = require('readline');
const game = new Game(GRID_WIDTH, GRID_HEIGHT);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function printGame(): void {
  console.clear();
  console.log(render(game));
}

function handleInput(): void {
  rl.question('Enter direction (w=up, s=down, a=left, d=right, q=quit, r=restart): ', (answer: string) => {
    if (game.getStatus() === GameStatus.GAME_OVER && answer.toLowerCase() !== 'r') {
      console.log('Game is over. Press r to restart or q to quit.');
      handleInput();
      return;
    }

    switch (answer.toLowerCase()) {
      case 'w':
      case 's':
      case 'a':
      case 'd':
        game.changeDirection(mapDirection(answer));
        game.start();
        game.tick();
        break;
      case 'r':
        game.reset();
        break;
      case 'q':
        rl.close();
        return;
    }

    printGame();

    if (game.getStatus() !== GameStatus.GAME_OVER) {
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