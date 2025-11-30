import {
  fileToCol,
  colToFile,
  rankToRow,
  rowToRank,
  squareToCoords,
  coordsToSquare,
  isValidSquare,
} from '../../utils/fen';

describe('FEN Coordinate Conversion', () => {
  describe('fileToCol', () => {
    it('should convert file letters to column indices', () => {
      expect(fileToCol('a')).toBe(0);
      expect(fileToCol('b')).toBe(1);
      expect(fileToCol('c')).toBe(2);
      expect(fileToCol('d')).toBe(3);
      expect(fileToCol('e')).toBe(4);
      expect(fileToCol('f')).toBe(5);
      expect(fileToCol('g')).toBe(6);
      expect(fileToCol('h')).toBe(7);
    });
  });

  describe('colToFile', () => {
    it('should convert column indices to file letters', () => {
      expect(colToFile(0)).toBe('a');
      expect(colToFile(1)).toBe('b');
      expect(colToFile(2)).toBe('c');
      expect(colToFile(3)).toBe('d');
      expect(colToFile(4)).toBe('e');
      expect(colToFile(5)).toBe('f');
      expect(colToFile(6)).toBe('g');
      expect(colToFile(7)).toBe('h');
    });
  });

  describe('rankToRow', () => {
    it('should convert rank numbers to row indices', () => {
      expect(rankToRow(8)).toBe(0);
      expect(rankToRow(7)).toBe(1);
      expect(rankToRow(6)).toBe(2);
      expect(rankToRow(5)).toBe(3);
      expect(rankToRow(4)).toBe(4);
      expect(rankToRow(3)).toBe(5);
      expect(rankToRow(2)).toBe(6);
      expect(rankToRow(1)).toBe(7);
    });
  });

  describe('rowToRank', () => {
    it('should convert row indices to rank numbers', () => {
      expect(rowToRank(0)).toBe(8);
      expect(rowToRank(1)).toBe(7);
      expect(rowToRank(2)).toBe(6);
      expect(rowToRank(3)).toBe(5);
      expect(rowToRank(4)).toBe(4);
      expect(rowToRank(5)).toBe(3);
      expect(rowToRank(6)).toBe(2);
      expect(rowToRank(7)).toBe(1);
    });
  });

  describe('squareToCoords', () => {
    it('should convert square notation to coordinates', () => {
      expect(squareToCoords('a1')).toEqual({ row: 7, col: 0 });
      expect(squareToCoords('a8')).toEqual({ row: 0, col: 0 });
      expect(squareToCoords('h1')).toEqual({ row: 7, col: 7 });
      expect(squareToCoords('h8')).toEqual({ row: 0, col: 7 });
      expect(squareToCoords('e4')).toEqual({ row: 4, col: 4 });
      expect(squareToCoords('d5')).toEqual({ row: 3, col: 3 });
    });
  });

  describe('coordsToSquare', () => {
    it('should convert coordinates to square notation', () => {
      expect(coordsToSquare({ row: 7, col: 0 })).toBe('a1');
      expect(coordsToSquare({ row: 0, col: 0 })).toBe('a8');
      expect(coordsToSquare({ row: 7, col: 7 })).toBe('h1');
      expect(coordsToSquare({ row: 0, col: 7 })).toBe('h8');
      expect(coordsToSquare({ row: 4, col: 4 })).toBe('e4');
      expect(coordsToSquare({ row: 3, col: 3 })).toBe('d5');
    });
  });

  describe('isValidSquare', () => {
    it('should validate correct square notation', () => {
      expect(isValidSquare('a1')).toBe(true);
      expect(isValidSquare('h8')).toBe(true);
      expect(isValidSquare('e4')).toBe(true);
      expect(isValidSquare('d5')).toBe(true);
    });

    it('should reject invalid square notation', () => {
      expect(isValidSquare('i1')).toBe(false);
      expect(isValidSquare('a9')).toBe(false);
      expect(isValidSquare('a0')).toBe(false);
      expect(isValidSquare('z5')).toBe(false);
      expect(isValidSquare('e')).toBe(false);
      expect(isValidSquare('4')).toBe(false);
      expect(isValidSquare('e44')).toBe(false);
      expect(isValidSquare('')).toBe(false);
    });
  });

  describe('coordinate roundtrip conversions', () => {
    it('should convert back and forth between square and coords', () => {
      const squares = ['a1', 'a8', 'h1', 'h8', 'e4', 'd5', 'c3', 'f6'];
      squares.forEach((square) => {
        const coords = squareToCoords(square);
        const backToSquare = coordsToSquare(coords);
        expect(backToSquare).toBe(square);
      });
    });

    it('should convert back and forth between file and col', () => {
      for (let col = 0; col < 8; col++) {
        const file = colToFile(col);
        const backToCol = fileToCol(file);
        expect(backToCol).toBe(col);
      }
    });

    it('should convert back and forth between rank and row', () => {
      for (let row = 0; row < 8; row++) {
        const rank = rowToRank(row);
        const backToRow = rankToRow(rank);
        expect(backToRow).toBe(row);
      }
    });
  });
});
