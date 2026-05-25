import { createSnake, moveSnake, growSnake, resetGrowth, setDirection, checkSelfCollision, updateSnakeBody } from '../src/snake';
import { Direction, Point, Snake } from '../src/types';

describe('Snake', () => {
  describe('createSnake', () => {
    it('should create a snake with body starting at initial position', () => {
      const snake = createSnake({ x: 5, y: 5 }, 3);
      expect(snake.body.length).toBe(3);
      expect(snake.body[0]).toEqual({ x: 5, y: 5 });
      expect(snake.direction).toBe(Direction.RIGHT);
      expect(snake.growing).toBe(false);
    });

    it('should create snake body extending left from initial position', () => {
      const snake = createSnake({ x: 5, y: 5 }, 4);
      expect(snake.body).toEqual([
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 },
        { x: 2, y: 5 }
      ]);
    });
  });

  describe('moveSnake', () => {
    it('should move snake in current direction (RIGHT)', () => {
      const snake = createSnake({ x: 5, y: 5 }, 3);
      const newHead = moveSnake(snake);
      expect(newHead).toEqual({ x: 6, y: 5 });
    });

    it('should move snake UP correctly', () => {
      const snake = { ...createSnake({ x: 5, y: 5 }, 3), direction: Direction.UP };
      const newHead = moveSnake(snake);
      expect(newHead).toEqual({ x: 5, y: 4 });
    });

    it('should move snake DOWN correctly', () => {
      const snake = { ...createSnake({ x: 5, y: 5 }, 3), direction: Direction.DOWN };
      const newHead = moveSnake(snake);
      expect(newHead).toEqual({ x: 5, y: 6 });
    });

    it('should move snake LEFT correctly', () => {
      const snake = { ...createSnake({ x: 5, y: 5 }, 3), direction: Direction.LEFT };
      const newHead = moveSnake(snake);
      expect(newHead).toEqual({ x: 4, y: 5 });
    });

    it('should remove tail when not growing', () => {
      const snake = createSnake({ x: 5, y: 5 }, 3);
      // Original body: [{x:5,y:5}, {x:4,y:5}, {x:3,y:5}]
      // After move to {x:6,y:5}: [{x:6,y:5}, {x:5,y:5}, {x:4,y:5}] - tail removed
      const updatedSnake = updateSnakeBody(snake, { x: 6, y: 5 });
      expect(updatedSnake.body.length).toBe(3);
      expect(updatedSnake.body[updatedSnake.body.length - 1]).toEqual({ x: 4, y: 5 });
    });

    it('should not remove tail when growing', () => {
      const snake = { ...createSnake({ x: 5, y: 5 }, 3), growing: true };
      const updatedSnake = updateSnakeBody(snake, { x: 6, y: 5 });
      expect(updatedSnake.body.length).toBe(4);
    });
  });

  describe('growSnake', () => {
    it('should set growing to true', () => {
      const snake = createSnake({ x: 5, y: 5 }, 3);
      const grewSnake = growSnake(snake);
      expect(grewSnake.growing).toBe(true);
    });
  });

  describe('resetGrowth', () => {
    it('should set growing to false', () => {
      const snake = { ...createSnake({ x: 5, y: 5 }, 3), growing: true };
      const resetSnake = resetGrowth(snake);
      expect(resetSnake.growing).toBe(false);
    });
  });

  describe('setDirection', () => {
    it('should change direction to new direction', () => {
      const snake = createSnake({ x: 5, y: 5 }, 3);
      const newSnake = setDirection(snake, Direction.UP);
      expect(newSnake.direction).toBe(Direction.UP);
    });

    it('should not allow direction change to opposite direction (UP to DOWN)', () => {
      const snake = { ...createSnake({ x: 5, y: 5 }, 3), direction: Direction.UP };
      const newSnake = setDirection(snake, Direction.DOWN);
      expect(newSnake.direction).toBe(Direction.UP);
    });

    it('should not allow direction change to opposite direction (LEFT to RIGHT)', () => {
      const snake = { ...createSnake({ x: 5, y: 5 }, 3), direction: Direction.LEFT };
      const newSnake = setDirection(snake, Direction.RIGHT);
      expect(newSnake.direction).toBe(Direction.LEFT);
    });

    it('should allow perpendicular direction change', () => {
      const snake = { ...createSnake({ x: 5, y: 5 }, 3), direction: Direction.UP };
      const newSnake = setDirection(snake, Direction.LEFT);
      expect(newSnake.direction).toBe(Direction.LEFT);
    });
  });

  describe('checkSelfCollision', () => {
    it('should return false when snake does not collide with itself', () => {
      const snake = createSnake({ x: 5, y: 5 }, 3);
      expect(checkSelfCollision(snake)).toBe(false);
    });

    it('should return true when snake head hits its body', () => {
      const snake: Snake = {
        body: [
          { x: 5, y: 5 },
          { x: 6, y: 5 },
          { x: 6, y: 6 },
          { x: 5, y: 6 },
          { x: 5, y: 5 }
        ],
        direction: Direction.RIGHT,
        growing: false
      };
      expect(checkSelfCollision(snake)).toBe(true);
    });

    it('should return false when snake body is straight', () => {
      const snake: Snake = {
        body: [
          { x: 5, y: 5 },
          { x: 6, y: 5 },
          { x: 7, y: 5 },
          { x: 8, y: 5 }
        ],
        direction: Direction.RIGHT,
        growing: false
      };
      expect(checkSelfCollision(snake)).toBe(false);
    });
  });

  describe('updateSnakeBody', () => {
    it('should add new head to body', () => {
      const snake = createSnake({ x: 5, y: 5 }, 3);
      const updatedSnake = updateSnakeBody(snake, { x: 6, y: 5 });
      expect(updatedSnake.body[0]).toEqual({ x: 6, y: 5 });
      expect(updatedSnake.body.length).toBe(3);
    });

    it('should keep growing state false after move when not growing', () => {
      const snake = createSnake({ x: 5, y: 5 }, 3);
      const updatedSnake = updateSnakeBody(snake, { x: 6, y: 5 });
      expect(updatedSnake.growing).toBe(false);
    });
  });
});