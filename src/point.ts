import { Point } from './types';

export function createPoint(x: number, y: number): Point {
  return { x, y };
}

export function pointsEqual(p1: Point, p2: Point): boolean {
  return p1.x === p2.x && p1.y === p2.y;
}

export function isValidPoint(point: Point, width: number, height: number): boolean {
  return point.x >= 0 && point.x < width && point.y >= 0 && point.y < height;
}