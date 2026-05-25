export interface Point {
  x: number;
  y: number;
}

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

export enum GameStatus {
  NOT_STARTED = 'NOT_STARTED',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER'
}

export interface Snake {
  body: Point[];
  direction: Direction;
  growing: boolean;
}

export interface Food {
  position: Point;
}

export interface GameState {
  snake: Snake;
  food: Food;
  boardWidth: number;
  boardHeight: number;
  status: GameStatus;
  score: number;
}

export type GameEventType = 'move' | 'eat' | 'collision' | 'gameOver';

export interface GameEvent {
  type: GameEventType;
  data?: unknown;
}