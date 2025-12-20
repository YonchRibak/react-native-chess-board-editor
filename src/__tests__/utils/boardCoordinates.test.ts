import { calculateDropSquare, calculateBoardDropTarget } from '../../utils/boardCoordinates';
import type { BoardLayout } from '../../utils/boardCoordinates';

describe('boardCoordinates', () => {
  describe('calculateDropSquare', () => {
    const boardLayout: BoardLayout = {
      x: 0,
      y: 0,
      width: 404, // 8 * 50 + 4 (2px border on each side)
      height: 404,
    };
    const squareSize = 50;

    describe('normal board (not flipped)', () => {
      it('should calculate correct square for a1 (bottom-left)', () => {
        const result = calculateDropSquare(2, 352, boardLayout, squareSize, false);
        expect(result).toBe('a1');
      });

      it('should calculate correct square for h1 (bottom-right)', () => {
        const result = calculateDropSquare(352, 352, boardLayout, squareSize, false);
        expect(result).toBe('h1');
      });

      it('should calculate correct square for a8 (top-left)', () => {
        const result = calculateDropSquare(2, 2, boardLayout, squareSize, false);
        expect(result).toBe('a8');
      });

      it('should calculate correct square for h8 (top-right)', () => {
        const result = calculateDropSquare(352, 2, boardLayout, squareSize, false);
        expect(result).toBe('h8');
      });

      it('should calculate correct square for e4 (center)', () => {
        const result = calculateDropSquare(202, 202, boardLayout, squareSize, false);
        expect(result).toBe('e4');
      });

      it('should calculate correct square for d5', () => {
        const result = calculateDropSquare(152, 152, boardLayout, squareSize, false);
        expect(result).toBe('d5');
      });
    });

    describe('flipped board', () => {
      it('should calculate correct square for a1 (top-right when flipped)', () => {
        const result = calculateDropSquare(352, 2, boardLayout, squareSize, true);
        expect(result).toBe('a1');
      });

      it('should calculate correct square for h1 (top-left when flipped)', () => {
        const result = calculateDropSquare(2, 2, boardLayout, squareSize, true);
        expect(result).toBe('h1');
      });

      it('should calculate correct square for a8 (bottom-right when flipped)', () => {
        const result = calculateDropSquare(352, 352, boardLayout, squareSize, true);
        expect(result).toBe('a8');
      });

      it('should calculate correct square for h8 (bottom-left when flipped)', () => {
        const result = calculateDropSquare(2, 352, boardLayout, squareSize, true);
        expect(result).toBe('h8');
      });

      it('should calculate correct square for e4 when flipped', () => {
        // When flipped, to get e4 (row 4, col 4), we need pixel coords at row 3, col 3
        const result = calculateDropSquare(152, 152, boardLayout, squareSize, true);
        expect(result).toBe('e4');
      });
    });

    describe('board with offset position', () => {
      const offsetBoardLayout: BoardLayout = {
        x: 50,
        y: 100,
        width: 404,
        height: 404,
      };

      it('should handle board offset correctly', () => {
        const result = calculateDropSquare(52, 102, offsetBoardLayout, squareSize, false);
        expect(result).toBe('a8');
      });

      it('should handle board offset for center square', () => {
        const result = calculateDropSquare(252, 302, offsetBoardLayout, squareSize, false);
        expect(result).toBe('e4');
      });
    });

    describe('boundary cases', () => {
      it('should return null when dropped left of board', () => {
        const result = calculateDropSquare(-10, 200, boardLayout, squareSize, false);
        expect(result).toBeNull();
      });

      it('should return null when dropped right of board', () => {
        const result = calculateDropSquare(410, 200, boardLayout, squareSize, false);
        expect(result).toBeNull();
      });

      it('should return null when dropped above board', () => {
        const result = calculateDropSquare(200, -10, boardLayout, squareSize, false);
        expect(result).toBeNull();
      });

      it('should return null when dropped below board', () => {
        const result = calculateDropSquare(200, 410, boardLayout, squareSize, false);
        expect(result).toBeNull();
      });

      it('should return null when dropped exactly on left border', () => {
        const result = calculateDropSquare(0, 200, boardLayout, squareSize, false);
        expect(result).toBeNull();
      });

      it('should return null when dropped exactly on right edge', () => {
        const result = calculateDropSquare(404, 200, boardLayout, squareSize, false);
        expect(result).toBeNull();
      });
    });

    describe('different square sizes', () => {
      it('should work with larger square size', () => {
        const largeBoardLayout: BoardLayout = {
          x: 0,
          y: 0,
          width: 804, // 8 * 100 + 4
          height: 804,
        };
        // For e4 with squareSize=100: x = 2 + 4*100 = 402, y = 2 + 4*100 = 402
        const result = calculateDropSquare(402, 402, largeBoardLayout, 100, false);
        expect(result).toBe('e4');
      });

      it('should work with smaller square size', () => {
        const smallBoardLayout: BoardLayout = {
          x: 0,
          y: 0,
          width: 164, // 8 * 20 + 4
          height: 164,
        };
        const result = calculateDropSquare(82, 82, smallBoardLayout, 20, false);
        expect(result).toBe('e4');
      });
    });
  });

  describe('calculateBoardDropTarget', () => {
    const squareSize = 50;

    describe('basic drop target calculations', () => {
      it('should calculate drop target for top-left square center (0,0)', () => {
        const result = calculateBoardDropTarget(25, 25, squareSize);
        expect(result).toEqual({ row: 0, col: 0 });
      });

      it('should calculate drop target for top edge of first square', () => {
        const result = calculateBoardDropTarget(0, 0, squareSize);
        expect(result).toEqual({ row: 0, col: 0 });
      });

      it('should calculate drop target for middle square center (e4 = row 3, col 4)', () => {
        const result = calculateBoardDropTarget(225, 175, squareSize);
        expect(result).toEqual({ row: 3, col: 4 });
      });

      it('should calculate drop target for bottom-right square center (h1 = row 7, col 7)', () => {
        const result = calculateBoardDropTarget(375, 375, squareSize);
        expect(result).toEqual({ row: 7, col: 7 });
      });

      it('should calculate drop target at square boundary', () => {
        const result = calculateBoardDropTarget(50, 50, squareSize);
        expect(result).toEqual({ row: 1, col: 1 });
      });
    });

    describe('edge cases', () => {
      it('should return null when dropped left of board', () => {
        const result = calculateBoardDropTarget(-30, 100, squareSize);
        expect(result).toBeNull();
      });

      it('should return null when dropped above board', () => {
        const result = calculateBoardDropTarget(100, -30, squareSize);
        expect(result).toBeNull();
      });

      it('should return null when dropped right of board', () => {
        const result = calculateBoardDropTarget(425, 100, squareSize);
        expect(result).toBeNull();
      });

      it('should return null when dropped below board', () => {
        const result = calculateBoardDropTarget(100, 425, squareSize);
        expect(result).toBeNull();
      });

      it('should return null for negative row and col', () => {
        const result = calculateBoardDropTarget(-100, -100, squareSize);
        expect(result).toBeNull();
      });

      it('should return null for col >= 8', () => {
        const result = calculateBoardDropTarget(400, 100, squareSize);
        expect(result).toBeNull();
      });

      it('should return null for row >= 8', () => {
        const result = calculateBoardDropTarget(100, 400, squareSize);
        expect(result).toBeNull();
      });
    });

    describe('different square sizes', () => {
      it('should work with larger square size', () => {
        // 350 / 100 = 3.5, floor = 3 (center of 4th square, 0-indexed)
        const result = calculateBoardDropTarget(350, 350, 100);
        expect(result).toEqual({ row: 3, col: 3 });
      });

      it('should work with smaller square size', () => {
        // 70 / 20 = 3.5, floor = 3 (center of 4th square, 0-indexed)
        const result = calculateBoardDropTarget(70, 70, 20);
        expect(result).toEqual({ row: 3, col: 3 });
      });
    });

    describe('coordinate precision', () => {
      it('should correctly calculate for coordinates just before boundary', () => {
        // Dropping at x=49, y=49 (just before boundary at 50)
        // floor(49 / 50) = 0, which is still in first square
        const result = calculateBoardDropTarget(49, 49, squareSize);
        expect(result).toEqual({ row: 0, col: 0 });
      });

      it('should correctly calculate for coordinates exactly at square center', () => {
        // Dropping at x=25, y=25 (center of first square)
        // floor(25 / 50) = 0
        const result = calculateBoardDropTarget(25, 25, squareSize);
        expect(result).toEqual({ row: 0, col: 0 });
      });
    });
  });
});
