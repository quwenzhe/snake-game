import { Point, Direction, Snake } from './types';
import { pointsEqual } from './point';

export { Snake } from './types';
export type { Point, Direction };

export function createSnake(initialPosition: Point, initialLength: number = 3): Snake {
  const body: Point[] = [];
  for (let i = 0; i < initialLength; i++) {
    body.push({ x: initialPosition.x - i, y: initialPosition.y });
  }
  return {
    body,
    direction: Direction.RIGHT,
    growing: false
  };
}

export function moveSnake(snake: Snake): Point {
  const head = snake.body[0];
  let newHead: Point;

  switch (snake.direction) {
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

  const newBody = [newHead, ...snake.body];

  if (!snake.growing) {
    newBody.pop();
  }

  return newHead;
}

export function growSnake(snake: Snake): Snake {
  return { ...snake, growing: true };
}

export function resetGrowth(snake: Snake): Snake {
  return { ...snake, growing: false };
}

export function setDirection(snake: Snake, newDirection: Direction): Snake {
  const oppositeDirections: Record<Direction, Direction> = {
    [Direction.UP]: Direction.DOWN,
    [Direction.DOWN]: Direction.UP,
    [Direction.LEFT]: Direction.RIGHT,
    [Direction.RIGHT]: Direction.LEFT
  };

  if (oppositeDirections[snake.direction] === newDirection) {
    return snake;
  }

  return { ...snake, direction: newDirection };
}

export function checkSelfCollision(snake: Snake): boolean {
  const head = snake.body[0];
  return snake.body.slice(1).some(bodyPart => pointsEqual(head, bodyPart));
}

export function updateSnakeBody(snake: Snake, newHead: Point): Snake {
  const newBody = [newHead, ...snake.body];
  if (!snake.growing) {
    newBody.pop();
  }
  return { ...snake, body: newBody, growing: false };
}