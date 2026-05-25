import { createPoint, pointsEqual, isValidPoint } from '../src/point';

describe('Point utilities', () => {
  describe('createPoint', () => {
    it('should create a point with given x and y coordinates', () => {
      const point = createPoint(5, 10);
      expect(point.x).toBe(5);
      expect(point.y).toBe(10);
    });
  });

  describe('pointsEqual', () => {
    it('should return true for points with same coordinates', () => {
      const p1 = createPoint(3, 4);
      const p2 = createPoint(3, 4);
      expect(pointsEqual(p1, p2)).toBe(true);
    });

    it('should return false for points with different x coordinates', () => {
      const p1 = createPoint(3, 4);
      const p2 = createPoint(5, 4);
      expect(pointsEqual(p1, p2)).toBe(false);
    });

    it('should return false for points with different y coordinates', () => {
      const p1 = createPoint(3, 4);
      const p2 = createPoint(3, 6);
      expect(pointsEqual(p1, p2)).toBe(false);
    });
  });

  describe('isValidPoint', () => {
    it('should return true for a point within board bounds', () => {
      expect(isValidPoint(createPoint(0, 0), 20, 20)).toBe(true);
      expect(isValidPoint(createPoint(19, 19), 20, 20)).toBe(true);
      expect(isValidPoint(createPoint(10, 10), 20, 20)).toBe(true);
    });

    it('should return false for a point with negative coordinates', () => {
      expect(isValidPoint(createPoint(-1, 0), 20, 20)).toBe(false);
      expect(isValidPoint(createPoint(0, -1), 20, 20)).toBe(false);
    });

    it('should return false for a point outside board bounds', () => {
      expect(isValidPoint(createPoint(20, 0), 20, 20)).toBe(false);
      expect(isValidPoint(createPoint(0, 20), 20, 20)).toBe(false);
    });
  });
});