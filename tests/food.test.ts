import { createFood, generateRandomFood, isFoodAtPoint } from '../src/food';
import { createPoint } from '../src/point';

describe('Food', () => {
  describe('createFood', () => {
    it('should create food at given position', () => {
      const position = createPoint(5, 10);
      const food = createFood(position);
      expect(food.position).toEqual({ x: 5, y: 10 });
    });
  });

  describe('isFoodAtPoint', () => {
    it('should return true when food is at the point', () => {
      const food = createFood(createPoint(5, 5));
      expect(isFoodAtPoint(food, createPoint(5, 5))).toBe(true);
    });

    it('should return false when food is not at the point', () => {
      const food = createFood(createPoint(5, 5));
      expect(isFoodAtPoint(food, createPoint(6, 5))).toBe(false);
      expect(isFoodAtPoint(food, createPoint(5, 6))).toBe(false);
    });
  });

  describe('generateRandomFood', () => {
    it('should generate food within board bounds', () => {
      const occupiedPoints = [createPoint(5, 5)];
      for (let i = 0; i < 100; i++) {
        const food = generateRandomFood(20, 20, occupiedPoints);
        expect(food.x).toBeGreaterThanOrEqual(0);
        expect(food.x).toBeLessThan(20);
        expect(food.y).toBeGreaterThanOrEqual(0);
        expect(food.y).toBeLessThan(20);
      }
    });

    it('should not generate food on occupied points', () => {
      const occupiedPoints = [
        createPoint(5, 5),
        createPoint(6, 5),
        createPoint(7, 5)
      ];
      for (let i = 0; i < 100; i++) {
        const food = generateRandomFood(20, 20, occupiedPoints);
        const isOccupied = occupiedPoints.some(
          p => p.x === food.x && p.y === food.y
        );
        expect(isOccupied).toBe(false);
      }
    });

    it('should handle edge case when board is mostly occupied', () => {
      const occupiedPoints: Array<{ x: number; y: number }> = [];
      for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
          occupiedPoints.push({ x, y });
        }
      }
      const food = generateRandomFood(5, 5, occupiedPoints);
      expect(food.x).toBeGreaterThanOrEqual(0);
      expect(food.x).toBeLessThan(5);
      expect(food.y).toBeGreaterThanOrEqual(0);
      expect(food.y).toBeLessThan(5);
    });
  });
});