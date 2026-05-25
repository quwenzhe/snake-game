import { GameState, Direction, GameStatus, Point } from './types';
import { Snake, createSnake, updateSnakeBody, setDirection, checkSelfCollision, growSnake, resetGrowth } from './snake';
import { Food, createFood, generateRandomFood, isFoodAtPoint } from './food';
import { isValidPoint } from './point';

export class Game {
  private state: GameState;

  constructor(width: number = 20, height: number = 20) {
    this.state = this.createInitialState(width, height);
  }

  private createInitialState(width: number, height: number): GameState {
    const initialPosition: Point = { x: Math.floor(width / 2), y: Math.floor(height / 2) };
    const snake = createSnake(initialPosition, 3);
    const foodPosition = generateRandomFood(width, height, snake.body);
    const food = createFood(foodPosition);

    return {
      snake,
      food,
      boardWidth: width,
      boardHeight: height,
      status: GameStatus.NOT_STARTED,
      score: 0
    };
  }

  getState(): GameState {
    return { ...this.state };
  }

  getSnake(): Snake {
    return { ...this.state.snake, body: [...this.state.snake.body] };
  }

  getFood(): Food {
    return { ...this.state.food };
  }

  getScore(): number {
    return this.state.score;
  }

  getStatus(): GameStatus {
    return this.state.status;
  }

  start(): void {
    if (this.state.status === GameStatus.NOT_STARTED || this.state.status === GameStatus.GAME_OVER) {
      this.state.status = GameStatus.RUNNING;
    }
  }

  pause(): void {
    if (this.state.status === GameStatus.RUNNING) {
      this.state.status = GameStatus.PAUSED;
    }
  }

  resume(): void {
    if (this.state.status === GameStatus.PAUSED) {
      this.state.status = GameStatus.RUNNING;
    }
  }

  changeDirection(newDirection: Direction): void {
    this.state.snake = setDirection(this.state.snake, newDirection);
  }

  tick(): GameStatus {
    if (this.state.status !== GameStatus.RUNNING) {
      return this.state.status;
    }

    const head = this.state.snake.body[0];
    let newHead: Point;

    switch (this.state.snake.direction) {
      case Direction.UP:
        newHead = { x: head.x, y: head.y - 1 };
        break;
      case Direction.DOWN:
        newHead = { x: head.x, y: head.y + 1 };
        break;
      case Direction.LEFT:
        newHead = { x: head.x - 1, y: head.y };
        break;
      case Direction.RIGHT:
        newHead = { x: head.x + 1, y: head.y };
        break;
    }

    if (!isValidPoint(newHead, this.state.boardWidth, this.state.boardHeight)) {
      this.state.status = GameStatus.GAME_OVER;
      return this.state.status;
    }

    const snakeAfterMove = updateSnakeBody(this.state.snake, newHead);

    if (checkSelfCollision(snakeAfterMove)) {
      this.state.status = GameStatus.GAME_OVER;
      return this.state.status;
    }

    this.state.snake = snakeAfterMove;

    if (isFoodAtPoint(this.state.food, newHead)) {
      this.state.score += 10;
      this.state.snake = growSnake(this.state.snake);
      const newFoodPosition = generateRandomFood(
        this.state.boardWidth,
        this.state.boardHeight,
        this.state.snake.body
      );
      this.state.food = createFood(newFoodPosition);
    }

    return this.state.status;
  }

  reset(): void {
    this.state = this.createInitialState(this.state.boardWidth, this.state.boardHeight);
  }
}