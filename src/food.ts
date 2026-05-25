import { Point, Food } from './types';
import { pointsEqual } from './point';

export { Food } from './types';
export type { Point };

export function createFood(position: Point): Food {
  return { position };
}

export function generateRandomFood(width: number, height: number, occupiedPoints: Point[]): Point {
  let position: Point;
  do {
    position = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height)
    };
  } while (occupiedPoints.some(point => pointsEqual(point, position)));
  return position;
}

export function isFoodAtPoint(food: Food, point: Point): boolean {
  return pointsEqual(food.position, point);
}