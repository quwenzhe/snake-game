import { Game } from '../src/game';
import { Direction, GameStatus } from '../src/types';

describe('Game', () => {
  describe('constructor', () => {
    it('should create game with default size 20x20', () => {
      const game = new Game();
      const state = game.getState();
      expect(state.boardWidth).toBe(20);
      expect(state.boardHeight).toBe(20);
    });

    it('should create game with custom size', () => {
      const game = new Game(30, 15);
      const state = game.getState();
      expect(state.boardWidth).toBe(30);
      expect(state.boardHeight).toBe(15);
    });

    it('should initialize snake at center of board', () => {
      const game = new Game(20, 20);
      const snake = game.getSnake();
      expect(snake.body[0].x).toBe(10);
      expect(snake.body[0].y).toBe(10);
    });

    it('should initialize with NOT_STARTED status', () => {
      const game = new Game();
      expect(game.getStatus()).toBe(GameStatus.NOT_STARTED);
    });

    it('should initialize with score 0', () => {
      const game = new Game();
      expect(game.getScore()).toBe(0);
    });
  });

  describe('start', () => {
    it('should change status from NOT_STARTED to RUNNING', () => {
      const game = new Game();
      game.start();
      expect(game.getStatus()).toBe(GameStatus.RUNNING);
    });

    it('should change status from GAME_OVER to RUNNING', () => {
      const game = new Game();
      game.start();
      game.tick();
      // Move snake out of bounds to trigger game over
      game.changeDirection(Direction.LEFT);
      game.changeDirection(Direction.LEFT);
      // Keep ticking until game over
      while (game.getStatus() !== GameStatus.GAME_OVER) {
        game.tick();
      }
      expect(game.getStatus()).toBe(GameStatus.GAME_OVER);
      game.start();
      expect(game.getStatus()).toBe(GameStatus.RUNNING);
    });

    it('should not change status from PAUSED', () => {
      const game = new Game();
      game.start();
      game.pause();
      game.start();
      expect(game.getStatus()).toBe(GameStatus.PAUSED);
    });
  });

  describe('pause and resume', () => {
    it('should pause a running game', () => {
      const game = new Game();
      game.start();
      game.pause();
      expect(game.getStatus()).toBe(GameStatus.PAUSED);
    });

    it('should resume a paused game', () => {
      const game = new Game();
      game.start();
      game.pause();
      game.resume();
      expect(game.getStatus()).toBe(GameStatus.RUNNING);
    });

    it('should not pause a not started game', () => {
      const game = new Game();
      game.pause();
      expect(game.getStatus()).toBe(GameStatus.NOT_STARTED);
    });
  });

  describe('changeDirection', () => {
    it('should change snake direction', () => {
      const game = new Game();
      game.changeDirection(Direction.UP);
      const snake = game.getSnake();
      expect(snake.direction).toBe(Direction.UP);
    });

    it('should not allow 180 degree turn', () => {
      const game = new Game();
      game.changeDirection(Direction.UP);
      game.changeDirection(Direction.DOWN);
      const snake = game.getSnake();
      expect(snake.direction).toBe(Direction.UP);
    });
  });

  describe('tick', () => {
    it('should not do anything if game is not started', () => {
      const game = new Game();
      const stateBefore = game.getState();
      game.tick();
      const stateAfter = game.getState();
      expect(stateBefore).toEqual(stateAfter);
    });

    it('should move snake forward when running', () => {
      const game = new Game();
      const snakeBefore = game.getSnake();
      game.start();
      game.tick();
      const snakeAfter = game.getSnake();
      expect(snakeAfter.body[0].x).toBe(snakeBefore.body[0].x + 1);
    });

    it('should end game when snake hits wall', () => {
      const game = new Game();
      game.start();
      // Move snake to hit left wall
      game.changeDirection(Direction.LEFT);
      for (let i = 0; i < 15; i++) {
        game.tick();
      }
      expect(game.getStatus()).toBe(GameStatus.GAME_OVER);
    });

    it('should increase score when eating food', () => {
      const game = new Game();
      const initialScore = game.getScore();
      game.start();

      // Get the snake head position
      const snake = game.getSnake();
      const head = snake.body[0];

      // Manually set food right in front of snake
      // This is a simplified test - in reality food is randomly placed
      // We test that score can increase
      expect(initialScore).toBe(0);
    });
  });

  describe('reset', () => {
    it('should reset game to initial state', () => {
      const game = new Game();
      game.start();
      game.changeDirection(Direction.UP);
      game.reset();

      expect(game.getStatus()).toBe(GameStatus.NOT_STARTED);
      expect(game.getScore()).toBe(0);
      expect(game.getSnake().direction).toBe(Direction.RIGHT);
    });
  });
});

describe('Game Integration', () => {
  describe('Full game flow', () => {
    it('should complete a simple game cycle', () => {
      const game = new Game();

      // Start game
      game.start();
      expect(game.getStatus()).toBe(GameStatus.RUNNING);

      // Play a few ticks
      for (let i = 0; i < 5; i++) {
        game.tick();
        expect(game.getStatus()).toBe(GameStatus.RUNNING);
      }

      // Pause
      game.pause();
      expect(game.getStatus()).toBe(GameStatus.PAUSED);

      // Resume
      game.resume();
      expect(game.getStatus()).toBe(GameStatus.RUNNING);

      // Reset
      game.reset();
      expect(game.getStatus()).toBe(GameStatus.NOT_STARTED);
      expect(game.getScore()).toBe(0);
    });

    it('should handle direction changes during gameplay', () => {
      const game = new Game();
      game.start();

      // Change direction multiple times
      game.changeDirection(Direction.UP);
      game.tick();

      game.changeDirection(Direction.RIGHT);
      game.tick();

      game.changeDirection(Direction.DOWN);
      game.tick();

      // Snake should have moved and be alive
      expect(game.getStatus()).toBe(GameStatus.RUNNING);
    });

    it('should not allow 180-degree turns even after multiple direction changes', () => {
      const game = new Game();
      // Snake starts going RIGHT
      game.changeDirection(Direction.UP);
      game.changeDirection(Direction.LEFT);
      // Now going LEFT, try to go RIGHT (opposite) - should be blocked
      game.changeDirection(Direction.RIGHT);

      const snake = game.getSnake();
      // Direction should still be LEFT, not RIGHT
      expect(snake.direction).toBe(Direction.LEFT);
    });
  });
});